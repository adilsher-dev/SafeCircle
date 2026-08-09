package com.safecircle.backend.entity;

import com.safecircle.backend.enums.JourneyStatus;
import com.safecircle.backend.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "journeys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime expectedArrivalTime;

    private LocalDateTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Double distance = 0.0;

    @Column(nullable = false)
    private String transportMode;

    @Column(length = 1000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JourneyStatus status = JourneyStatus.STARTED;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emergencyTriggered = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean liveTrackingEnabled = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean journeyCompletedSafely = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "journey",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<LocationHistory> locationHistory = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RiskLevel aiRiskPrediction = RiskLevel.LOW;

    @OneToMany(
            mappedBy = "journey",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Alert> alerts = new ArrayList<>();


    @PrePersist
    public void prePersist() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = JourneyStatus.STARTED;
        }

        if (distance == null) {
            distance = 0.0;
        }

        if (startTime == null) {
            startTime = now;
        }

        if (emergencyTriggered == null) {
            emergencyTriggered = false;
        }

        if (liveTrackingEnabled == null) {
            liveTrackingEnabled = true;
        }

        if (journeyCompletedSafely == null) {
            journeyCompletedSafely = false;
        }

    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Column(nullable = false)
    @Builder.Default
    private Double travelledDistance = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double averageSpeed = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double remainingDistance = 0.0;

    private Long estimatedArrivalSeconds;

    @Column(nullable = false)
    @Builder.Default
    private Boolean offRoute = false;

    @Column(nullable = false)
    @Builder.Default
    private Double totalDistance = 0.0;


    @Column(nullable = false)
    @Builder.Default
    private Double maxSpeed = 0.0;

    @Builder.Default
    private Integer totalLocationUpdates = 0;

    private Double lastLatitude;

    private Double lastLongitude;

    @Column(name = "source_latitude")
    private Double sourceLatitude;

    @Column(name = "source_longitude")
    private Double sourceLongitude;

    @Column(name = "destination_latitude")
    private Double destinationLatitude;

    @Column(name = "destination_longitude")
    private Double destinationLongitude;

}