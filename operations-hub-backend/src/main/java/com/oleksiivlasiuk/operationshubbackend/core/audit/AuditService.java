package com.oleksiivlasiuk.operationshubbackend.core.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {
    private final AuditEventRepository repo;
    private final ObjectMapper objectMapper;

    public AuditService(AuditEventRepository repo, ObjectMapper objectMapper) {
        this.repo = repo;
        this.objectMapper = objectMapper;
    }

    private String toJson(Object obj) {
        try { return objectMapper.writeValueAsString(obj); }
        catch (Exception e) { return "{}"; }
    }

    @Transactional
    public void record(Long actorUserId,
                       String action,
                       String entityType,
                       Object entityId,
                       String summary,
                       String metadataJson) {

        String id = String.valueOf(entityId);

        AuditEvent event = new AuditEvent(
                actorUserId,
                action,
                entityType,
                id,
                summary,
                metadataJson
        );

        repo.save(event);
    }
}
