package com.oleksiivlasiuk.operationshubbackend.core.audit;

import org.springframework.data.jpa.domain.Specification;

public final class AuditEventSpecifications {
    private AuditEventSpecifications() {}

    public static Specification<AuditEvent> entityTypeEquals(String entityType) {
        return (root, query, cb) ->
                entityType == null ? cb.conjunction() : cb.equal(root.get("entityType"), entityType);
    }

    public static Specification<AuditEvent> entityIdEquals(String entityId) {
        return (root, query, cb) ->
                entityId == null ? cb.conjunction() : cb.equal(root.get("entityId"), entityId);
    }

    public static Specification<AuditEvent> actionEquals(String action) {
        return (root, query, cb) ->
                action == null ? cb.conjunction() : cb.equal(root.get("action"), action);
    }

    public static Specification<AuditEvent> actorUserIdEquals(Long actorUserId) {
        return (root, query, cb) ->
                actorUserId == null ? cb.conjunction() : cb.equal(root.get("actorUserId"), actorUserId);
    }
}
