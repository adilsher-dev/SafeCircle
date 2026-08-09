package com.safecircle.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotBlank(message = "Destination is required")
    private String destination;

    @NotNull(message = "Expected arrival time is required")
    @Future(message = "Expected arrival time must be in the future")
    private LocalDateTime expectedArrivalTime;

    @NotBlank(message = "Transport mode is required")
    private String transportMode;

    private Double distance;

    private String notes;

    private Double sourceLatitude;

    private Double sourceLongitude;

    private Double destinationLatitude;

    private Double destinationLongitude;

}