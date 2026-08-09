package com.safecircle.backend.repository;

import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.JourneyStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface JourneyRepository extends JpaRepository<Journey, Long> {

    List<Journey> findByUser(User user);

    Optional<Journey> findByIdAndUser(Long id, User user);

    List<Journey> findByUserOrderByCreatedAtDesc(User user);

    List<Journey> findByStatus(JourneyStatus status);

    List<Journey> findByUserAndStatus(User user, JourneyStatus status);

    long countByUser(User user);

    long countByUserAndStatus(User user, JourneyStatus status);

    long countByUserAndCreatedAtAfter(User user, LocalDateTime date);

    long countByUserAndStatusAndCreatedAtAfter(
            User user,
            JourneyStatus status,
            LocalDateTime date
    );

    long count();
}