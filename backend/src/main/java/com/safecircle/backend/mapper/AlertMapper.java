package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.AlertResponse;
import com.safecircle.backend.entity.Alert;

public class AlertMapper {

    private AlertMapper() {
    }

    public static AlertResponse toResponse(Alert alert) {

        return AlertResponse.builder()
                .id(alert.getId())
                .alertType(alert.getAlertType())
                .status(alert.getStatus())
                .latitude(alert.getLatitude())
                .longitude(alert.getLongitude())
                .address(alert.getAddress())
                .message(alert.getMessage())
                .batteryLevel(alert.getBatteryLevel())
                .sirenActivated(alert.getSirenActivated())
                .contactsNotified(alert.getContactsNotified())
                .policeNotified(alert.getPoliceNotified())
                .deviceInfo(alert.getDeviceInfo())
                .triggeredAt(alert.getTriggeredAt())
                .resolvedAt(alert.getResolvedAt())
                .journeyId(alert.getJourney().getId())
                .build();
    }

}