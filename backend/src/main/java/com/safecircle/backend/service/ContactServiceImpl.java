package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.ContactRequest;
import com.safecircle.backend.dto.ContactResponse;
import com.safecircle.backend.entity.TrustedContact;
import com.safecircle.backend.entity.User;
import com.safecircle.backend.exception.ResourceNotFoundException;
import com.safecircle.backend.mapper.ContactMapper;
import com.safecircle.backend.repository.ContactRepository;
import com.safecircle.backend.repository.UserRepository;
import com.safecircle.backend.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        String email = SecurityUtil.getCurrentUserEmail();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public ApiResponse<ContactResponse> addContact(ContactRequest request) {

        User user = getCurrentUser();

        if (contactRepository.countByUser(user) >= 5) {
            throw new IllegalStateException(
                    "Maximum 5 trusted contacts are allowed."
            );
        }

        if (contactRepository.existsByUserAndPhoneNumber(user, request.getPhoneNumber())) {
            throw new IllegalArgumentException(
                    "Contact already exists."
            );
        }

        TrustedContact contact = TrustedContact.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .relationship(request.getRelationship())
                .primaryContact(request.getPrimaryContact())
                .active(true)
                .user(user)
                .build();

        TrustedContact savedContact = contactRepository.save(contact);

        return ApiResponse.<ContactResponse>builder()
                .success(true)
                .message("Trusted contact added successfully.")
                .data(ContactMapper.toResponse(savedContact))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<List<ContactResponse>> getMyContacts() {

        User user = getCurrentUser();

        List<ContactResponse> contacts = contactRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(ContactMapper::toResponse)
                .collect(Collectors.toList());

        return ApiResponse.<List<ContactResponse>>builder()
                .success(true)
                .message("Trusted contacts fetched successfully.")
                .data(contacts)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<ContactResponse> getContactById(Long id) {

        User user = getCurrentUser();

        TrustedContact contact = contactRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Contact not found."));

        return ApiResponse.<ContactResponse>builder()
                .success(true)
                .message("Contact fetched successfully.")
                .data(ContactMapper.toResponse(contact))
                .build();
    }

    @Override
    public ApiResponse<ContactResponse> updateContact(Long id, ContactRequest request) {

        User user = getCurrentUser();

        TrustedContact contact = contactRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Contact not found."));

        contact.setFullName(request.getFullName());
        contact.setPhoneNumber(request.getPhoneNumber());
        contact.setEmail(request.getEmail());
        contact.setRelationship(request.getRelationship());
        contact.setPrimaryContact(request.getPrimaryContact());

        TrustedContact updatedContact = contactRepository.save(contact);

        return ApiResponse.<ContactResponse>builder()
                .success(true)
                .message("Contact updated successfully.")
                .data(ContactMapper.toResponse(updatedContact))
                .build();
    }

    @Override
    public ApiResponse<String> deleteContact(Long id) {

        User user = getCurrentUser();

        TrustedContact contact = contactRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Contact not found."));

        contactRepository.delete(contact);

        return ApiResponse.<String>builder()
                .success(true)
                .message("Contact deleted successfully.")
                .data("Contact deleted successfully.")
                .build();
    }

}