
  -- Add SQL in this file to create the database tables for your API
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY,
    user_id         TEXT UNIQUE NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    tenant_id       TEXT NOT NULL,
    provider        TEXT NOT NULL,
    provider_id     TEXT UNIQUE
 );
  