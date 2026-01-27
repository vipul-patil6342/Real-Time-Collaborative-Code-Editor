package com.vipulpatil.code_editor.controller;

import com.vipulpatil.code_editor.annotation.RateLimit;
import com.vipulpatil.code_editor.dto.*;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.security.service.AuthService;
import com.vipulpatil.code_editor.security.util.AuthUtil;
import com.vipulpatil.code_editor.service.PasswordResetOtpService;
import com.vipulpatil.code_editor.utils.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final AuthUtil authUtil;
    private final CookieUtil cookieUtil;
    private final PasswordResetOtpService passwordResetOtpService;

    private static final int COOKIE_AGE = 30 * 24 * 60 * 60;

    @PostMapping("/register")
    @RateLimit(limit = 5, window = 60)
    public ResponseEntity<SignupResponse> register(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @RateLimit(limit = 5, window = 60)
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(request);
        addAuthCookies(response, loginResponse);
        return ResponseEntity.ok("Logged in SuccessFully");
    }

    @GetMapping("/state")
    public ResponseEntity<UserAuth> getAuthState(
            @CookieValue(name = "refreshToken") String refreshToken
    ) {
        return ResponseEntity.ok(authService.getAuthState(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            log.info("authentication: {}", authentication);

            if (authentication != null && authentication.isAuthenticated()) {
                User user = (User) authentication.getPrincipal();
                authService.logout(user, refreshToken);
                log.info("User logged out: {}", user.getUsername());
            }

            clearAuthCookies(response);
            return ResponseEntity.ok("Logout Successful");
        } catch (Exception e) {
            log.error("Logout failed");
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String refreshTokenValue = authUtil.getValue(request);
        log.info("Received refresh token cookie: {}", refreshTokenValue);

        if (refreshTokenValue == null) {
            log.warn("Refresh attempt without valid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            LoginResponse loginResponse = authService.refreshToken(refreshTokenValue);
            addAuthCookies(response, loginResponse);
            log.info("Token refresh successful");

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            log.warn("Token refresh failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/forgot-password")
    @RateLimit(limit = 3, window = 60)
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest request) {
        passwordResetOtpService.sendPasswordResetOtp(request);
        return ResponseEntity.ok("If the email exists, an OTP has been sent.");
    }

    @PostMapping("/reset-password")
    @RateLimit(limit = 3, window = 60)
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetOtpService.resetPassword(request);
        return ResponseEntity.ok("Password reset successfully");
    }


    private void addAuthCookies(HttpServletResponse response, LoginResponse loginResponse) {
        addAccessTokenCookie(response, loginResponse.getAccessToken());
        response.addCookie(cookieUtil.create("refreshToken", loginResponse.getRefreshToken(), COOKIE_AGE));
    }

    private void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
        response.addCookie(cookieUtil.create("accessToken", accessToken, 10 * 60 * 1000));
    }

    private void clearAuthCookies(HttpServletResponse response) {
        response.addCookie(cookieUtil.create("accessToken", "", 0));
        response.addCookie(cookieUtil.create("refreshToken", "", 0));
    }
}
