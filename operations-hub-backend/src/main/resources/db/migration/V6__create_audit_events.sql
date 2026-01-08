CREATE TABLE audit_events (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  actor_user_id BIGINT NULL,

  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(40) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,

  summary VARCHAR(255) NOT NULL,

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX idx_audit_events_entity
  ON audit_events (entity_type, entity_id);

CREATE INDEX idx_audit_events_occurred_at
  ON audit_events (occurred_at DESC);

CREATE INDEX idx_audit_events_action
  ON audit_events (action);

CREATE INDEX idx_audit_events_actor_user_id
  ON audit_events (actor_user_id);