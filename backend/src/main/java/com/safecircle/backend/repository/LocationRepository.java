package com.safecircle.backend.repository;

import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;
import com.safecircle.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<LocationHistory, Long> {

    List<LocationHistory> findByJourneyOrderByRecordedAtAsc(Journey journey);

    List<LocationHistory> findByUserOrderByRecordedAtDesc(User user);

    Optional<LocationHistory> findTopByUserOrderByRecordedAtDesc(User user);

    Optional<LocationHistory> findTopByJourneyOrderByRecordedAtDesc(Journey journey);

    void deleteByJourney(Journey journey);

    long countByUser(User user);

    List<LocationHistory> findTop100ByJourneyOrderByRecordedAtDesc(Journey journey);

    void deleteByUser(User user);



}