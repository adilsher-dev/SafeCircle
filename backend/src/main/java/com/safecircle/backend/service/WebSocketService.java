package com.safecircle.backend.service;

import com.safecircle.backend.dto.AlertMessage;
import com.safecircle.backend.dto.JourneyStatusMessage;
import com.safecircle.backend.dto.LiveLocationMessage;
import com.safecircle.backend.dto.NotificationMessage;

public interface WebSocketService {

    void sendLiveLocation(LiveLocationMessage message);

    void sendAlert(AlertMessage message);

    void sendNotification(NotificationMessage message);

    void sendJourneyStatus(JourneyStatusMessage message);

}