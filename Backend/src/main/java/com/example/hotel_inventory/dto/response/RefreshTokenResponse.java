package com.example.hotel_inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshTokenResponse {
    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
    private long expiresIn;

    public static RefreshTokenResponse success(String accessToken, String refreshToken, long expiresIn) {
        return RefreshTokenResponse.builder()
                .success(true)
                .message("Token refreshed successfully")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(expiresIn)
                .build();
    }

    public static RefreshTokenResponse failure(String message) {
        return RefreshTokenResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
