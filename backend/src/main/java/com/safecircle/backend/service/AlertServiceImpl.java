package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.entity.*;

import java.util.stream.Collectors;

import com.safecircle.backend.enums.AlertStatus;
import com.safecircle.backend.enums.AlertType;
import com.safecircle.backend.enums.NotificationType;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.AlertMapper;
import com.safecircle.backend.repository.AlertRepository;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.NotificationRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.safecircle.backend.enums.AlertType.SOS;

@Service
@RequiredArgsConstructor
@Transactional
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final WebSocketService webSocketService;

    /**
     * Logged-in User
     */
    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    /**
     * Trigger Emergency Alert
     */
    @Override
    public ApiResponse<AlertResponse> triggerAlert(AlertRequest request) {

        User user = getCurrentUser();

        Journey journey = journeyRepository
                .findByIdAndUser(request.getJourneyId(), user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        Alert alert = Alert.builder()
                .alertType(request.getAlertType())
                .status(AlertStatus.ACTIVE)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .address(request.getAddress())
                .message(request.getMessage())
                .batteryLevel(
                        request.getBatteryLevel() == null
                                ? 100
                                : request.getBatteryLevel()
                )
                .sirenActivated(
                        request.getSirenActivated() == null
                                ? false
                                : request.getSirenActivated()
                )
                .contactsNotified(false)
                .policeNotified(false)
                .deviceInfo(request.getDeviceInfo())
                .triggeredAt(LocalDateTime.now())
                .journey(journey)
                .user(user)
                .build();

        Alert savedAlert = alertRepository.save(alert);

        AlertMessage alertMessage = AlertMessage.builder()
                .alertId(savedAlert.getId())
                .journeyId(savedAlert.getJourney().getId())
                .userId(savedAlert.getUser().getId())
                .alertType(savedAlert.getAlertType())
                .status(savedAlert.getStatus())
                .message(savedAlert.getMessage())
                .latitude(savedAlert.getLatitude())
                .longitude(savedAlert.getLongitude())
                .timestamp(savedAlert.getTriggeredAt())
                .build();

        webSocketService.sendAlert(alertMessage);

        Notification notification = Notification.builder()
                .title("Emergency SOS")
                .message("Emergency alert triggered successfully.")
                .type(NotificationType.SOS_TRIGGERED.name())
                .isRead(false)
                .isSent(true)
                .user(user)
                .build();

        notificationRepository.save(notification);

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("Emergency alert triggered successfully.")
                .data(AlertMapper.toResponse(savedAlert))
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<AlertResponse>> getMyAlerts() {

        User user = getCurrentUser();

        List<AlertResponse> alerts = alertRepository
                .findByUserOrderByTriggeredAtDesc(user)
                .stream()
                .map(AlertMapper::toResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<AlertResponse>>builder()
                .success(true)
                .message("Alerts fetched successfully.")
                .data(alerts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AlertResponse> getAlertById(Long id) {

        User user = getCurrentUser();

        Alert alert = alertRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alert not found."));

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("Alert fetched successfully.")
                .data(AlertMapper.toResponse(alert))
                .build();
    }

    @Override
    public ApiResponse<AlertResponse> resolveAlert(Long id) {

        User user = getCurrentUser();

        Alert alert = alertRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alert not found."));

        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        Alert updatedAlert = alertRepository.save(alert);

        Notification notification = Notification.builder()
                .title("Alert Resolved")
                .message("Your emergency alert has been marked as resolved.")
                .type(NotificationType.SOS_CANCELLED.name())
                .user(user)
                .build();

        notificationRepository.save(notification);

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("Alert resolved successfully.")
                .data(AlertMapper.toResponse(updatedAlert))
                .build();
    }

    @Override
    public ApiResponse<String> deleteAlert(Long id) {

        User user = getCurrentUser();

        Alert alert = alertRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alert not found."));

        alertRepository.delete(alert);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Alert deleted successfully.")
                .data("Alert deleted successfully.")
                .build();
    }

    @Override
    public ApiResponse<AlertResponse> triggerAutomaticSOS(
            Journey journey,
            LocationHistory location,
            RiskResponse riskResponse) {

        User user = journey.getUser();

        // Do not create another SOS if this journey already has an active one.
        Alert existingActiveAlert = alertRepository
                .findFirstByJourneyAndStatusOrderByTriggeredAtDesc(
                        journey,
                        AlertStatus.ACTIVE
                )
                .orElse(null);

        if (existingActiveAlert != null) {
            return ApiResponse.<AlertResponse>builder()
                    .success(true)
                    .message("An SOS is already active for this journey.")
                    .data(AlertMapper.toResponse(existingActiveAlert))
                    .build();
        }

        String riskLevel = riskResponse != null && riskResponse.getRiskLevel() != null
                ? riskResponse.getRiskLevel().name()
                : "UNKNOWN";

        String message =
                "Automatic SOS triggered because SafeCircle detected "
                        + riskLevel
                        + " risk.";

        Alert alert = Alert.builder()
                .alertType(AlertType.SOS)
                .status(AlertStatus.ACTIVE)
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .address(location.getAddress())
                .message(message)
                .batteryLevel(location.getBatteryLevel())
                .sirenActivated(false)
                .contactsNotified(false)
                .policeNotified(false)
                .triggeredAt(LocalDateTime.now())
                .journey(journey)
                .user(user)
                .build();

        Alert saved = alertRepository.save(alert);

        AlertMessage socketMessage = AlertMessage.builder()
                .alertId(saved.getId())
                .journeyId(journey.getId())
                .userId(user.getId())
                .alertType(saved.getAlertType())
                .status(saved.getStatus())
                .message(saved.getMessage())
                .latitude(saved.getLatitude())
                .longitude(saved.getLongitude())
                .timestamp(saved.getTriggeredAt())
                .build();

        // Push the SOS immediately. The frontend updates without a page reload.
        webSocketService.sendAlert(socketMessage);

        Notification notification = Notification.builder()
                .title("🚨 Automatic SOS")
                .message(message)
                .type(NotificationType.SOS_TRIGGERED.name())
                .isRead(false)
                .isSent(true)
                .user(user)
                .build();

        notificationRepository.save(notification);

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("Automatic SOS triggered successfully.")
                .data(AlertMapper.toResponse(saved))
                .build();
    }
}