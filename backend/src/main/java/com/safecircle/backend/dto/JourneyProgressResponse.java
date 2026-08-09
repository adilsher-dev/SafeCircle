package com.safecircle.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JourneyProgressResponse {

    private Long journeyId;

    private String source;

    private String destination;

    private Double travelledDistance;

    private Double remainingDistance;

    private Double totalDistance;

    private Double progressPercentage;

    private Double averageSpeed;

    private Long estimatedArrivalSeconds;

    private String currentRisk;

    private Boolean sosTriggered;

    private Boolean completed;

    private Double currentLatitude;

    private Double currentLongitude;

}