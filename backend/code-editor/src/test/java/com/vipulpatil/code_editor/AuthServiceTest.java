package com.vipulpatil.code_editor;

import com.vipulpatil.code_editor.dto.UserRequest;
import com.vipulpatil.code_editor.repository.UserRepository;
import com.vipulpatil.code_editor.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    AuthService authService;

    @Test
    void shouldEncodePasswordBeforeSaving(){
        when(passwordEncoder.encode("pass"))
                .thenReturn("encoded");

        UserRequest request = new UserRequest();
        request.setUsername("user");
        request.setEmail("mail");
        request.setPassword("pass");

        authService.register(request);

        verify(passwordEncoder).encode("pass");
    }
}
