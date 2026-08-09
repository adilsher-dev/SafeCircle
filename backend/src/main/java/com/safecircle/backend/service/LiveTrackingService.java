package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.JourneyProgressResponse;

public interface LiveTrackingService {

    ApiResponse<JourneyProgressResponse> getJourneyProgress(Long journeyId);

}