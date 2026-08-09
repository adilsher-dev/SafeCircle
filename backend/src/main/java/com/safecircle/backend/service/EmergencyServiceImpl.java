package com.safecircle.backend.service;
import com.safecircle.backend.dto.AlertRequest;
import com.safecircle.backend.dto.AlertResponse;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.entity.Alert;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.AlertStatus;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.AlertMapper;
import com.safecircle.backend.repository.AlertRepository;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmergencyServiceImpl implements EmergencyService {

    private final AlertRepository alertRepository;
    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;


    /**
     * Returns the currently logged-in user.
     */
    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    /**
     * Trigger SOS Alert
     */
    @Override
    public ApiResponse<AlertResponse> triggerSOS(AlertRequest request) {

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


        /*
         * Future Integrations
         *
         * Twilio SMS
         * Firebase Push Notification
         * Email Service
         * WhatsApp API
         * AI Emergency Prediction
         */

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("SOS triggered successfully.")
                .data(AlertMapper.toResponse(savedAlert))
                .build();
    }
    /**
     * Cancel an active SOS alert.
     */
    @Override
    public ApiResponse<AlertResponse> cancelSOS(Long alertId) {

        User user = getCurrentUser();

        Alert alert = alertRepository
                .findByIdAndUser(alertId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alert not found."));

        if (alert.getStatus() == AlertStatus.CANCELLED) {

            return ApiResponse.<AlertResponse>builder()
                    .success(false)
                    .message("SOS is already cancelled.")
                    .data(AlertMapper.toResponse(alert))
                    .build();
        }

        if (alert.getStatus() == AlertStatus.RESOLVED) {

            return ApiResponse.<AlertResponse>builder()
                    .success(false)
                    .message("Resolved alert cannot be cancelled.")
                    .data(AlertMapper.toResponse(alert))
                    .build();
        }

        alert.setStatus(AlertStatus.CANCELLED);
        alert.setResolvedAt(LocalDateTime.now());

        Alert updatedAlert = alertRepository.save(alert);

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("SOS cancelled successfully.")
                .data(AlertMapper.toResponse(updatedAlert))
                .build();
    }

    /**
     * Get all alerts of logged-in user.
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<AlertResponse>> getMyAlerts() {

        User user = getCurrentUser();

        List<AlertResponse> alerts = alertRepository
                .findByUserOrderByTriggeredAtDesc(user)
                .stream()
                .map(AlertMapper::toResponse)
                .toList();

        return ApiResponse.<List<AlertResponse>>builder()
                .success(true)
                .message("Alerts fetched successfully.")
                .data(alerts)
                .build();
    }

    /**
     * Get alert details.
     */
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AlertResponse> getAlertById(Long alertId) {

        User user = getCurrentUser();

        Alert alert = alertRepository
                .findByIdAndUser(alertId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Alert not found."));

        return ApiResponse.<AlertResponse>builder()
                .success(true)
                .message("Alert fetched successfully.")
                .data(AlertMapper.toResponse(alert))
                .build();
    }

}