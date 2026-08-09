package com.safecircle.backend.dto;

import com.safecircle.backend.enums.RelationshipType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {

    private Long id;

    private String fullName;

    private String phoneNumber;

    private String email;

    private RelationshipType relationship;

    private Boolean primaryContact;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}