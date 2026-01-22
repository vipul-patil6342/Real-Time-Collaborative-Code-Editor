package com.vipulpatil.code_editor.service;

import com.vipulpatil.code_editor.dto.RoomResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RoomService {

    public RoomResponse createRoom(){
        String roomId = UUID.randomUUID().toString();
        return new RoomResponse(roomId);
    }
}
