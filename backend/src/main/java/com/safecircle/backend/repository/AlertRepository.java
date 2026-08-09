package com.safecircle.backend.repository;

import com.safecircle.backend.entity.Alert;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByUserOrderByTriggeredAtDesc(User user);

    Optional<Alert> findByIdAndUser(Long id, User user);

    List<Alert> findByJourney(Journey journey);

    List<Alert> findByStatus(AlertStatus status);

    long countByUser(User user);

    long countByUserAndTriggeredAtAfter(
            User user,
            LocalDateTime date
    );
    long count();

}