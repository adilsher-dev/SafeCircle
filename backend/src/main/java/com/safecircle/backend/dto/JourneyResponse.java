package com.safecircle.backend.dto;

import com.safecircle.backend.enums.JourneyStatus;
import lombok.*;
import com.safecircle.backend.enums.RiskLevel;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyResponse {

    private Long id;

    private String source;

    private String destination;

    private LocalDateTime startTime;

    private LocalDateTime expectedArrivalTime;

    private LocalDateTime endTime;

    private Double distance;

    private String transportMode;

    private String notes;

    private JourneyStatus status;

    private Boolean emergencyTriggered;

    private Boolean liveTrackingEnabled;

    private Boolean journeyCompletedSafely;

    private RiskLevel aiRiskPrediction;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Double travelledDistance;

    private Double averageSpeed;

    private Double remainingDistance;

    private Long estimatedArrivalSeconds;

    private Boolean offRoute;

    private Double sourceLatitude;

    private Double sourceLongitude;

    private Double destinationLatitude;

    private Double destinationLongitude;

}