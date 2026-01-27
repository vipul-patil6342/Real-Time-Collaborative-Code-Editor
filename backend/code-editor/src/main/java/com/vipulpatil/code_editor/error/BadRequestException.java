package com.vipulpatil.code_editor.error;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message){
        super(message);
    }
}
