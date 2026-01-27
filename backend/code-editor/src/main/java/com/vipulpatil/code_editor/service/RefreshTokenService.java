package com.vipulpatil.code_editor.service;

import com.vipulpatil.code_editor.entity.RefreshToken;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.error.BadRequestException;
import com.vipulpatil.code_editor.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public RefreshToken createRefreshToken(User user){
        if(user == null || user.getId() == null){
            throw new BadRequestException("User cannot be null");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(RefreshToken.builder()
                        .user(user)
                        .build());

        refreshToken.setRefreshToken(UUID.randomUUID().toString());
        refreshToken.setExpiry(Instant.now().plusMillis(refreshTokenExpiration));

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.debug("Refresh token created for user: {}", user.getUsername());
        return saved;
    }

    @Transactional
    public RefreshToken verifyRefreshToken(String refreshToken){
        if(refreshToken == null || refreshToken.isBlank()){
            throw new BadRequestException("Refresh token cannot be null or empty");
        }

        RefreshToken token = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> {
                    log.warn("Invalid refresh token attempt");
                    return new BadRequestException("Invalid refresh token");
                });

        if(token.getExpiry().isBefore(Instant.now())){
            log.warn("Refresh token expired for user: {}", token.getUser().getUsername());
            deleteRefreshToken(refreshToken);
            throw new BadRequestException("Refresh token expired");
        }

        return token;
    }

    @Transactional
    private void deleteRefreshToken(String refreshToken) {
        refreshTokenRepository.deleteByRefreshToken(refreshToken);
        log.debug("Refresh token deleted");
    }

    @Transactional
    public void deleteRefreshTokenByUser(User user){
        if(user == null || user.getId() == null){
            throw new BadRequestException("User cannot be null");
        }

        refreshTokenRepository.deleteByUser(user);
        log.info("Refresh token deleted for user: {}", user.getUsername());
    }
}
