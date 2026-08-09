package com.safecircle.backend.util;

public class DestinationUtil {

    private static final double ARRIVAL_RADIUS_METERS = 50;

    private DestinationUtil() {
    }

    public static boolean hasReachedDestination(
            Double currentLat,
            Double currentLng,
            Double destinationLat,
            Double destinationLng) {

        if (currentLat == null || currentLng == null
                || destinationLat == null || destinationLng == null) {
            return false;
        }

        double distance = DistanceCalculator.calculateDistance(
                currentLat,
                currentLng,
                destinationLat,
                destinationLng);

        return distance <= ARRIVAL_RADIUS_METERS;
    }
}