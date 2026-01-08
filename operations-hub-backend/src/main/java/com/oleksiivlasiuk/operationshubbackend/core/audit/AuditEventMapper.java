package com.oleksiivlasiuk.operationshubbackend.core.audit;

import org.springframework.stereotype.Component;

@Component
public class AuditEventMapper {
    public AuditEventResponse toResponse(AuditEvent e) {
        return new AuditEventResponse(
                e.getId(),
                e.getOccurredAt(),
                e.getActorUserId(),
                e.getAction(),
                e.getEntityType(),
                e.getEntityId(),
                e.getSummary(),
                e.getMetadata()
        );
    }
}
