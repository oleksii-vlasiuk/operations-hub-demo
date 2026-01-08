package com.oleksiivlasiuk.operationshubbackend.core.audit;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.oleksiivlasiuk.operationshubbackend.core.audit.AuditEventSpecifications.*;

@Service
public class AuditQueryService {

    private final AuditEventRepository repo;
    private final AuditEventMapper mapper;

    public AuditQueryService(AuditEventRepository repo, AuditEventMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<AuditEventResponse> search(
            String entityType,
            String entityId,
            String action,
            Long actorUserId,
            int page,
            int size
    ) {
        int safeSize = Math.min(Math.max(size, 1), 100); // 1..100
        int safePage = Math.max(page, 0);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "occurredAt")
        );

        Specification<AuditEvent> spec = Specification
                .where(entityTypeEquals(entityType))
                .and(entityIdEquals(entityId))
                .and(actionEquals(action))
                .and(actorUserIdEquals(actorUserId));

        return repo.findAll(spec, pageable).map(mapper::toResponse);
    }
}
