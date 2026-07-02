-- AdMax India database schema
-- Recreates the tables required by the backend controllers/routes.
-- Usage: mysql -u root -p'root1115' admax_india < backend/schema.sql

CREATE DATABASE IF NOT EXISTS admax_india;
USE admax_india;

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  category      VARCHAR(255),
  location      VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ads (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  media_url  VARCHAR(512),
  media_type VARCHAR(64),
  duration   INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255),
  start_date DATE,
  end_date   DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS screens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  shop_name  VARCHAR(255),
  city       VARCHAR(255),
  latitude   DECIMAL(10, 7),
  longitude  DECIMAL(10, 7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS screen_ads (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  screen_id  INT,
  ad_id      INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
