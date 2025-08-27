package com.example.hotel_inventory.service;

import com.example.hotel_inventory.dto.UserDto;
import com.example.hotel_inventory.dto.request.LoginRequest;
import com.example.hotel_inventory.dto.request.RefreshTokenRequest;
import com.example.hotel_inventory.dto.response.LoginResponse;
import com.example.hotel_inventory.dto.response.RefreshTokenResponse;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    /**
     * Authenticate user with email and password
     * @param loginRequest Login credentials
     * @param response HTTP response for setting cookies
     * @return Login response with user info and success status
     */
    LoginResponse login(LoginRequest loginRequest, HttpServletResponse response);

    /**
     * Refresh access token using refresh token
     * @param refreshTokenRequest Refresh token request
     * @param response HTTP response for setting cookies
     * @return Refresh token response with new access token
     */
    RefreshTokenResponse refreshToken(RefreshTokenRequest refreshTokenRequest, HttpServletResponse response);

    /**
     * Logout current user by clearing session and cookies
     * @param response HTTP response for clearing cookies
     */
    void logout(HttpServletResponse response);

    /**
     * Get current authenticated user
     * @return Current user DTO or null if not authenticated
     */
    UserDto getCurrentUser();

    /**
     * Validate if user has valid authentication
     * @return true if user is authenticated
     */
    boolean isAuthenticated();
}
