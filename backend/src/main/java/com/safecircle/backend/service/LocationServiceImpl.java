package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.entity.*;
import com.safecircle.backend.enums.AlertStatus;
import com.safecircle.backend.enums.AlertType;
import com.safecircle.backend.enums.NotificationType;
import com.safecircle.backend.enums.RiskLevel;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.LocationMapper;
import com.safecircle.backend.repository.AlertRepository;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.LocationRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final JourneyMonitoringService monitoringService;
    private final JourneyService journeyService;
    private final AIRiskPredictionService aiRiskPredictionService;
    private final NotificationService notificationService;
    private final AlertRepository alertRepository;
    private final WebSocketService webSocketService;
    private final OpenStreetMapsService openStreetMapsService;

    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public ApiResponse<LocationResponse> saveLocation(LocationRequest request) {

        User user = getCurrentUser();

        Journey journey = journeyRepository
                .findById(request.getJourneyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        LocationHistory saved = locationRepository.save(

                LocationHistory.builder()
                        .user(user)
                        .journey(journey)
                        .latitude(request.getLatitude())
                        .longitude(request.getLongitude())
                        .speed(request.getSpeed())
                        .batteryLevel(request.getBatteryLevel())
                        .recordedAt(
                                request.getRecordedAt() == null
                                        ? LocalDateTime.now()
                                        : request.getRecordedAt()
                        )
                        .mockLocation(
                                request.getMockLocation() != null
                                        && request.getMockLocation()
                        )
                        .address(
                                openStreetMapsService
                                        .reverseGeocode(
                                                request.getLatitude(),
                                                request.getLongitude())
                                        .getDisplayName()
                        )
                        .build()
        );

        journey.setLastLatitude(saved.getLatitude());
        journey.setLastLongitude(saved.getLongitude());

        journey.setTotalLocationUpdates(
                journey.getTotalLocationUpdates() + 1
        );

        journeyRepository.save(journey);

        journeyService.updateJourneyStatistics(
                journey,
                saved
        );

        RiskPredictionRequest riskRequest =
                RiskPredictionRequest.builder()
                        .journeyId(journey.getId())
                        .latitude(saved.getLatitude())
                        .longitude(saved.getLongitude())
                        .batteryLevel(saved.getBatteryLevel())
                        .nightTime(false)
                        .travellingAlone(false)
                        .unfamiliarArea(false)
                        .build();

        ApiResponse<RiskPredictionResponse> riskResponse =
                aiRiskPredictionService.predictRisk(riskRequest);
        RiskPredictionResponse risk =
                riskResponse.getData();

        boolean routeDeviation =
                monitoringService.isRouteDeviation(
                        journey,
                        saved
                );

        LocationHistory previous =
                locationRepository
                        .findTopByJourneyOrderByRecordedAtDesc(journey)
                        .orElse(null);

        boolean longStop =
                monitoringService.isLongStop(previous, saved);

        boolean abnormalSpeed =
                monitoringService.isAbnormalSpeed(
                        saved.getSpeed()
                );

        if (risk.getRiskLevel() != null &&
                risk.getRiskLevel() == RiskLevel.HIGH) {

            notificationService.sendNotification(

                    NotificationRequest.builder()
                            .title("High Risk Detected")
                            .message(
                                    "AI detected abnormal journey behaviour."
                            )
                            .type(NotificationType.HIGH_RISK.name())
                            .build()
            );
        }

        if (routeDeviation || longStop || abnormalSpeed) {

            Alert alert = Alert.builder()
                    .user(user)
                    .journey(journey)
                    .alertType(AlertType.SOS)
                    .status(AlertStatus.ACTIVE)
                    .latitude(saved.getLatitude())
                    .longitude(saved.getLongitude())
                    .address(saved.getAddress())
                    .batteryLevel(saved.getBatteryLevel())
                    .message("Automatic SOS triggered.")
                    .sirenActivated(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            alertRepository.save(alert);
        }

        LiveLocationMessage message =
                LiveLocationMessage.builder()
                        .journeyId(journey.getId())
                        .userId(user.getId())
                        .latitude(saved.getLatitude())
                        .longitude(saved.getLongitude())
                        .speed(saved.getSpeed())
                        .address(saved.getAddress())
                        .timestamp(saved.getRecordedAt())
                        .build();

        webSocketService.sendLiveLocation(message);

        checkJourneyCompletion(
                journey,
                saved
        );

        return ApiResponse.<LocationResponse>builder()
                .success(true)
                .message("Location saved successfully")
                .data(LocationMapper.toResponse(saved))
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public ApiResponse<LocationResponse> getLatestLocation() {

        User user = getCurrentUser();

        LocationHistory latest = locationRepository
                .findTopByUserOrderByRecordedAtDesc(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("No location found"));

        return ApiResponse.<LocationResponse>builder()
                .success(true)
                .message("Latest location fetched successfully")
                .data(LocationMapper.toResponse(latest))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<LocationResponse>> getJourneyLocations(Long journeyId) {

        User user = getCurrentUser();

        Journey journey = journeyRepository
                .findByIdAndUser(journeyId, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        List<LocationResponse> response = locationRepository
                .findByJourneyOrderByRecordedAtAsc(journey)
                .stream()
                .map(LocationMapper::toResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<LocationResponse>>builder()
                .success(true)
                .message("Journey locations fetched successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<String> deleteLocation(Long id) {

        User user = getCurrentUser();

        LocationHistory location = locationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Location not found"));

        if (!location.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Location not found");
        }

        locationRepository.delete(location);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Location deleted successfully")
                .data("Location deleted successfully")
                .build();
    }

    /**
     * Automatic Journey Completion
     */
    private void checkJourneyCompletion(
            Journey journey,
            LocationHistory location) {

        if (journey.getDestinationLatitude() == null
                || journey.getDestinationLongitude() == null) {
            return;
        }

        double distance =
                com.safecircle.backend.util.DistanceCalculator.calculateDistance(

                        location.getLatitude(),
                        location.getLongitude(),

                        journey.getDestinationLatitude(),
                        journey.getDestinationLongitude()
                );

        // 50 meters radius
        if (distance <= 50) {

            journeyService.completeJourneyAutomatically(journey);

            notificationService.sendNotification(

                    NotificationRequest.builder()
                            .title("Journey Completed")
                            .message("You have safely reached your destination.")
                            .type(NotificationType.JOURNEY_COMPLETED.name())
                            .build()
            );
        }
    }
}