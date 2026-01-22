package com.vipulpatil.code_editor.service;

import com.vipulpatil.code_editor.dto.UserRequest;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public String register(UserRequest request) {
        if(request.getUsername().isEmpty() || request.getEmail().isEmpty() || request.getPassword().isEmpty()){
            throw new RuntimeException("All fields are required");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return "Registered successfully";
    }
}
