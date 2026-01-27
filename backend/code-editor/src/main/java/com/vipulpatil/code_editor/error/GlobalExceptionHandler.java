package com.vipulpatil.code_editor.error;

import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<ApiError> buildError(HttpStatus status, String message){
        ApiError apiError = new ApiError(message, status);
        return new ResponseEntity<>(apiError,status);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> handleUsernameNotFoundException(UsernameNotFoundException ex){
        return buildError(
                HttpStatus.NOT_FOUND,
                "Username not found"
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex){
        return buildError(
                HttpStatus.UNAUTHORIZED,
                "Invalid Credentials"
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleUserNotFoundException(BadRequestException ex){
        return buildError(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }
}
