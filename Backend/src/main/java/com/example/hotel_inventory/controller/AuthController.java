package com.example.hotel_inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.dto.request.LoginRequest;
import com.example.hotel_inventory.dto.request.RefreshTokenRequest;
import com.example.hotel_inventory.dto.response.LoginResponse;
import com.example.hotel_inventory.dto.response.RefreshTokenResponse;
import com.example.hotel_inventory.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest, 
                                             HttpServletResponse response) {
        log.info("Login attempt for email: {}", loginRequest.getEmail());
        LoginResponse loginResponse = authService.login(loginRequest, response);
        
        if (loginResponse.isSuccess()) {
            log.info("Login successful for user: {}", loginRequest.getEmail());
            return ResponseEntity.ok(loginResponse);
        } else {
            log.warn("Login failed for email: {}", loginRequest.getEmail());
            return ResponseEntity.status(401).body(loginResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto currentUser = authService.getCurrentUser();
        if (currentUser != null) {
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest,
                                                           HttpServletResponse response) {
        log.info("Token refresh attempt");
        RefreshTokenResponse refreshResponse = authService.refreshToken(refreshTokenRequest, response);
        
        if (refreshResponse.isSuccess()) {
            log.info("Token refresh successful");
            return ResponseEntity.ok(refreshResponse);
        } else {
            log.warn("Token refresh failed: {}", refreshResponse.getMessage());
            return ResponseEntity.status(401).body(refreshResponse);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAuthentication() {
        boolean isAuthenticated = authService.isAuthenticated();
        return ResponseEntity.ok(isAuthenticated);
    }
}
