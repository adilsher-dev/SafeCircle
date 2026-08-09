package com.safecircle.backend.util;

import com.safecircle.backend.enums.RiskLevel;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
public class RiskPredictionEngine {

    /**
     * Main AI Risk Score Calculation
     */
    public Integer calculateRiskScore(
            Double latitude,
            Double longitude,
            String transportMode,
            Double distanceKm,
            Integer batteryLevel,
            Double speed,
            Integer journeyDurationMinutes) {

        int score = 0;

        score += calculateNightRisk();
        score += calculateDistanceRisk(distanceKm);
        score += calculateTransportRisk(transportMode);
        score += calculateBatteryRisk(batteryLevel);
        score += calculateSpeedRisk(speed);
        score += calculateJourneyDurationRisk(journeyDurationMinutes);
        score += calculateEnvironmentRisk(latitude, longitude);

        return Math.min(score, 100);
    }

    /**
     * Night Time Risk
     */
    private int calculateNightRisk() {

        LocalTime now = LocalTime.now();

        if (now.isAfter(LocalTime.of(22, 0))
                || now.isBefore(LocalTime.of(5, 0))) {
            return 25;
        }

        return 0;
    }

    /**
     * Distance Risk
     */
    private int calculateDistanceRisk(Double distanceKm) {

        if (distanceKm == null)
            return 0;

        if (distanceKm >= 30)
            return 15;

        if (distanceKm >= 15)
            return 10;

        if (distanceKm >= 5)
            return 5;

        return 0;
    }

    /**
     * Transport Risk
     */
    private int calculateTransportRisk(String transportMode) {

        if (transportMode == null)
            return 0;

        return switch (transportMode.toUpperCase()) {

            case "WALKING" -> 20;

            case "PUBLIC_TRANSPORT" -> 15;

            case "BIKE" -> 10;

            case "AUTO" -> 8;

            case "CAR" -> 5;

            default -> 5;
        };
    }

    /**
     * Battery Risk
     */
    private int calculateBatteryRisk(Integer batteryLevel) {

        if (batteryLevel == null)
            return 0;

        if (batteryLevel <= 10)
            return 20;

        if (batteryLevel <= 20)
            return 15;

        if (batteryLevel <= 40)
            return 8;

        return 0;
    }

    /**
     * Speed Risk
     */
    private int calculateSpeedRisk(Double speed) {

        if (speed == null)
            return 0;

        if (speed >= 100)
            return 10;

        if (speed >= 80)
            return 7;

        if (speed >= 60)
            return 5;

        return 0;
    }

    /**
     * Journey Duration Risk
     */
    private int calculateJourneyDurationRisk(Integer durationMinutes) {

        if (durationMinutes == null)
            return 0;

        if (durationMinutes >= 180)
            return 10;

        if (durationMinutes >= 120)
            return 7;

        if (durationMinutes >= 60)
            return 5;

        return 0;
    }

    /**
     * Environment Risk
     * Placeholder for future Google Maps / Crime API integration.
     */
    private int calculateEnvironmentRisk(
            Double latitude,
            Double longitude) {

        if (latitude == null || longitude == null)
            return 0;

        if (latitude < 20)
            return 5;

        if (longitude < 75)
            return 5;

        return 2;
    }

    /**
     * Convert Score to Risk Level
     */
    public RiskLevel determineRiskLevel(Integer score) {

        if (score <= 25)
            return RiskLevel.LOW;

        if (score <= 50)
            return RiskLevel.MEDIUM;

        if (score <= 75)
            return RiskLevel.HIGH;

        return RiskLevel.CRITICAL;
    }

    /**
     * Recommendation
     */
    public String getRecommendation(RiskLevel level) {

        return switch (level) {

            case LOW ->
                    "Journey appears safe. Stay alert.";

            case MEDIUM ->
                    "Share your live location with trusted contacts.";

            case HIGH ->
                    "Avoid isolated routes. Stay connected with trusted contacts.";

            case CRITICAL ->
                    "High risk detected. Trigger SOS immediately if you feel unsafe.";
        };
    }

    /**
     * Human-readable reason
     */
    public String getPredictionReason(RiskLevel level) {

        return switch (level) {

            case LOW ->
                    "Safe route and normal travel conditions.";

            case MEDIUM ->
                    "Some travel conditions may require caution.";

            case HIGH ->
                    "Multiple risk factors detected during the journey.";

            case CRITICAL ->
                    "Several high-risk conditions detected. Immediate attention recommended.";
        };
    }
}