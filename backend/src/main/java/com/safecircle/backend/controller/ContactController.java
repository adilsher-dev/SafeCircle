package com.safecircle.backend.controller;

import com.safecircle.backend.dto.ApiResponse;
import com.safecircle.backend.dto.ContactRequest;
import com.safecircle.backend.dto.ContactResponse;
import com.safecircle.backend.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> addContact(
            @Valid @RequestBody ContactRequest request) {

        return ResponseEntity.ok(contactService.addContact(request));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactResponse>>> getMyContacts() {

        return ResponseEntity.ok(contactService.getMyContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> getContactById(
            @PathVariable Long id) {

        return ResponseEntity.ok(contactService.getContactById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactResponse>> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody ContactRequest request) {

        return ResponseEntity.ok(contactService.updateContact(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteContact(
            @PathVariable Long id) {

        return ResponseEntity.ok(contactService.deleteContact(id));
    }
}