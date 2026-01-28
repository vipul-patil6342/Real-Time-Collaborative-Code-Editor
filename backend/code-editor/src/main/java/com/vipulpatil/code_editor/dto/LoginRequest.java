package com.vipulpatil.code_editor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username or Email is required")
    private String identity;

    @NotBlank(message = "Password is required")
    private String password;
}
