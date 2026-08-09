package com.safecircle.backend.mapper;

import com.safecircle.backend.dto.ContactResponse;
import com.safecircle.backend.entity.TrustedContact;

public class ContactMapper {

    private ContactMapper() {
    }

    public static ContactResponse toResponse(TrustedContact contact) {

        return ContactResponse.builder()
                .id(contact.getId())
                .fullName(contact.getFullName())
                .phoneNumber(contact.getPhoneNumber())
                .email(contact.getEmail())
                .relationship(contact.getRelationship())
                .primaryContact(contact.getPrimaryContact())
                .active(contact.getActive())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}