package com.vipulpatil.code_editor.controller;

import com.vipulpatil.code_editor.dto.OtpRequest;
import com.vipulpatil.code_editor.dto.OtpVerifyRequest;
import com.vipulpatil.code_editor.service.EmailService;
import com.vipulpatil.code_editor.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {

    private final EmailService emailService;
    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody OtpRequest request){
        try{
            String otp = otpService.generateAndSaveOtp(request.getEmail());

            emailService.sendEmail(
                    request.getEmail(),
                    "Your OTP Code",
                    "Your OTP is " + otp + ". Valid for 10 minutes."
            );

            return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP : " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody OtpVerifyRequest request){
        boolean isValid = otpService.verifyOtpAndMarkEmailVerified(request.getEmail(), request.getOtp());

        if(isValid){
            return ResponseEntity.ok("OTP verified successfully");
        }else{
            return ResponseEntity.status(400).body("Invalid or Expired OTP");
        }
    }
}
