package com.oleksiivlasiuk.operationshubbackend.modules.tasks.dto;

import com.oleksiivlasiuk.operationshubbackend.modules.tasks.TaskPriority;
import com.oleksiivlasiuk.operationshubbackend.modules.tasks.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        Long createdBy,
        Long assigneeId,
        LocalDate dueDate,
        Instant createdAt,
        Instant updatedAt
) {}
