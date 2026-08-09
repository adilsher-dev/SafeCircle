package com.safecircle.backend.service;

import com.safecircle.backend.dto.*;
import com.safecircle.backend.entity.Journey;
import com.safecircle.backend.entity.Notification;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.enums.NotificationType;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.NotificationMapper;
import com.safecircle.backend.repository.NotificationRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public ApiResponse<NotificationResponse> sendNotification(NotificationRequest request) {

        User user = getCurrentUser();

        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .isRead(false)
                .isSent(true)
                .user(user)
                .build();

        Notification saved = notificationRepository.save(notification);

        NotificationMessage notificationMessage = NotificationMessage.builder()
                .notificationId(saved.getId())
                .userId(saved.getUser().getId())
                .title(saved.getTitle())
                .message(saved.getMessage())
                .type(saved.getType())
                .read(saved.getIsRead())
                .createdAt(saved.getCreatedAt())
                .build();

        webSocketService.sendNotification(notificationMessage);

        return ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("Notification sent successfully")
                .data(NotificationMapper.toResponse(saved))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<NotificationResponse>> getMyNotifications() {

        User user = getCurrentUser();

        List<NotificationResponse> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user)
                        .stream()
                        .map(NotificationMapper::toResponse)
                        .collect(Collectors.toList());

        return ApiResponse.<List<NotificationResponse>>builder()
                .success(true)
                .message("Notifications fetched successfully")
                .data(notifications)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<NotificationResponse> getNotification(Long id) {

        User user = getCurrentUser();

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        return ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("Notification fetched successfully")
                .data(NotificationMapper.toResponse(notification))
                .build();
    }

    @Override
    public ApiResponse<NotificationResponse> markAsRead(Long id) {

        User user = getCurrentUser();

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notification.setIsRead(true);

        Notification updated = notificationRepository.save(notification);

        NotificationMessage notificationMessage = NotificationMessage.builder()
                .notificationId(updated.getId())
                .userId(updated.getUser().getId())
                .title(updated.getTitle())
                .message(updated.getMessage())
                .type(updated.getType())
                .read(updated.getIsRead())
                .createdAt(updated.getCreatedAt())
                .build();

        webSocketService.sendNotification(notificationMessage);

        return ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("Notification marked as read")
                .data(NotificationMapper.toResponse(updated))
                .build();
    }

    @Override
    public ApiResponse<String> markAllAsRead() {

        User user = getCurrentUser();

        List<Notification> notifications =
                notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);

        notifications.forEach(notification -> notification.setIsRead(true));

        notificationRepository.saveAll(notifications);

        return ApiResponse.<String>builder()
                .success(true)
                .message("All notifications marked as read")
                .data("Success")
                .build();
    }

    @Override
    public ApiResponse<String> deleteNotification(Long id) {

        User user = getCurrentUser();

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found");
        }

        notificationRepository.delete(notification);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Notification deleted successfully")
                .data("Deleted")
                .build();
    }
    @Override
    public ApiResponse<NotificationResponse> sendHighRiskNotification(
            Journey journey,
            RiskResponse riskResponse) {

        User user = journey.getUser();

        Notification notification = Notification.builder()
                .title("⚠ High Risk Detected")
                .message(
                        "AI detected a HIGH risk during your journey. "
                                + riskResponse.getRecommendation()
                )
                .type(NotificationType.HIGH_RISK.name())
                .isRead(false)
                .isSent(true)
                .user(user)
                .build();

        Notification saved = notificationRepository.save(notification);

        NotificationMessage socketMessage = NotificationMessage.builder()
                .notificationId(saved.getId())
                .userId(user.getId())
                .title(saved.getTitle())
                .message(saved.getMessage())
                .type(saved.getType())
                .read(false)
                .createdAt(saved.getCreatedAt())
                .build();

        webSocketService.sendNotification(socketMessage);

        return ApiResponse.<NotificationResponse>builder()
                .success(true)
                .message("High risk notification sent successfully.")
                .data(NotificationMapper.toResponse(saved))
                .build();
    }
}