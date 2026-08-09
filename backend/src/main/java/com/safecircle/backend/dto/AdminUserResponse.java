package com.safecircle.backend.dto;

import com.safecircle.backend.enums.Gender;
import com.safecircle.backend.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Gender gender;

    private Role role;

    private Boolean isActive;

    private Boolean isVerified;

    private LocalDateTime createdAt;

}