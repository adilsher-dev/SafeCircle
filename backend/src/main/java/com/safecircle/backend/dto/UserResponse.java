package com.safecircle.backend.dto;

import com.safecircle.backend.enums.Gender;
import com.safecircle.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String profileImageUrl;

    private Boolean isVerified;

    private Boolean isActive;

    private Role role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}