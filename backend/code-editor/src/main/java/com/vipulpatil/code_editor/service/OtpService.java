package com.vipulpatil.code_editor.service;

import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.error.BadRequestException;
import com.vipulpatil.code_editor.repository.UserRepository;
import com.vipulpatil.code_editor.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final StringRedisTemplate template;
    private final OtpUtil otpUtil;
    private final UserRepository userRepository;

    private static final long OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String OTP_ATTEMPT_PREFIX = "otp_attempts:";

    public String generateAndSaveOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email cannot be null or blank");
        }
        String otp = otpUtil.generateOtp();
        String hashedOtp = otpUtil.hashOtp(otp);

        template.opsForValue().set(
                OTP_KEY_PREFIX + email,
                hashedOtp,
                OTP_EXPIRY_MINUTES,
                TimeUnit.MINUTES
        );

        template.opsForValue().set(
                OTP_ATTEMPT_PREFIX + email,
                "0",
                OTP_EXPIRY_MINUTES,
                TimeUnit.MINUTES
        );
        log.info("OTP is : {}" , hashedOtp);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        if (email == null || email.isBlank() || otp == null || otp.isBlank()) {
            return false;
        }

        String otpKey = OTP_KEY_PREFIX + email;
        String attemptKey = OTP_ATTEMPT_PREFIX + email;

        String storedHash = template.opsForValue().get(otpKey);

        if (storedHash == null) {
            return false;
        }

        String attemptValue = template.opsForValue().get(attemptKey);
        int attempts = attemptValue != null ? Integer.parseInt(attemptValue) : 0;

        if (attempts >= MAX_ATTEMPTS) {
            template.delete(otpKey);
            template.delete(attemptKey);
            return false;
        }

        if (otpUtil.matches(otp, storedHash)) {
            template.delete(otpKey);
            template.delete(attemptKey);
            return true;
        }

        template.opsForValue().increment(attemptKey);
        return false;
    }

    public boolean verifyOtpAndMarkEmailVerified(String email, String otp) {

        if (!verifyOtp(email, otp)) {
            throw new BadRequestException("Invalid or Expired OTP");
        }

        User user = userRepository.findByUsernameOrEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);

        return true;
    }
}
