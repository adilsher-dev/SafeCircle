package com.safecircle.backend.service;

import com.safecircle.backend.dto.AlertMessage;
import com.safecircle.backend.dto.JourneyStatusMessage;
import com.safecircle.backend.dto.LiveLocationMessage;
import com.safecircle.backend.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketServiceImpl implements WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendLiveLocation(LiveLocationMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/location/" + message.getJourneyId(),
                message
        );
    }

    @Override
    public void sendAlert(AlertMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/alert/" + message.getJourneyId(),
                message
        );
    }

    @Override
    public void sendNotification(NotificationMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/notification/" + message.getUserId(),
                message
        );
    }

    @Override
    public void sendJourneyStatus(JourneyStatusMessage message) {

        messagingTemplate.convertAndSend(
                "/topic/journey/" + message.getJourneyId(),
                message
        );
    }
}