package com.safecircle.backend.controller;

import com.safecircle.backend.dto.LiveLocationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/location")
    public void sendLocation(@Payload LiveLocationMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/location/" + message.getJourneyId(),
                message
        );
    }
}