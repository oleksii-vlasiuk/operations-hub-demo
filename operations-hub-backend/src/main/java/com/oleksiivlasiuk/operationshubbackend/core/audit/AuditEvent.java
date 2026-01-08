package com.oleksiivlasiuk.operationshubbackend.core.audit;

import jakarta.persistence.*;
import org.hibernate.annotations.ColumnTransformer;

import java.time.Instant;

@Entity
@Table(name = "audit_events",
        indexes = {
                @Index(name = "idx_audit_events_entity", columnList = "entityType, entityId"),
                @Index(name = "idx_audit_events_occurred_at", columnList = "occurredAt")
        })
public class AuditEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    private Instant occurredAt;

    @Column
    private Long actorUserId;

    @Column(nullable = false, length = 80)
    private String action;

    @Column(nullable = false, length = 40)
    private String entityType;

    @Column(nullable = false, length = 64)
    private String entityId;

    @Column(nullable = false, length = 255)
    private String summary;

    @Column(nullable = false, columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String metadata; // simplest v1: store JSON as String

    @PrePersist
    void onCreate() {
        occurredAt = Instant.now();
        if (metadata == null) metadata = "{}";
    }

    protected AuditEvent() {}

    public AuditEvent(Long actorUserId,
                      String action,
                      String entityType,
                      String entityId,
                      String summary,
                      String metadataJson) {
        this.actorUserId = actorUserId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.summary = summary;
        this.metadata = (metadataJson == null || metadataJson.isBlank()) ? "{}" : metadataJson;
    }

    public Long getId() {
        return id;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public Long getActorUserId() {
        return actorUserId;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public String getSummary() {
        return summary;
    }

    public String getMetadata() {
        return metadata;
    }
}
