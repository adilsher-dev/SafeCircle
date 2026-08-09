package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.entity.*;
import com.safecircle.backend.enums.NotificationType;
import com.safecircle.backend.dto.NotificationMessage;
import com.safecircle.backend.dto.RiskRequest;
import com.safecircle.backend.dto.RiskResponse;
import com.safecircle.backend.enums.RiskLevel;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.NotificationRepository;
import com.safecircle.backend.repository.RiskRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.RiskPredictionEngine;
import com.safecircle.backend.util.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final RiskRepository riskRepository;
    private final UserRepository userRepository;
    private final JourneyRepository journeyRepository;
    private final RiskPredictionEngine predictionEngine;

    private final NotificationRepository notificationRepository;

    private final WebSocketService webSocketService;

    @Override
    public ApiResponse<RiskResponse> predictRisk(RiskRequest request) {

        String email = SecurityUtil.getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Journey journey = journeyRepository.findById(request.getJourneyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        Integer score = predictionEngine.calculateRiskScore(

                request.getLatitude(),
                request.getLongitude(),

                journey.getTransportMode(),

                journey.getDistance(),

                request.getBatteryLevel(),

                request.getSpeed(),

                0

        );

        RiskLevel level = predictionEngine.determineRiskLevel(score);

        if(level == RiskLevel.HIGH || level == RiskLevel.CRITICAL){

            Notification notification = Notification.builder()
                    .title("High Risk Detected")
                    .message("AI detected a high-risk journey.")
                    .type(NotificationType.HIGH_RISK.name())
                    .isRead(false)
                    .isSent(true)
                    .user(user)
                    .build();

            notificationRepository.save(notification);

            NotificationMessage message = NotificationMessage.builder()
                    .notificationId(notification.getId())
                    .userId(user.getId())
                    .title(notification.getTitle())
                    .message(notification.getMessage())
                    .type(notification.getType())
                    .read(false)
                    .createdAt(notification.getCreatedAt())
                    .build();

            webSocketService.sendNotification(message);
        }

        String recommendation =
                predictionEngine.getRecommendation(level);

        String reason =
                predictionEngine.getPredictionReason(level);

        RiskAssessment assessment = RiskAssessment.builder()
                .user(user)

                .journey(journey)

                .latitude(request.getLatitude())
                .longitude(request.getLongitude())

                .riskScore(score)
                .riskLevel(level)

                .recommendation(recommendation)
                .predictionReason(reason)

                .build();

        RiskAssessment savedAssessment =
                riskRepository.save(assessment);

        RiskResponse response = RiskResponse.builder()

                .riskAssessmentId(savedAssessment.getId())

                .riskScore(score)

                .riskLevel(level)

                .recommendation(recommendation)

                .predictionReason(reason)

                .build();

        return ApiResponse.<RiskResponse>builder()

                .success(true)

                .message("Risk prediction completed successfully.")

                .data(response)

                .build();
    }

    @Override
    public ApiResponse getRiskHistory(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RiskAssessment> history = riskRepository.findByUser(user);

        return ApiResponse.builder()
                .success(true)
                .message("Risk history fetched successfully.")
                .data(history)
                .build();
    }

    @Override
    public ApiResponse getLatestRisk(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<RiskAssessment> latest =
                riskRepository.findTopByUserOrderByCreatedAtDesc(user);

        return ApiResponse.builder()
                .success(true)
                .message("Latest risk fetched successfully.")
                .data(latest.orElse(null))
                .build();
    }

    @Override
    public ApiResponse recalculateRisk(Long journeyId) {

        return ApiResponse.builder()
                .success(true)
                .message("Risk recalculation feature will be implemented in Sprint 10.")
                .data(null)
                .build();
    }

    @Override
    @Transactional
    public ApiResponse<RiskResponse> predictLiveRisk(
            Journey journey,
            LocationHistory location) {

        Integer score = predictionEngine.calculateRiskScore(
                location.getLatitude(),
                location.getLongitude(),
                journey.getTransportMode(),
                journey.getDistance(),
                location.getBatteryLevel(),
                location.getSpeed(),
                (int) java.time.Duration.between(
                        journey.getStartTime(),
                        location.getRecordedAt()
                ).toMinutes()
        );

        RiskLevel level = predictionEngine.determineRiskLevel(score);

        RiskAssessment assessment = RiskAssessment.builder()
                .journey(journey)
                .user(location.getUser())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .riskScore(score)
                .riskLevel(level)
                .recommendation(predictionEngine.getRecommendation(level))
                .predictionReason(predictionEngine.getPredictionReason(level))
                .build();

        assessment = riskRepository.save(assessment);

        RiskResponse response = RiskResponse.builder()
                .riskAssessmentId(assessment.getId())
                .riskScore(score)
                .riskLevel(level)
                .recommendation(assessment.getRecommendation())
                .predictionReason(assessment.getPredictionReason())
                .build();

        return ApiResponse.<RiskResponse>builder()
                .success(true)
                .message("Live risk predicted successfully")
                .data(response)
                .build();
    }
}