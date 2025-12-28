package com.oleksiivlasiuk.operationshubbackend.core.users;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        UserStatus status,
        Role role
) {}
