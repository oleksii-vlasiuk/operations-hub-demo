package com.oleksiivlasiuk.operationshubbackend.modules.tasks;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStatusAndAssigneeId(TaskStatus status, Long assigneeId);
}
