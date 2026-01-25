package com.oleksiivlasiuk.operationshubbackend.modules.tasks;

import com.oleksiivlasiuk.operationshubbackend.core.auth.CurrentUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository repository;
    private final CurrentUser currentUser;

    public TaskService(TaskRepository repository, CurrentUser currentUser) {
        this.repository = repository;
        this.currentUser = currentUser;
    }

    @Transactional(readOnly = true)
    public Page<Task> list(TaskStatus status, int page, int size) {
        // защита от странных значений
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        var pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "updatedAt")
        );

        if (currentUser.isAdminOrManager()) {
            return (status == null)
                    ? repository.findAll(pageable)
                    : repository.findByStatus(status, pageable);
        }

        Long myId = currentUser.id();
        return (status == null)
                ? repository.findByAssigneeId(myId, pageable)
                : repository.findByStatusAndAssigneeId(status, myId, pageable);
    }
}
