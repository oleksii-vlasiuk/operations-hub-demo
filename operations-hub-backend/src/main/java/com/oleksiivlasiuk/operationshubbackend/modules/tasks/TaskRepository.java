package com.oleksiivlasiuk.operationshubbackend.modules.tasks;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);

    Page<Task> findByStatusAndAssigneeId(TaskStatus status, Long assigneeId, Pageable pageable);

    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}
