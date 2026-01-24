CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,

  title VARCHAR(200) NOT NULL,
  description TEXT,

  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',

  created_by BIGINT NOT NULL,
  assignee_id BIGINT,

  due_date DATE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_tasks_created_by
    FOREIGN KEY (created_by) REFERENCES users(id),

  CONSTRAINT fk_tasks_assignee
    FOREIGN KEY (assignee_id) REFERENCES users(id)
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at);