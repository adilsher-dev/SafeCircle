package com.safecircle.backend.util;

public class JourneyProgressCalculator {

    private JourneyProgressCalculator() {
    }

    public static double calculateProgress(double travelled,
                                           double total) {

        if (total <= 0) {
            return 0;
        }

        double progress = (travelled / total) * 100;

        return Math.min(progress, 100.0);
    }

}