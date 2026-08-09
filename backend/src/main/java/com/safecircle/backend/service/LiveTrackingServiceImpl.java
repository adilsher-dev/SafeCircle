package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyProgressResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;
import com.safecircle.backend.entity.RiskAssessment;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.LocationRepository;
import com.safecircle.backend.repository.RiskRepository;
import com.safecircle.backend.util.JourneyProgressCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LiveTrackingServiceImpl implements LiveTrackingService {

    private final JourneyRepository journeyRepository;
    private final LocationRepository locationRepository;
    private final RiskRepository riskRepository;

    @Override
    public ApiResponse<JourneyProgressResponse> getJourneyProgress(Long journeyId) {

        Journey journey = journeyRepository.findById(journeyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        LocationHistory location =
                locationRepository.findTopByJourneyOrderByRecordedAtDesc(journey)
                        .orElse(null);

        RiskAssessment risk =
                riskRepository.findTopByJourneyOrderByCreatedAtDesc(journey)
                        .orElse(null);

        double progress =
                JourneyProgressCalculator.calculateProgress(
                        journey.getTravelledDistance(),
                        journey.getDistance());

        JourneyProgressResponse response =
                JourneyProgressResponse.builder()
                        .journeyId(journey.getId())
                        .source(journey.getSource())
                        .destination(journey.getDestination())
                        .travelledDistance(journey.getTravelledDistance())
                        .remainingDistance(journey.getRemainingDistance())
                        .totalDistance(journey.getDistance())
                        .progressPercentage(progress)
                        .averageSpeed(journey.getAverageSpeed())
                        .estimatedArrivalSeconds(journey.getEstimatedArrivalSeconds())
                        .currentRisk(risk == null ? "UNKNOWN"
                                : risk.getRiskLevel().name())
                        .completed(
                                journey.getStatus().name().equals("COMPLETED"))
                        .sosTriggered(false)
                        .currentLatitude(location == null ? null
                                : location.getLatitude())
                        .currentLongitude(location == null ? null
                                : location.getLongitude())
                        .build();

        return ApiResponse.<JourneyProgressResponse>builder()
                .success(true)
                .message("Live journey fetched successfully")
                .data(response)
                .build();
    }
}