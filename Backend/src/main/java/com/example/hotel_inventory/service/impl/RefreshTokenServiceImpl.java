package com.example.hotel_inventory.service.impl;

import com.example.hotel_inventory.model.RefreshToken;
import com.example.hotel_inventory.model.User;
import com.example.hotel_inventory.repository.RefreshTokenRepository;
import com.example.hotel_inventory.security.JwtUtil;
import com.example.hotel_inventory.service.RefreshTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {
    
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenServiceImpl.class);

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public RefreshToken createRefreshToken(User user) {
        // Revoke existing refresh tokens for the user
        revokeByUser(user);

        // Create new refresh token
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtUtil.getRefreshTokenExpiration() / 1000))
                .build();

        logger.info("Creating refresh token for user: {}", user.getEmail());
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expired. Please login again.");
        }
        return token;
    }

    @Override
    public void revokeByUser(User user) {
        logger.info("Revoking all refresh tokens for user: {}", user.getEmail());
        refreshTokenRepository.revokeAllByUser(user);
    }

    @Override
    public void revokeToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        logger.info("Revoked refresh token: {}", token.getToken());
    }

    @Override
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        logger.info("Deleted expired refresh tokens");
    }

    @Override
    public boolean isTokenActive(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findActiveByToken(token, LocalDateTime.now());
        return refreshToken.isPresent();
    }
}
