package com.vipulpatil.code_editor.security.service;

import com.vipulpatil.code_editor.dto.*;
import com.vipulpatil.code_editor.entity.RefreshToken;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.error.BadRequestException;
import com.vipulpatil.code_editor.repository.UserRepository;
import com.vipulpatil.code_editor.security.util.AuthUtil;
import com.vipulpatil.code_editor.service.RefreshTokenService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Ref;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final RefreshTokenService refreshTokenService;

    @CacheEvict(value = "state", key = "#refreshToken")
    public void evictAuthState(String refreshToken){}

    public SignupResponse register(SignupRequest request) {

        User existing = userRepository.findByUsernameOrEmail(request.getUsername()).orElse(null);

        if(existing != null){
            if(existing.isEmailVerified()){
                log.error("User already exists with username : {}", request.getUsername());
                throw new BadRequestException("User already exists");
            }

            userRepository.delete(existing);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return new SignupResponse(user.getId(), user.getEmail());
    }

    public LoginResponse login(LoginRequest request){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentity(),request.getPassword())
        );

        User user = (User) authentication.getPrincipal();

        if(!user.isEmailVerified()){
            throw new RuntimeException("Email not verified. Please verify your email before login.");
        }

        String token = authUtil.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new LoginResponse(token , refreshToken.getRefreshToken(),  user.getId());
    }

    public void logout(User user, String refreshToken){
        if(user == null) return;

        if(refreshToken != null){
            evictAuthState(refreshToken);
        }

        refreshTokenService.deleteRefreshTokenByUser(user);
    }

    @Transactional
    public LoginResponse refreshToken(String refreshTokenValue){
        RefreshToken token = refreshTokenService.verifyRefreshToken(refreshTokenValue);
        User user = token.getUser();

        String newAccessToken = authUtil.generateAccessToken(user);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        log.info("Refresh token rotated for user: {}", user.getUsername());

        return new LoginResponse(
                newAccessToken,
                newRefreshToken.getRefreshToken(),
                user.getId()
        );
    }

    @Transactional
    @Cacheable(value = "state", key = "#refreshToken", condition = "#refreshToken != null && !#refreshToken.isBlank()")
    public UserAuth getAuthState(String refreshToken){
        if(refreshToken == null || refreshToken.isBlank()){
            return new UserAuth(
                    false,
                    null,
                    null
            );
        }

        try{
            RefreshToken token = refreshTokenService.verifyRefreshToken(refreshToken);
            User user = token.getUser();

            return new UserAuth(
                    true,
                    user.getId(),
                    user.getUsername()
            );
        } catch (Exception e) {
            return new UserAuth(false, null, null);
        }
    }
}
