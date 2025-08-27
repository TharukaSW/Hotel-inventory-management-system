package com.example.hotel_inventory.security;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    private static final String JWT_COOKIE_NAME = "auth-token";

    // For testing purposes
    public void doFilterInternalForTesting(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        doFilterInternal(request, response, filterChain);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Debug logging
        System.out.println("🔍 JWT Filter - Request: " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("🔍 JWT Filter - Authorization header: " + request.getHeader("Authorization"));
        
        // Try to get JWT from both Authorization header and cookie
        String jwt = getJwtFromRequest(request);
        System.out.println("🔍 JWT Filter - Extracted JWT: " + (jwt != null ? jwt.substring(0, Math.min(jwt.length(), 50)) + "..." : "null"));
        
        if (StringUtils.hasText(jwt) && jwtUtil.validateToken(jwt)) {
            System.out.println("✅ JWT Filter - Token is valid");
            String email = jwtUtil.getEmailFromToken(jwt);
            
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.isActive()) {
                    UserPrincipal userPrincipal = new UserPrincipal(user);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userPrincipal, null, userPrincipal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("✅ JWT Filter - Authentication set for user: " + email + " with authorities: " + userPrincipal.getAuthorities());
                }
            }
        } else {
            System.out.println("❌ JWT Filter - Token is invalid or missing");
        }
        
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // First try to get JWT from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        
        // Fallback to cookie
        return getJwtFromCookie(request);
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (JWT_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
