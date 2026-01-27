package com.vipulpatil.code_editor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long tokenId;

    private String refreshToken;

    private Instant expiry;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;
}
