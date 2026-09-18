-- Stripe customer + subscription support
USE admax_india;

ALTER TABLE users
  ADD COLUMN stripe_customer_id VARCHAR(255) NULL AFTER oauth_id;

ALTER TABLE users
  ADD UNIQUE KEY uq_users_stripe_customer (stripe_customer_id);

ALTER TABLE payments
  ADD COLUMN provider VARCHAR(32) NOT NULL DEFAULT 'mock' AFTER currency,
  ADD COLUMN stripe_session_id VARCHAR(255) NULL AFTER payment_id;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_price_id VARCHAR(255) NULL,
  plan_name VARCHAR(64) NOT NULL DEFAULT 'business',
  status VARCHAR(64) NOT NULL DEFAULT 'incomplete',
  current_period_end DATETIME NULL,
  cancel_at_period_end TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_subscriptions_user (user_id),
  INDEX idx_subscriptions_status (status)
) ENGINE=InnoDB;
