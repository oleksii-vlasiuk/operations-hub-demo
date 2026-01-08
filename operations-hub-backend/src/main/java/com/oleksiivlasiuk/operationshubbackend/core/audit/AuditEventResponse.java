package com.oleksiivlasiuk.operationshubbackend.core.audit;

import java.time.Instant;

public record AuditEventResponse(
        Long id,
        Instant occurredAt,
        Long actorUserId,
        String action,
        String entityType,
        String entityId,
        String summary,
        String metadata
) {}
