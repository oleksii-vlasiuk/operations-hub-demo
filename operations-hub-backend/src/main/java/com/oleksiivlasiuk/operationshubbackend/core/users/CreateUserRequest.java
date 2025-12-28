package com.oleksiivlasiuk.operationshubbackend.core.users;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserRequest(
    @Email @NotBlank String email,
    @NotBlank String firstName,
    @NotBlank String lastName
) {
}
