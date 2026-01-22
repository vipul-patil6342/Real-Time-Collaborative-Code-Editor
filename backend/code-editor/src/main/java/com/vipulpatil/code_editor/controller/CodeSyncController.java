package com.vipulpatil.code_editor.controller;

import com.vipulpatil.code_editor.dto.CodeMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CodeSyncController {

    @MessageMapping("/code.sync")
    @SendTo("/topic/code")
    public CodeMessage syncCode(CodeMessage message) {
        System.out.println("Received code from room: " + message.getRoomId());
        return message;
    }
}
