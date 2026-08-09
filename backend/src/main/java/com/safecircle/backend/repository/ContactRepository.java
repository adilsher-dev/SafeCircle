package com.safecircle.backend.repository;

import com.safecircle.backend.entity.TrustedContact;
import com.safecircle.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<TrustedContact, Long> {

    List<TrustedContact> findByUser(User user);

    List<TrustedContact> findByUserOrderByCreatedAtDesc(User user);

    Optional<TrustedContact> findByIdAndUser(Long id, User user);

    boolean existsByUserAndPhoneNumber(User user, String phoneNumber);

    long countByUser(User user);

    List<TrustedContact> findByUserAndActiveTrue(User user);



}