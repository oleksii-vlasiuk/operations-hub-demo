package com.oleksiivlasiuk.operationshubbackend.core.common;

import java.time.Instant;

public record ErrorResponse(
        String message,
        int status,
        Instant timestamp
) {}