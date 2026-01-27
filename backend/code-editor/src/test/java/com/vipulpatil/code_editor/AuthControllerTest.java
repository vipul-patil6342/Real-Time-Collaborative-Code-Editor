package com.vipulpatil.code_editor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vipulpatil.code_editor.entity.User;
import com.vipulpatil.code_editor.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveUserInDb() throws Exception {
        User user = new User();

        user.setUsername("user");
        user.setEmail("user@gmail.com");
        user.setPassword("pass");

        mockMvc.perform(
                post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user))
        )
                .andExpect(status().isOk());

        User savedUser = userRepository.findByUsernameOrEmail("user")
                .orElseThrow(() -> new RuntimeException("User not found"));

        assertEquals("user@gmail.com",savedUser.getEmail());

        assertNotEquals("pass",savedUser.getPassword());
    }
}
