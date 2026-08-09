package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.RiskPredictionRequest;
import com.safecircle.backend.dto.RiskPredictionResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.RiskAssessment;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.RiskLevel;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.RiskRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AIRiskPredictionServiceImpl implements AIRiskPredictionService {

    private final JourneyRepository journeyRepository;
    private final RiskRepository riskRepository;
    private final UserRepository userRepository;

    /**
     * Logged in user
     */
    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public ApiResponse<RiskPredictionResponse> predictRisk(
            RiskPredictionRequest request) {

        User user = getCurrentUser();

        Journey journey = journeyRepository
                .findByIdAndUser(request.getJourneyId(), user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        int score = 0;

        /*
         * Rule 1
         * Night Time
         */
        if (Boolean.TRUE.equals(request.getNightTime())) {
            score += 30;
        }

        /*
         * Rule 2
         * Travelling Alone
         */
        if (Boolean.TRUE.equals(request.getTravellingAlone())) {
            score += 20;
        }

        /*
         * Rule 3
         * Unknown Area
         */
        if (Boolean.TRUE.equals(request.getUnfamiliarArea())) {
            score += 25;
        }

        /*
         * Rule 4
         * Low Battery
         */
        if (request.getBatteryLevel() != null) {

            if (request.getBatteryLevel() < 20) {
                score += 20;
            } else if (request.getBatteryLevel() < 40) {
                score += 10;
            }
        }

        /*
         * Rule 5
         * Example Geo Rule
         */
        if (request.getLatitude() != null &&
                request.getLongitude() != null) {

            if (request.getLatitude() < 20) {
                score += 5;
            }

            if (request.getLongitude() < 75) {
                score += 5;
            }
        }

        /*
         * Maximum Score
         */
        if (score > 100) {
            score = 100;
        }

        RiskLevel level;

        if (score >= 90) {
            level = RiskLevel.CRITICAL;
        } else if (score >= 70) {
            level = RiskLevel.HIGH;
        } else if (score >= 40) {
            level = RiskLevel.MEDIUM;
        } else {
            level = RiskLevel.LOW;
        }

        String reason;

        switch (level) {

            case HIGH ->
                    reason = "High risk detected due to multiple unsafe conditions.";

            case MEDIUM ->
                    reason = "Moderate risk detected.";

            default ->
                    reason = "Area and travel conditions appear safe.";
        }

        String recommendation;

        switch (level) {

            case HIGH ->
                    recommendation =
                            "Trigger SOS if needed and notify trusted contacts immediately.";

            case MEDIUM ->
                    recommendation =
                            "Stay alert and share live location.";

            default ->
                    recommendation =
                            "Continue journey safely.";
        }

        RiskAssessment assessment = RiskAssessment.builder()
                .user(user)
                .journey(journey)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .riskScore(score)
                .riskLevel(level)
                .predictionReason(reason)
                .recommendation(recommendation)
                .build();


        // Save prediction
        RiskAssessment savedAssessment = riskRepository.save(assessment);

        // Update latest journey risk
        journey.setAiRiskPrediction(level);
        journeyRepository.save(journey);

        // Build response
        RiskPredictionResponse response = RiskPredictionResponse.builder()
                .riskAssessmentId(savedAssessment.getId())
                .journeyId(journey.getId())
                .riskScore(score)
                .riskLevel(level)
                .predictionReason(reason)
                .recommendation(recommendation)
                .createdAt(savedAssessment.getCreatedAt())
                .build();

        return ApiResponse.<RiskPredictionResponse>builder()
                .success(true)
                .message("Risk prediction generated successfully.")
                .data(response)
                .build();
    }
}