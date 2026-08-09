package com.safecircle.backend.entity;

import com.safecircle.backend.enums.AlertStatus;
import com.safecircle.backend.enums.AlertType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AlertStatus status = AlertStatus.ACTIVE;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String address;

    @Column(length = 1000)
    private String message;

    @Column(nullable = false)
    private LocalDateTime triggeredAt;

    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    @Builder.Default
    private Integer batteryLevel = 100;

    @Column(nullable = false)
    @Builder.Default
    private Boolean contactsNotified = false;

    @Column(nullable =false)
    @Builder.Default
    private Boolean policeNotified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean sirenActivated = false;

    @Column(length = 200)
    private String deviceInfo;

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

        if (triggeredAt == null) {
            triggeredAt = now;
        }

        if (status == null) {
            status = AlertStatus.ACTIVE;
        }

        if (contactsNotified == null) {
            contactsNotified = false;
        }

        if (policeNotified == null) {
            policeNotified = false;
        }

        if (sirenActivated == null) {
            sirenActivated = false;
        }

        if (batteryLevel == null) {
            batteryLevel = 100;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}