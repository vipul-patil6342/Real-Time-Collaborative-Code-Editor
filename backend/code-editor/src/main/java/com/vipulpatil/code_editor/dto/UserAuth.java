package com.vipulpatil.code_editor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuth {
    private boolean authenticated;
    private UUID userId;
    private String username;
}
