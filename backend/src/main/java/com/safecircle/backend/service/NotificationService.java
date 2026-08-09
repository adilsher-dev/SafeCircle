package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.NotificationRequest;
import com.safecircle.backend.dto.NotificationResponse;
import com.safecircle.backend.dto.RiskResponse;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.NotificationType;

import java.util.List;

public interface NotificationService {

    ApiResponse<NotificationResponse> sendNotification(NotificationRequest request);

    ApiResponse<List<NotificationResponse>> getMyNotifications();

    ApiResponse<NotificationResponse> getNotification(Long id);

    ApiResponse<NotificationResponse> markAsRead(Long id);

    ApiResponse<String> markAllAsRead();

    ApiResponse<String> deleteNotification(Long id);

    ApiResponse<NotificationResponse> sendHighRiskNotification(
            Journey journey,
            RiskResponse riskResponse
    );



}