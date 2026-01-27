package com.vipulpatil.code_editor.service;


import com.vipulpatil.code_editor.dto.OtpRequest;
import com.vipulpatil.code_editor.dto.PasswordResetRequest;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.error.BadRequestException;
import com.vipulpatil.code_editor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetOtpService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public void sendPasswordResetOtp(OtpRequest request) {

        userRepository.findByUsernameOrEmail(request.getEmail())
                .ifPresent(user -> {
                    String otp = otpService.generateAndSaveOtp(request.getEmail());

                    emailService.sendEmail(
                            request.getEmail(),
                            "Password Reset OTP",
                            "Your OTP is : " + otp + ".\nValid for 10 minutes."
                    );
                });
    }

    public void resetPassword(PasswordResetRequest request){
        boolean verified = otpService.verifyOtp(request.getEmail(), request.getOtp());

        if(!verified){
            throw new BadRequestException("Invalid or Expired OTP");
        }

        User user = userRepository.findByUsernameOrEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
