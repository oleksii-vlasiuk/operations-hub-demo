package com.oleksiivlasiuk.operationshubbackend.modules.tasks;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private TaskPriority priority;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;

        if (status == null) status = TaskStatus.OPEN;
        if (priority == null) priority = TaskPriority.MEDIUM;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    protected Task() {}

    public Task(String title, String description, Long createdBy) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
        this.status = TaskStatus.OPEN;
        this.priority = TaskPriority.MEDIUM;
    }

    // --- getters/setters (минимум необходимого) ---

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public Long getCreatedBy() { return createdBy; }

    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
