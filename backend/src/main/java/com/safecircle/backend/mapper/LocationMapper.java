package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.LocationResponse;
import com.safecircle.backend.entity.LocationHistory;

public class LocationMapper {

    private LocationMapper() {
    }

    public static LocationResponse toResponse(LocationHistory location) {

        return LocationResponse.builder()
                .id(location.getId())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .accuracy(location.getAccuracy())
                .speed(location.getSpeed())
                .heading(location.getHeading())
                .altitude(location.getAltitude())
                .userId(location.getUser().getId())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .batteryLevel(location.getBatteryLevel())
                .address(location.getAddress())
                .recordedAt(location.getRecordedAt())
                .mockLocation(location.getMockLocation())
                .networkType(location.getNetworkType())
                .journeyId(location.getJourney().getId())
                .build();
    }

}