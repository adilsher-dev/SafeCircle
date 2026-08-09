package com.safecircle.backend.repository;

import com.safecircle.backend.entity.Notification;
import com.safecircle.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

    Optional<Notification> findTopByUserOrderByCreatedAtDesc(User user);

    long countByUser(User user);

    long countByUserAndIsReadFalse(User user);

    long countByUserAndIsReadTrue(User user);

}