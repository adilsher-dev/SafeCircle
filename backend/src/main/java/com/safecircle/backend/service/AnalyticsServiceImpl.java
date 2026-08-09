package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.JourneyStatus;
import com.safecircle.backend.enums.RiskLevel;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.AlertRepository;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.RiskRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final JourneyRepository journeyRepository;
    private final AlertRepository alertRepository;
    private final RiskRepository riskRepository;

    private User currentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public WeeklySafetyReportResponse getWeeklyReport() {

        User user = currentUser();

        LocalDateTime week = LocalDateTime.now().minusDays(7);

        long journeys =
                journeyRepository.countByUserAndCreatedAtAfter(user, week);

        long completed =
                journeyRepository.countByUserAndStatusAndCreatedAtAfter(
                        user,
                        JourneyStatus.COMPLETED,
                        week);

        long cancelled =
                journeyRepository.countByUserAndStatusAndCreatedAtAfter(
                        user,
                        JourneyStatus.CANCELLED,
                        week);

        long alerts =
                alertRepository.countByUserAndTriggeredAtAfter(user, week);

        long highRisk =
                riskRepository.countByUserAndRiskLevelAndCreatedAtAfter(
                        user,
                        RiskLevel.HIGH,
                        week);

        double score = journeys == 0
                ? 100
                : ((double) completed / journeys) * 100;

        return WeeklySafetyReportResponse.builder()
                .totalJourneys(journeys)
                .completedJourneys(completed)
                .cancelledJourneys(cancelled)
                .alertsTriggered(alerts)
                .highRiskEvents(highRisk)
                .safetyScore(score)
                .build();
    }

    @Override
    public MonthlySafetyReportResponse getMonthlyReport() {

        User user = currentUser();

        LocalDateTime month = LocalDateTime.now().minusDays(30);

        long journeys =
                journeyRepository.countByUserAndCreatedAtAfter(user, month);

        long completed =
                journeyRepository.countByUserAndStatusAndCreatedAtAfter(
                        user,
                        JourneyStatus.COMPLETED,
                        month);

        long cancelled =
                journeyRepository.countByUserAndStatusAndCreatedAtAfter(
                        user,
                        JourneyStatus.CANCELLED,
                        month);

        long alerts =
                alertRepository.countByUserAndTriggeredAtAfter(user, month);

        long highRisk =
                riskRepository.countByUserAndRiskLevelAndCreatedAtAfter(
                        user,
                        RiskLevel.HIGH,
                        month);

        double score = journeys == 0
                ? 100
                : ((double) completed / journeys) * 100;

        return MonthlySafetyReportResponse.builder()
                .totalJourneys(journeys)
                .completedJourneys(completed)
                .cancelledJourneys(cancelled)
                .alertsTriggered(alerts)
                .highRiskEvents(highRisk)
                .safetyScore(score)
                .build();
    }

    @Override
    public List<JourneyTrendResponse> getJourneyTrend() {

        return new ArrayList<>();
    }

    @Override
    public List<RiskTrendResponse> getRiskTrend() {

        return new ArrayList<>();
    }
}