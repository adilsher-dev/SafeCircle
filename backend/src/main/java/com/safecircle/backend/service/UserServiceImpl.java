package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.UpdateProfileRequest;
import com.safecircle.backend.dto.UserResponse;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.mapper.UserMapper;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public ApiResponse<UserResponse> getCurrentUser() {

        User user = userRepository.findByEmail(SecurityUtil.getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User profile fetched successfully.")
                .data(UserMapper.toResponse(user))
                .build();
    }

    @Override
    public ApiResponse<UserResponse> updateProfile(UpdateProfileRequest request) {

        User user = userRepository.findByEmail(SecurityUtil.getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setProfileImageUrl(request.getProfileImageUrl());

        userRepository.save(user);

        return ApiResponse.<UserResponse>builder()
                .success(true)
                .message("Profile updated successfully.")
                .data(UserMapper.toResponse(user))
                .build();
    }

    @Override
    public ApiResponse<String> deleteAccount() {

        User user = userRepository.findByEmail(SecurityUtil.getCurrentUserEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Account deleted successfully.")
                .data("User deleted successfully.")
                .build();
    }
}