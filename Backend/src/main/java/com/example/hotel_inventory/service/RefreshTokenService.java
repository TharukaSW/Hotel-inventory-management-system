package com.example.hotel_inventory.service;

import com.example.hotel_inventory.model.RefreshToken;
import com.example.hotel_inventory.model.User;

import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    Optional<RefreshToken> findByToken(String token);
    RefreshToken verifyExpiration(RefreshToken token);
    void revokeByUser(User user);
    void revokeToken(RefreshToken token);
    void deleteExpiredTokens();
    boolean isTokenActive(String token);
}
