package com.safecircle.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskPredictionRequest {

    @NotNull
    private Long journeyId;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private Integer batteryLevel;

    private Boolean travellingAlone;

    private Boolean nightTime;

    private Boolean unfamiliarArea;

}