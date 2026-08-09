package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.NotificationRequest;
import com.safecircle.backend.dto.NotificationResponse;
import com.safecircle.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationResponse>> sendNotification(
            @Valid @RequestBody NotificationRequest request) {

        return ResponseEntity.ok(notificationService.sendNotification(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications() {

        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotification(
            @PathVariable Long id) {

        return ResponseEntity.ok(notificationService.getNotification(id));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {

        return ResponseEntity.ok(notificationService.markAllAsRead());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(
            @PathVariable Long id) {

        return ResponseEntity.ok(notificationService.deleteNotification(id));
    }

}