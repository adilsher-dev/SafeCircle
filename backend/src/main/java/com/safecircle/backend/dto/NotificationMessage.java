package com.safecircle.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {

    private Long notificationId;

    private Long userId;

    private String title;

    private String message;

    private String type;

    private Boolean read;

    private LocalDateTime createdAt;
}