package com.oleksiivlasiuk.operationshubbackend.core.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long>, JpaSpecificationExecutor<AuditEvent> {

    Page<AuditEvent> findByEntityTypeAndEntityIdOrderByOccurredAtDesc(
            String entityType,
            String entityId,
            Pageable pageable
    );

    Page<AuditEvent> findByEntityTypeOrderByOccurredAtDesc(
            String entityType,
            Pageable pageable
    );
}
