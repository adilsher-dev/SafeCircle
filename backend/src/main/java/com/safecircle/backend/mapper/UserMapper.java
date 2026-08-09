package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.UserResponse;
import com.safecircle.backend.entity.User;

public class UserMapper {

    private UserMapper(){}

    public static UserResponse toResponse(User user){

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .profileImageUrl(user.getProfileImageUrl())
                .isVerified(user.getIsVerified())
                .isActive(user.getIsActive())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

    }

}