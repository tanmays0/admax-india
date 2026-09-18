-- OAuth support for Google / GitHub sign-in
USE admax_india;

ALTER TABLE users
  MODIFY COLUMN password VARCHAR(255) NULL;

ALTER TABLE users
  ADD COLUMN oauth_provider VARCHAR(32) NULL AFTER password,
  ADD COLUMN oauth_id VARCHAR(255) NULL AFTER oauth_provider;

ALTER TABLE users
  ADD UNIQUE KEY uq_users_oauth (oauth_provider, oauth_id);
