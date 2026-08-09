package com.safecircle.backend.dto;

import com.safecircle.backend.enums.AlertType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertRequest {

    @NotNull(message = "Journey ID is required")
    private Long journeyId;

    @NotNull(message = "Alert type is required")
    private AlertType alertType;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String address;

    private String message;

    @Min(0)
    @Max(100)
    private Integer batteryLevel;

    @Builder.Default
    private Boolean sirenActivated = false;

    private String deviceInfo;

}