package com.safecircle.backend.repository;

import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.RiskAssessment;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RiskRepository extends JpaRepository<RiskAssessment, Long> {

    List<RiskAssessment> findByUser(User user);

    List<RiskAssessment> findByJourney(Journey journey);

    Optional<RiskAssessment> findTopByUserOrderByCreatedAtDesc(User user);

    long countByUserAndRiskLevel(User user, RiskLevel riskLevel);

    long countByUserAndRiskLevelAndCreatedAtAfter(
            User user,
            RiskLevel riskLevel,
            LocalDateTime date
    );
    long count();

    List<RiskAssessment> findByJourneyId(Long journeyId);

    List<RiskAssessment> findByRiskLevel(RiskLevel riskLevel);

    Optional<RiskAssessment> findTopByJourneyOrderByCreatedAtDesc(
            Journey journey);

}