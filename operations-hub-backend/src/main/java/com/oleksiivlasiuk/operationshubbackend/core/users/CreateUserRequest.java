package com.oleksiivlasiuk.operationshubbackend.core.users;

public record CreateUserRequest(
        String email,
        String firstName,
        String lastName)
{}
