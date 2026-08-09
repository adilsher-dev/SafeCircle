package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyRequest;
import com.safecircle.backend.dto.JourneyResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.JourneyStatus;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.JourneyMapper;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.LocationRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.DistanceCalculator;
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
public class JourneyServiceImpl implements JourneyService {

    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;


    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public ApiResponse<JourneyResponse> startJourney(JourneyRequest request) {

        User user = getCurrentUser();

        Journey journey = Journey.builder()
                .sourceLatitude(request.getSourceLatitude())
                .sourceLongitude(request.getSourceLongitude())
                .destinationLatitude(request.getDestinationLatitude())
                .destinationLongitude(request.getDestinationLongitude())
                .source(request.getSource())
                .destination(request.getDestination())
                .startTime(LocalDateTime.now())
                .expectedArrivalTime(request.getExpectedArrivalTime())
                .distance(request.getDistance() == null ? 0.0 : request.getDistance())
                .transportMode(request.getTransportMode())
                .notes(request.getNotes())
                .status(JourneyStatus.STARTED)
                .user(user)
                .build();

        Journey savedJourney = journeyRepository.save(journey);

        return ApiResponse.<JourneyResponse>builder()
                .success(true)
                .message("Journey started successfully")
                .data(JourneyMapper.toResponse(savedJourney))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<JourneyResponse> getJourneyById(Long id) {

        User user = getCurrentUser();

        Journey journey = journeyRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        return ApiResponse.<JourneyResponse>builder()
                .success(true)
                .message("Journey fetched successfully")
                .data(JourneyMapper.toResponse(journey))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<JourneyResponse>> getMyJourneys() {

        User user = getCurrentUser();

        List<JourneyResponse> response = journeyRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(JourneyMapper::toResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<JourneyResponse>>builder()
                .success(true)
                .message("Journeys fetched successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<JourneyResponse> endJourney(Long id) {

        User user = getCurrentUser();

        Journey journey = journeyRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        journey.setStatus(JourneyStatus.COMPLETED);
        journey.setEndTime(LocalDateTime.now());
        journey.setJourneyCompletedSafely(true);

        Journey updatedJourney = journeyRepository.save(journey);

        return ApiResponse.<JourneyResponse>builder()
                .success(true)
                .message("Journey completed successfully")
                .data(JourneyMapper.toResponse(updatedJourney))
                .build();
    }

    @Override
    public ApiResponse<String> deleteJourney(Long id) {

        User user = getCurrentUser();

        Journey journey = journeyRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Journey not found"));

        journeyRepository.delete(journey);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Journey deleted successfully")
                .data("Journey deleted successfully")
                .build();
    }

    @Override
    @Transactional
    public void updateJourneyStatistics(
            Journey journey,
            LocationHistory latestLocation) {

        List<LocationHistory> locations =
                locationRepository.findByJourneyOrderByRecordedAtAsc(journey);

        if (locations.size() < 2) {
            return;
        }

        LocationHistory previous =
                locations.get(locations.size() - 2);

        double distance =
                DistanceCalculator.calculateDistance(

                        previous.getLatitude(),
                        previous.getLongitude(),

                        latestLocation.getLatitude(),
                        latestLocation.getLongitude()
                );

        double totalDistance =
                journey.getTravelledDistance() + (distance / 1000.0);

        journey.setTravelledDistance(totalDistance);

        if (latestLocation.getSpeed() != null
                && latestLocation.getSpeed() > 0) {

            double avg =

                    (journey.getAverageSpeed()
                            + latestLocation.getSpeed()) / 2;

            journey.setAverageSpeed(avg);
        }

        if (journey.getDistance() != null) {

            double remaining =

                    Math.max(
                            0,
                            journey.getDistance() - totalDistance
                    );

            journey.setRemainingDistance(remaining);

            if (journey.getAverageSpeed() != null
                    && journey.getAverageSpeed() > 0) {

                long eta =

                        (long) ((remaining
                                / journey.getAverageSpeed()) * 3600);

                journey.setEstimatedArrivalSeconds(eta);
            }

        }

        journeyRepository.save(journey);
    }

    @Override
    @Transactional
    public void completeJourneyAutomatically(Journey journey) {

        journey.setStatus(JourneyStatus.COMPLETED);
        journey.setEndTime(LocalDateTime.now());
        journey.setJourneyCompletedSafely(true);
        journey.setLiveTrackingEnabled(false);

        journeyRepository.save(journey);
    }



}