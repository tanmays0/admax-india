-- Upgrade notes for existing databases.
-- Prefer a fresh install via schema.sql when possible.
-- MySQL 8 does not support ADD COLUMN IF NOT EXISTS on all versions.
-- Run only the statements you need after inspecting your current columns:

-- USE admax_india;
-- ALTER TABLE users ADD COLUMN role ENUM('advertiser','partner','admin') NOT NULL DEFAULT 'advertiser' AFTER password;
-- ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
-- ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL;
-- ALTER TABLE users ADD COLUMN pincode VARCHAR(12) NULL;
-- ALTER TABLE users ADD COLUMN contact_person VARCHAR(120) NULL;
-- ALTER TABLE users ADD COLUMN business_type VARCHAR(100) NULL;
-- ALTER TABLE users ADD COLUMN target_audience TEXT NULL;
-- ALTER TABLE users ADD COLUMN monthly_budget VARCHAR(50) NULL;
-- ALTER TABLE users ADD COLUMN onboarding_complete TINYINT(1) NOT NULL DEFAULT 0;
-- ALTER TABLE ads ADD COLUMN title VARCHAR(200) NOT NULL DEFAULT 'Untitled Ad' AFTER user_id;
-- ALTER TABLE ads ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending';
-- ALTER TABLE campaigns ADD COLUMN user_id INT UNSIGNED NULL AFTER id;
-- ALTER TABLE screens ADD COLUMN partner_id INT UNSIGNED NULL AFTER id;
-- ALTER TABLE screen_ads ADD COLUMN campaign_id INT UNSIGNED NULL AFTER ad_id;

USE admax_india;

CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  campaign_id INT UNSIGNED NULL,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  payment_id VARCHAR(100) NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status ENUM('created', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'created',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
