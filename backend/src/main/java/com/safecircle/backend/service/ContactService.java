package com.safecircle.backend.service;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.ContactRequest;
import com.safecircle.backend.dto.ContactResponse;

import java.util.List;

public interface ContactService {

    ApiResponse<ContactResponse> addContact(ContactRequest request);

    ApiResponse<List<ContactResponse>> getMyContacts();

    ApiResponse<ContactResponse> getContactById(Long id);

    ApiResponse<ContactResponse> updateContact(Long id, ContactRequest request);

    ApiResponse<String> deleteContact(Long id);

}