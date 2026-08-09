package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.AdminUserResponse;
import com.safecircle.backend.entity.User;

public class AdminMapper {

    private AdminMapper() {
    }

    public static AdminUserResponse toResponse(User user) {

        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .isVerified(user.getIsVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}