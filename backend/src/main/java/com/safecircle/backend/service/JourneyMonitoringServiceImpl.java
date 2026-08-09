package com.safecircle.backend.service;

import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class JourneyMonitoringServiceImpl implements JourneyMonitoringService {

    private static final double ROUTE_DEVIATION_DISTANCE = 500; // meters
    private static final double MAX_SPEED = 120;
    private static final double MIN_SPEED = 1;
    private static final long STOP_MINUTES = 10;

    @Override
    public boolean isRouteDeviation(Journey journey,
                                    LocationHistory currentLocation) {

        if (journey.getDestinationLatitude() == null
                || journey.getDestinationLongitude() == null) {
            return false;
        }

        double distance =
                calculateDistance(
                        currentLocation.getLatitude(),
                        currentLocation.getLongitude(),
                        journey.getDestinationLatitude(),
                        journey.getDestinationLongitude());

        return distance > ROUTE_DEVIATION_DISTANCE;
    }

    @Override
    public boolean isLongStop(LocationHistory previous,
                              LocationHistory current) {

        if (previous == null)
            return false;

        double distance =
                calculateDistance(
                        previous.getLatitude(),
                        previous.getLongitude(),
                        current.getLatitude(),
                        current.getLongitude());

        long minutes =
                Duration.between(
                                previous.getRecordedAt(),
                                current.getRecordedAt())
                        .toMinutes();

        return distance < 30 && minutes >= STOP_MINUTES;
    }

    @Override
    public boolean isAbnormalSpeed(double speed) {

        return speed < MIN_SPEED || speed > MAX_SPEED;
    }

    private double calculateDistance(double lat1,
                                     double lon1,
                                     double lat2,
                                     double lon2) {

        double R = 6371000;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(dLon / 2)
                        * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}