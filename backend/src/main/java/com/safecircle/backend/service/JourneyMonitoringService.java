package com.safecircle.backend.service;

import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.LocationHistory;

public interface JourneyMonitoringService {

    boolean isRouteDeviation(Journey journey, LocationHistory currentLocation);

    boolean isLongStop(LocationHistory previous, LocationHistory current);

    boolean isAbnormalSpeed(double speed);

}