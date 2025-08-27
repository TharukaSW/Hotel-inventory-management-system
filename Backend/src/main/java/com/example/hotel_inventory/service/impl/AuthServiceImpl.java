package com.example.hotel_inventory.service.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.dto.request.LoginRequest;
import com.example.hotel_inventory.dto.request.RefreshTokenRequest;
import com.example.hotel_inventory.dto.response.LoginResponse;
import com.example.hotel_inventory.dto.response.RefreshTokenResponse;
import com.example.hotel_inventory.model.RefreshToken;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.UserRepository;
import com.example.hotel_inventory.security.JwtUtil;
import com.example.hotel_inventory.security.UserPrincipal;
import com.example.hotel_inventory.service.AuthService;
import com.example.hotel_inventory.service.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final String JWT_COOKIE_NAME = "auth-token";
    private static final String REFRESH_COOKIE_NAME = "refresh-token";
    private static final int COOKIE_EXPIRY = 24 * 60 * 60; // 24 hours in seconds
    private static final int REFRESH_COOKIE_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                logger.warn("Login attempt with invalid email: {}", loginRequest.getEmail());
                return LoginResponse.failure("Invalid email or password");
            }

            User user = userOptional.get();
            
            // Check if user is active
            if (!user.isActive()) {
                logger.warn("Login attempt with inactive user: {}", loginRequest.getEmail());
                return LoginResponse.failure("Account is inactive");
            }

            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                logger.warn("Login attempt with invalid password for user: {}", loginRequest.getEmail());
                return LoginResponse.failure("Invalid username or password");
            }

            // Generate JWT access token
            String accessToken = jwtUtil.generateToken(user);
            
            // Create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
            
            // Create HTTP-only cookies for security
            createAuthCookie(response, accessToken, COOKIE_EXPIRY);
            createRefreshCookie(response, refreshToken.getToken(), REFRESH_COOKIE_EXPIRY);

            // Create user info for response
            LoginResponse.UserInfo userInfo = LoginResponse.UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole().name())
                    .isActive(user.isActive())
                    .build();

            logger.info("User logged in successfully: {}", user.getEmail());
            return LoginResponse.success(accessToken, refreshToken.getToken(), userInfo, 
                    jwtUtil.getAccessTokenExpiration() / 1000);

        } catch (Exception e) {
            logger.error("Login error for user: {}", loginRequest.getEmail(), e);
            return LoginResponse.failure("Login failed due to server error");
        }
    }

    @Override
    public void logout(HttpServletResponse response) {
        try {
            // Clear the authentication context
            SecurityContextHolder.clearContext();

            // Create a cookie with the same name but expired
            Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, "");
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(0); // Expires immediately
            response.addCookie(jwtCookie);

            logger.info("User logged out successfully");
        } catch (Exception e) {
            logger.error("Logout error", e);
        }
    }

    @Override
    public UserDto getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                return UserDto.fromEntity(userPrincipal.getUser());
            }
            return null;
        } catch (Exception e) {
            logger.error("Error getting current user", e);
            return null;
        }
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest, HttpServletResponse response) {
        try {
            String requestRefreshToken = refreshTokenRequest.getRefreshToken();
            
            // Find and validate refresh token
            Optional<RefreshToken> refreshTokenOpt = refreshTokenService.findByToken(requestRefreshToken);
            if (refreshTokenOpt.isEmpty()) {
                logger.warn("Invalid refresh token provided");
                return RefreshTokenResponse.failure("Invalid refresh token");
            }

            RefreshToken refreshToken = refreshTokenOpt.get();
            
            // Verify token is not expired
            refreshTokenService.verifyExpiration(refreshToken);
            
            User user = refreshToken.getUser();
            
            // Generate new access token
            String newAccessToken = jwtUtil.generateToken(user);
            
            // Create new refresh token and revoke old one
            RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
            
            // Set cookies
            createAuthCookie(response, newAccessToken, COOKIE_EXPIRY);
            createRefreshCookie(response, newRefreshToken.getToken(), REFRESH_COOKIE_EXPIRY);

            logger.info("Token refreshed successfully for user: {}", user.getEmail());
            return RefreshTokenResponse.success(newAccessToken, newRefreshToken.getToken(), 
                    jwtUtil.getAccessTokenExpiration() / 1000);

        } catch (Exception e) {
            logger.error("Token refresh error", e);
            return RefreshTokenResponse.failure("Token refresh failed: " + e.getMessage());
        }
    }

    @Override
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               authentication.getPrincipal() instanceof UserPrincipal;
    }

    private void createAuthCookie(HttpServletResponse response, String token, int maxAge) {
        Cookie jwtCookie = new Cookie(JWT_COOKIE_NAME, token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to true in production with HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(maxAge);
        response.addCookie(jwtCookie);
    }

    private void createRefreshCookie(HttpServletResponse response, String token, int maxAge) {
        Cookie refreshCookie = new Cookie(REFRESH_COOKIE_NAME, token);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false); // Set to true in production with HTTPS
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(maxAge);
        response.addCookie(refreshCookie);
    }
}
