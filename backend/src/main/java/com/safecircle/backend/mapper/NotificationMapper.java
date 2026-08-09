package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.NotificationResponse;
import com.safecircle.backend.entity.Notification;

public class NotificationMapper {

    private NotificationMapper() {
    }

    public static NotificationResponse toResponse(Notification notification) {

        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .isSent(notification.getIsSent())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}