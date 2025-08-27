package com.example.hotel_inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
    private UserInfo user;
    private long expiresIn; // Token expiration time in seconds

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private boolean isActive;
    }

    public static LoginResponse success(String accessToken, String refreshToken, UserInfo user, long expiresIn) {
        return LoginResponse.builder()
                .success(true)
                .message("Login successful")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .expiresIn(expiresIn)
                .build();
    }

    public static LoginResponse failure(String message) {
        return LoginResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
