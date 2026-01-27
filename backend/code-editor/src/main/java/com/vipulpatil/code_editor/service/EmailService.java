package com.vipulpatil.code_editor.service;

import com.vipulpatil.code_editor.error.BadRequestException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${smtp.api-key}")
    private String apiKey;

    @Value("${smtp.from-email}")
    private String fromEmail;

    private final RestTemplate restTemplate;

    @Async
    public void sendEmail(String to, String subject, String body) {

        validatedEmailInput(to, subject, body);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);
            log.debug("api-key: {}",apiKey);

            Map<String, Object> payload = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "CodeSync"),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", body.replace("\n", "<br>")
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            restTemplate.postForEntity("https://api.brevo.com/v3/smtp/email", request, String.class);
        } catch (Exception e) {
            log.error("Brevo API error : {}", e.getMessage());
            throw new RuntimeException("Failed to send email. Please try again later.");
        }
    }

    private void validatedEmailInput(String to, String subject, String body) {

        if (to == null || to.isBlank()) {
            throw new BadRequestException("Recipient email cannot be null or blank");
        }

        if (!isValidEmail(to)) {
            throw new BadRequestException("Invalid email format");
        }

        if (subject == null || subject.isBlank()) {
            throw new BadRequestException("Email subject cannot be empty");
        }

        if (body == null || body.isBlank()) {
            throw new BadRequestException("Email body cannot be empty");
        }

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalArgumentException("SMTP fromEmail is not configured");
        }
    }

    private boolean isValidEmail(String email) {
        try {
            InternetAddress address = new InternetAddress(email);
            address.validate();
            return true;
        } catch (AddressException e) {
            return false;
        }
    }


}
