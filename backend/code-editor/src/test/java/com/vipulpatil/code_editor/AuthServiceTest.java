package com.vipulpatil.code_editor;

import com.vipulpatil.code_editor.dto.LoginRequest;
import com.vipulpatil.code_editor.dto.LoginResponse;
import com.vipulpatil.code_editor.dto.SignupRequest;
import com.vipulpatil.code_editor.dto.SignupResponse;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.repository.UserRepository;
import com.vipulpatil.code_editor.security.service.AuthService;
import com.vipulpatil.code_editor.security.util.AuthUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    AuthUtil authUtil;

    @Mock
    AuthenticationManager authenticationManager;

    @InjectMocks
    AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {
        UUID mockUUID = UUID.randomUUID();
        when(passwordEncoder.encode("pass"))
                .thenReturn("encoded");

        when(userRepository.save(any(User.class))).thenAnswer(invocationOnMock -> {
            User savedUser = invocationOnMock.getArgument(0);
            savedUser.setId(mockUUID);
            return savedUser;
        });

        SignupRequest request = new SignupRequest();
        request.setUsername("user");
        request.setEmail("mail");
        request.setPassword("pass");

        SignupResponse response = authService.register(request);

        assertNotNull(response);
        verify(passwordEncoder).encode("pass");
        verify(userRepository).save(argThat(user ->
            user.getPassword().equals("encoded") &&
            user.getUsername().equals("user")
        ));
    }

    @Test
    void shouldLoginSuccessfully() {
        UUID mockUUID = UUID.randomUUID();
        LoginRequest request = new LoginRequest("user@gmail.com", "password");
        User mockUser = new User();
        mockUser.setId(mockUUID);
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authUtil.generateAccessToken(mockUser)).thenReturn("jwt-token");

        LoginResponse result = authService.login(request);

        assertNotNull(result);
        assertEquals("jwt-token", result.getJwt());
        assertEquals(mockUUID, result.getUserId());
    }
}
