package com.safecircle.backend.repository;

import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    long count();

    long countByIsActive(Boolean isActive);

    List<User> findAllByOrderByCreatedAtDesc();

    List<User> findByRole(Role role);
}