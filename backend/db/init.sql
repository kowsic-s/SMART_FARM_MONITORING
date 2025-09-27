CREATE TABLE IF NOT EXISTS commands (
  id bigserial PRIMARY KEY,
  device_id text,
  payload jsonb,
  ts timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS telemetry (
  id bigserial PRIMARY KEY,
  device_id text,
  farm_id text,
  payload jsonb,
  ts timestamptz DEFAULT now()
);
