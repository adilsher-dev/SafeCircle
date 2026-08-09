package com.safecircle.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "location_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable =false)
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Double accuracy = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double speed = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double heading = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double altitude = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer batteryLevel = 100;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private LocalDateTime recordedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean mockLocation = false;

    @Column(length = 30)
    private String networkType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journey_id", nullable = false)
    private Journey journey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (recordedAt == null) {
            recordedAt = now;
        }

        if (accuracy == null) {
            accuracy = 0.0;
        }

        if (speed == null) {
            speed = 0.0;
        }

        if (heading == null) {
            heading = 0.0;
        }

        if (altitude == null) {
            altitude = 0.0;
        }

        if (batteryLevel == null) {
            batteryLevel = 100;
        }

        if (mockLocation == null) {
            mockLocation = false;
        }

    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}