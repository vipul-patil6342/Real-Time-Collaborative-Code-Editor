package com.vipulpatil.code_editor.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class OtpUtil {

    private final PasswordEncoder encoder;

    public String generateOtp(){
        return String.valueOf(
                99999 + new Random().nextInt(900000)
        );
    }

    public String hashOtp(String otp){
        return encoder.encode(otp);
    }

    public boolean matches(String rawOtp , String hashedOtp){
        return encoder.matches(rawOtp, hashedOtp);
    }

}
