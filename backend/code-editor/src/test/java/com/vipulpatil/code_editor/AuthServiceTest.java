package com.vipulpatil.code_editor;

import com.vipulpatil.code_editor.dto.*;
import com.vipulpatil.code_editor.entity.RefreshToken;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.error.BadRequestException;
import com.vipulpatil.code_editor.repository.UserRepository;
import com.vipulpatil.code_editor.security.service.AuthService;
import com.vipulpatil.code_editor.security.util.AuthUtil;
import com.vipulpatil.code_editor.service.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
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

    @Mock
    RefreshTokenService refreshTokenService;

    @InjectMocks
    AuthService authService;

    private User user;

    @BeforeEach
    void setUp(){
        user = new User();
        user.setId(UUID.fromString("0a9f2aff-b1fd-4ab2-9b33-5b7d7064fa92"));
        user.setEmail("user@gmail.com");
        user.setUsername("user123");
        user.setPassword("12345678");
        user.setEmailVerified(true);
    }

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
    void shouldRegisterFailsIfUserExists(){
        SignupRequest request = new SignupRequest("user123","user1@gmail.com","12345678");

        user.setEmailVerified(true);

        when(userRepository.findByUsernameOrEmail("user123"))
                .thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class,
                () -> authService.register(request));
    }

    @Test
    void shouldRegisterReplacesUnverifiedUsers(){
        SignupRequest request = new SignupRequest("user123","user2@gmail.com","12345678");

        user.setEmailVerified(false);

        when(userRepository.findByUsernameOrEmail("user123"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode(any())).thenReturn("encoded");

        authService.register(request);

        verify(userRepository).delete(user);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldLoginSuccessfully() {
        UUID mockUUID = UUID.randomUUID();
        LoginRequest request = new LoginRequest("user@gmail.com", "password");
        User mockUser = new User();
        mockUser.setId(mockUUID);
        mockUser.setEmailVerified(true);
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(authUtil.generateAccessToken(mockUser)).thenReturn("jwt-token");

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setRefreshToken("refresh-token");
        when(refreshTokenService.createRefreshToken(mockUser))
                .thenReturn(refreshToken);

        LoginResponse result = authService.login(request);

        assertNotNull(result);
        assertEquals("jwt-token", result.getAccessToken());
        assertEquals(mockUUID, result.getUserId());
    }

    @Test
    void shouldLoginFailsIfEmailNotVerified(){
        user.setEmailVerified(false);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null);

        when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);

        assertThrows(RuntimeException.class,
                () -> authService.login(new LoginRequest("user123","12345678")));
    }

    @Test
    void shouldLogoutSuccessfully(){
        authService.logout(user,"refresh-token");

        verify(refreshTokenService)
                .deleteRefreshTokenByUser(user);
    }

    @Test
    void shouldLogoutForNoUser(){
        authService.logout(null,null);

        verifyNoInteractions(refreshTokenService);
    }

    @Test
    void ShouldGetAuthStateForValidToken(){
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);

        when(refreshTokenService.verifyRefreshToken("refresh-token"))
                .thenReturn(refreshToken);

        UserAuth auth = authService.getAuthState("refresh-token");

        assertTrue(auth.isAuthenticated());
        assertEquals("user123",auth.getUsername());
    }

    @Test
    void shouldGetAuthStateForInvalidToken(){
        when(refreshTokenService.verifyRefreshToken(any()))
                .thenThrow(RuntimeException.class);

        UserAuth auth = authService.getAuthState("bad-token");

        assertFalse(auth.isAuthenticated());
    }

    @Test
    void shouldGetAuthStateForNull(){
        UserAuth auth = authService.getAuthState(null);

        assertFalse(auth.isAuthenticated());
    }
}
