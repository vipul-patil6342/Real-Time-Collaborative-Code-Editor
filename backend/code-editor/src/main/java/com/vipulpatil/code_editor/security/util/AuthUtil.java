package com.vipulpatil.code_editor.security.util;

import com.vipulpatil.code_editor.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class AuthUtil {

    @Value("${jwt.secret-key}")
    private String jwtSecretKey;

    @Value("${jwt.access-token.expiration}")
    private long accessTokenExpiration;

    private SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSecretKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token can not be null or empty");
        }

        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookie = request.getCookies();

        if (cookie == null || cookie.length == 0) {
            return null;
        }

        for (Cookie c : cookie) {
            if ("accessToken".equals(c.getName())) {
                return c.getValue();
            }
        }

        return null;
    }

    public String getValue(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (var cookie : request.getCookies()) {
            if (cookie.getName().equals("refreshToken")) {
                return cookie.getValue();
            }
        }

        return null;
    }
}
