package com.safecircle.backend.dto;

import com.safecircle.backend.enums.AlertStatus;
import com.safecircle.backend.enums.AlertType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertMessage {

    private Long alertId;

    private Long journeyId;

    private Long userId;

    private AlertType alertType;

    private AlertStatus status;

    private String message;

    private Double latitude;

    private Double longitude;

    private LocalDateTime timestamp;
}