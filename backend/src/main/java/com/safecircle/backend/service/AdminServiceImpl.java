package com.safecircle.backend.service;

import com.safecircle.backend.dto.AdminDashboardResponse;
import com.safecircle.backend.mapper.AdminMapper;
import com.safecircle.backend.dto.AdminUserResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.UserStatusRequest;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.repository.AlertRepository;
import com.safecircle.backend.repository.JourneyRepository;
import com.safecircle.backend.repository.RiskRepository;
import com.safecircle.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JourneyRepository journeyRepository;
    private final AlertRepository alertRepository;
    private final RiskRepository riskRepository;

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AdminDashboardResponse> getDashboard() {

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long inactiveUsers = userRepository.countByIsActive(false);

        long totalJourneys = journeyRepository.count();
        long totalAlerts = alertRepository.count();
        long totalRiskAssessments = riskRepository.count();

        AdminDashboardResponse dashboard =
                AdminDashboardResponse.builder()
                        .totalUsers(totalUsers)
                        .activeUsers(activeUsers)
                        .inactiveUsers(inactiveUsers)
                        .totalJourneys(totalJourneys)
                        .totalAlerts(totalAlerts)
                        .totalRiskAssessments(totalRiskAssessments)
                        .build();

        return ApiResponse.<AdminDashboardResponse>builder()
                .success(true)
                .message("Dashboard fetched successfully")
                .data(dashboard)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users = userRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AdminMapper::toResponse)
                .toList();

        return ApiResponse.<List<AdminUserResponse>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(users)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AdminUserResponse> getUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        AdminUserResponse response = AdminMapper.toResponse(user);

        return ApiResponse.<AdminUserResponse>builder()
                .success(true)
                .message("User fetched successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<String> updateUserStatus(
            UserStatusRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        user.setIsActive(request.getActive());

        userRepository.save(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("User status updated successfully")
                .data("Updated")
                .build();
    }

    @Override
    public ApiResponse<String> deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        userRepository.delete(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("User deleted successfully")
                .data("Deleted")
                .build();
    }
}