package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.UpdateProfileRequest;
import com.safecircle.backend.dto.UserResponse;

public interface UserService {

    ApiResponse<UserResponse> getCurrentUser();

    ApiResponse<UserResponse> updateProfile(UpdateProfileRequest request);

    ApiResponse<String> deleteAccount();

}