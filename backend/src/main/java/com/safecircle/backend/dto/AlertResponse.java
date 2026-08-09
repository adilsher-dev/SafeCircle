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
public class AlertResponse {

    private Long id;

    private AlertType alertType;

    private AlertStatus status;

    private Double latitude;

    private Double longitude;

    private String address;

    private String message;

    private Integer batteryLevel;

    private Boolean sirenActivated;

    private Boolean contactsNotified;

    private Boolean policeNotified;

    private String deviceInfo;

    private LocalDateTime triggeredAt;

    private LocalDateTime resolvedAt;

    private Long journeyId;

}