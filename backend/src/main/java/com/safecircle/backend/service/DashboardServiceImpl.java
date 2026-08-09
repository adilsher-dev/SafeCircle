package com.safecircle.backend.service;

import com.safecircle.backend.dto.DashboardResponse;
import com.safecircle.backend.dto.JourneyStatisticsResponse;
import com.safecircle.backend.dto.NotificationStatisticsResponse;
import com.safecircle.backend.dto.SafetyStatisticsResponse;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.JourneyStatus;
import com.safecircle.backend.enums.RiskLevel;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.*;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final JourneyRepository journeyRepository;
    private final ContactRepository contactRepository;
    private final AlertRepository alertRepository;
    private final NotificationRepository notificationRepository;
    private final RiskRepository riskRepository;

    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public DashboardResponse getDashboard() {

        User user = getCurrentUser();

        return DashboardResponse.builder()
                .fullName(user.getFullName())

                .totalJourneys(
                        journeyRepository.countByUser(user))

                .activeJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.STARTED))

                .completedJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.COMPLETED))

                .cancelledJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.CANCELLED))

                .totalTrustedContacts(
                        contactRepository.countByUser(user))

                .totalAlerts(
                        alertRepository.countByUser(user))

                .totalNotifications(
                        notificationRepository.countByUser(user))

                .unreadNotifications(
                        notificationRepository.countByUserAndIsReadFalse(user))

                .lowRiskCount(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.LOW))

                .mediumRiskCount(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.MEDIUM))

                .highRiskCount(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.HIGH))

                .criticalRiskCount(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.CRITICAL))

                .build();
    }

    @Override
    public JourneyStatisticsResponse getJourneyStatistics() {

        User user = getCurrentUser();

        return JourneyStatisticsResponse.builder()
                .totalJourneys(
                        journeyRepository.countByUser(user))
                .activeJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.STARTED))
                .completedJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.COMPLETED))
                .cancelledJourneys(
                        journeyRepository.countByUserAndStatus(
                                user,
                                JourneyStatus.CANCELLED))
                .totalDistance(0.0)
                .averageDistance(0.0)
                .build();
    }

    @Override
    public SafetyStatisticsResponse getSafetyStatistics() {

        User user = getCurrentUser();

        return SafetyStatisticsResponse.builder()
                .lowRisk(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.LOW))
                .mediumRisk(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.MEDIUM))
                .highRisk(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.HIGH))
                .criticalRisk(
                        riskRepository.countByUserAndRiskLevel(
                                user,
                                RiskLevel.CRITICAL))
                .totalAlerts(
                        alertRepository.countByUser(user))
                .build();
    }

    @Override
    public NotificationStatisticsResponse getNotificationStatistics() {

        User user = getCurrentUser();

        long total =
                notificationRepository.countByUser(user);

        long unread =
                notificationRepository.countByUserAndIsReadFalse(user);

        return NotificationStatisticsResponse.builder()
                .totalNotifications(total)
                .unreadNotifications(unread)
                .readNotifications(total - unread)
                .build();
    }
}