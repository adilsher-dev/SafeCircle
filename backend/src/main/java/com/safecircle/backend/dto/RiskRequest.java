package com.safecircle.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskRequest {

    @NotNull(message = "Journey Id is required")
    private Long journeyId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Transport mode is required")
    private String transportMode;

    @NotNull(message = "Distance is required")
    private Double distanceKm;

    @Builder.Default
    private Integer batteryLevel = 100;

    @Builder.Default
    private Double speed = 0.0;

    @Builder.Default
    private Integer journeyDuration = 0;
}