-- AdMax India — full MySQL schema
-- Run once: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS admax_india
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE admax_india;

-- ───────── Users ─────────
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  oauth_provider VARCHAR(32) NULL,
  oauth_id VARCHAR(255) NULL,
  stripe_customer_id VARCHAR(255) NULL,
  role ENUM('advertiser', 'partner', 'admin') NOT NULL DEFAULT 'advertiser',
  business_name VARCHAR(180) NULL,
  category VARCHAR(100) NULL,
  location VARCHAR(180) NULL,
  phone VARCHAR(20) NULL,
  city VARCHAR(100) NULL,
  pincode VARCHAR(12) NULL,
  contact_person VARCHAR(120) NULL,
  business_type VARCHAR(100) NULL,
  target_audience TEXT NULL,
  monthly_budget VARCHAR(50) NULL,
  onboarding_complete TINYINT(1) NOT NULL DEFAULT 0,
  first_name VARCHAR(80) NULL,
  last_name VARCHAR(80) NULL,
  avatar_url VARCHAR(500) NULL,
  notification_prefs JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  UNIQUE KEY uq_users_oauth (oauth_provider, oauth_id),
  UNIQUE KEY uq_users_stripe_customer (stripe_customer_id)
) ENGINE=InnoDB;

-- ───────── Ads ─────────
CREATE TABLE IF NOT EXISTS ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL DEFAULT 'Untitled Ad',
  media_url VARCHAR(500) NOT NULL,
  media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  duration INT UNSIGNED NOT NULL DEFAULT 15,
  status ENUM('pending', 'approved', 'rejected', 'active') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ads_user (user_id),
  INDEX idx_ads_status (status)
) ENGINE=InnoDB;

-- ───────── Screens ─────────
CREATE TABLE IF NOT EXISTS screens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  partner_id INT UNSIGNED NULL,
  shop_name VARCHAR(180) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_screens_partner FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_screens_city (city),
  INDEX idx_screens_partner (partner_id)
) ENGINE=InnoDB;

-- ───────── Campaigns ─────────
CREATE TABLE IF NOT EXISTS campaigns (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(100) NULL,
  city VARCHAR(100) NULL,
  radius INT UNSIGNED NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  time_slots JSON NULL,
  status ENUM('draft', 'pending', 'active', 'paused', 'completed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaigns_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_campaigns_user (user_id),
  INDEX idx_campaigns_status (status)
) ENGINE=InnoDB;

-- ───────── Screen ↔ Ad assignments ─────────
CREATE TABLE IF NOT EXISTS screen_ads (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  screen_id INT UNSIGNED NOT NULL,
  ad_id INT UNSIGNED NOT NULL,
  campaign_id INT UNSIGNED NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sa_screen FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
  CONSTRAINT fk_sa_ad FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  CONSTRAINT fk_sa_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  UNIQUE KEY uq_screen_ad (screen_id, ad_id)
) ENGINE=InnoDB;

-- ───────── Payments ─────────
CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  campaign_id INT UNSIGNED NULL,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  payment_id VARCHAR(100) NULL,
  stripe_session_id VARCHAR(255) NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  provider VARCHAR(32) NOT NULL DEFAULT 'mock',
  status ENUM('created', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'created',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL,
  INDEX idx_payments_user (user_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB;

-- ───────── Subscriptions (Stripe) ─────────
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

-- ───────── Contact messages ─────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(30) NULL,
  business VARCHAR(180) NULL,
  city VARCHAR(100) NULL,
  message TEXT NOT NULL,
  source VARCHAR(40) NOT NULL DEFAULT 'contact',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_created (created_at)
) ENGINE=InnoDB;

-- ───────── Partner applications ─────────
CREATE TABLE IF NOT EXISTS partner_applications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_code VARCHAR(32) NOT NULL UNIQUE,
  owner_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  business_name VARCHAR(180) NULL,
  screen_count INT UNSIGNED NOT NULL DEFAULT 1,
  screen_type VARCHAR(80) NULL,
  screen_size VARCHAR(80) NULL,
  resolution VARCHAR(80) NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NULL,
  pincode VARCHAR(12) NOT NULL,
  connectivity VARCHAR(80) NULL,
  power_supply VARCHAR(80) NULL,
  access_type VARCHAR(80) NULL,
  monthly_footfall VARCHAR(80) NULL,
  primary_audience VARCHAR(120) NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_partner_apps_status (status),
  INDEX idx_partner_apps_email (email)
) ENGINE=InnoDB;

-- ───────── Newsletter subscribers ─────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  source VARCHAR(40) NOT NULL DEFAULT 'blog',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ───────── Play / impression events ─────────
CREATE TABLE IF NOT EXISTS play_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  screen_id INT UNSIGNED NOT NULL,
  ad_id INT UNSIGNED NULL,
  played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_play_screen FOREIGN KEY (screen_id) REFERENCES screens(id) ON DELETE CASCADE,
  CONSTRAINT fk_play_ad FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE SET NULL,
  INDEX idx_play_screen_time (screen_id, played_at),
  INDEX idx_play_ad_time (ad_id, played_at)
) ENGINE=InnoDB;

-- ───────── Seed demo screens (Pune) ─────────
INSERT INTO screens (shop_name, city, latitude, longitude, status)
SELECT * FROM (
  SELECT 'Bean & Brew Cafe' AS shop_name, 'Pune' AS city, 18.5204000 AS latitude, 73.8567000 AS longitude, 'active' AS status
  UNION ALL SELECT 'IronFit Gym', 'Pune', 18.5314000, 73.8446000, 'active'
  UNION ALL SELECT 'CityClinic', 'Pune', 18.5074000, 73.8077000, 'active'
  UNION ALL SELECT 'Glow Salon', 'Pune', 18.5590000, 73.7868000, 'active'
  UNION ALL SELECT 'Pizza Palace', 'Pune', 18.4991000, 73.8553000, 'active'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM screens LIMIT 1);
