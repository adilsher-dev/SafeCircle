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
public class EmergencyResponse {

    private Long alertId;

    private Long userId;

    private Long journeyId;

    private Double latitude;

    private Double longitude;

    private String address;

    private AlertType alertType;

    private AlertStatus alertStatus;

    private String message;

    private LocalDateTime createdAt;
}