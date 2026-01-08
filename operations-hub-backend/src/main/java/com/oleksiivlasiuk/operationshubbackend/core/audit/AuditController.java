package com.oleksiivlasiuk.operationshubbackend.core.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditController {

    private final AuditQueryService queryService;

    public AuditController(AuditQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping
    public Page<AuditEventResponse> getAudit(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) Long actorUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return queryService.search(entityType, entityId, action, actorUserId, page, size);
    }
}
