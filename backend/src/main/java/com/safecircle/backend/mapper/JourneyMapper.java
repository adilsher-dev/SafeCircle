package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.JourneyResponse;
import com.safecircle.backend.entity.Journey;

public class JourneyMapper {

    private JourneyMapper() {
    }

    public static JourneyResponse toResponse(Journey journey) {

        return JourneyResponse.builder()
                .id(journey.getId())
                .source(journey.getSource())
                .destination(journey.getDestination())
                .startTime(journey.getStartTime())
                .expectedArrivalTime(journey.getExpectedArrivalTime())
                .endTime(journey.getEndTime())
                .distance(journey.getDistance())
                .transportMode(journey.getTransportMode())
                .notes(journey.getNotes())
                .status(journey.getStatus())
                .emergencyTriggered(journey.getEmergencyTriggered())
                .liveTrackingEnabled(journey.getLiveTrackingEnabled())
                .journeyCompletedSafely(journey.getJourneyCompletedSafely())
                .aiRiskPrediction(journey.getAiRiskPrediction())
                .createdAt(journey.getCreatedAt())
                .updatedAt(journey.getUpdatedAt())
                .travelledDistance(journey.getTravelledDistance())
                .averageSpeed(journey.getAverageSpeed())
                .remainingDistance(journey.getRemainingDistance())
                .estimatedArrivalSeconds(journey.getEstimatedArrivalSeconds())
                .offRoute(journey.getOffRoute())
                .sourceLatitude(journey.getSourceLatitude())
                .sourceLongitude(journey.getSourceLongitude())
                .destinationLatitude(journey.getDestinationLatitude())
                .destinationLongitude(journey.getDestinationLongitude())
                .build();

    }

}