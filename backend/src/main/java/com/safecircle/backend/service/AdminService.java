package com.safecircle.backend.service;

import com.safecircle.backend.dto.AdminDashboardResponse;
import com.safecircle.backend.dto.AdminUserResponse;
import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.UserStatusRequest;
import com.safecircle.backend.entity.User;

import java.util.List;

public interface AdminService {

    ApiResponse<AdminDashboardResponse> getDashboard();

    ApiResponse<List<AdminUserResponse>> getAllUsers();

    ApiResponse<AdminUserResponse> getUser(Long id);

    ApiResponse<String> updateUserStatus(UserStatusRequest request);

    ApiResponse<String> deleteUser(Long id);

}