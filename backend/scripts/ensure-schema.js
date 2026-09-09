/**
 * Ensure required tables/columns exist on an older admax_india database.
 * Usage: node scripts/ensure-schema.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const db = require("../config/db");

async function columnExists(table, column) {
  const [cols] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [column]);
  return cols.length > 0;
}

async function addColumn(table, column, sql) {
  if (await columnExists(table, column)) {
    console.log(`skip  ${table}.${column}`);
    return;
  }
  await db.query(sql);
  console.log(`added ${table}.${column}`);
}

async function main() {
  await db.query(`
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
    ) ENGINE=InnoDB
  `);
  console.log("ok    payments");

  await addColumn(
    "users",
    "role",
    "ALTER TABLE users ADD COLUMN role ENUM('advertiser','partner','admin') NOT NULL DEFAULT 'advertiser' AFTER password"
  );
  await addColumn("users", "phone", "ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL");
  await addColumn("users", "city", "ALTER TABLE users ADD COLUMN city VARCHAR(100) NULL");
  await addColumn("users", "pincode", "ALTER TABLE users ADD COLUMN pincode VARCHAR(12) NULL");
  await addColumn(
    "users",
    "contact_person",
    "ALTER TABLE users ADD COLUMN contact_person VARCHAR(120) NULL"
  );
  await addColumn(
    "users",
    "business_type",
    "ALTER TABLE users ADD COLUMN business_type VARCHAR(100) NULL"
  );
  await addColumn(
    "users",
    "target_audience",
    "ALTER TABLE users ADD COLUMN target_audience TEXT NULL"
  );
  await addColumn(
    "users",
    "monthly_budget",
    "ALTER TABLE users ADD COLUMN monthly_budget VARCHAR(50) NULL"
  );
  await addColumn(
    "users",
    "onboarding_complete",
    "ALTER TABLE users ADD COLUMN onboarding_complete TINYINT(1) NOT NULL DEFAULT 0"
  );

  await addColumn(
    "ads",
    "title",
    "ALTER TABLE ads ADD COLUMN title VARCHAR(200) NOT NULL DEFAULT 'Untitled Ad' AFTER user_id"
  );
  await addColumn(
    "ads",
    "status",
    "ALTER TABLE ads ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending'"
  );

  await addColumn(
    "campaigns",
    "user_id",
    "ALTER TABLE campaigns ADD COLUMN user_id INT UNSIGNED NULL AFTER id"
  );

  await addColumn(
    "screens",
    "partner_id",
    "ALTER TABLE screens ADD COLUMN partner_id INT UNSIGNED NULL AFTER id"
  );
  await addColumn(
    "screens",
    "status",
    "ALTER TABLE screens ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active'"
  );

  await addColumn(
    "screen_ads",
    "campaign_id",
    "ALTER TABLE screen_ads ADD COLUMN campaign_id INT UNSIGNED NULL AFTER ad_id"
  );

  await addColumn(
    "users",
    "avatar_url",
    "ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL"
  );
  await addColumn(
    "users",
    "first_name",
    "ALTER TABLE users ADD COLUMN first_name VARCHAR(80) NULL"
  );
  await addColumn("users", "last_name", "ALTER TABLE users ADD COLUMN last_name VARCHAR(80) NULL");
  await addColumn(
    "users",
    "notification_prefs",
    "ALTER TABLE users ADD COLUMN notification_prefs JSON NULL"
  );
  await addColumn(
    "users",
    "oauth_provider",
    "ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(32) NULL AFTER password"
  );
  await addColumn(
    "users",
    "oauth_id",
    "ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255) NULL AFTER oauth_provider"
  );
  await addColumn(
    "users",
    "stripe_customer_id",
    "ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255) NULL"
  );
  await addColumn(
    "payments",
    "provider",
    "ALTER TABLE payments ADD COLUMN provider VARCHAR(32) NOT NULL DEFAULT 'mock' AFTER currency"
  );
  await addColumn(
    "payments",
    "stripe_session_id",
    "ALTER TABLE payments ADD COLUMN stripe_session_id VARCHAR(255) NULL AFTER payment_id"
  );

  await db.query(`
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
      INDEX idx_subscriptions_user (user_id),
      INDEX idx_subscriptions_status (status)
    ) ENGINE=InnoDB
  `);
  console.log("ok    subscriptions");

  await db.query(`
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
    ) ENGINE=InnoDB
  `);
  console.log("ok    contact_messages");

  await db.query(`
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
    ) ENGINE=InnoDB
  `);
  console.log("ok    partner_applications");

  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(180) NOT NULL UNIQUE,
      source VARCHAR(40) NOT NULL DEFAULT 'blog',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  console.log("ok    newsletter_subscribers");

  await db.query(`
    CREATE TABLE IF NOT EXISTS play_events (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      screen_id INT UNSIGNED NOT NULL,
      ad_id INT UNSIGNED NULL,
      played_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_play_screen_time (screen_id, played_at),
      INDEX idx_play_ad_time (ad_id, played_at)
    ) ENGINE=InnoDB
  `);
  console.log("ok    play_events");

  // OAuth-only users have no local password
  try {
    await db.query("ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL");
    console.log("ok    users.password nullable");
  } catch (err) {
    console.log(`skip  users.password nullable (${err.message})`);
  }

  try {
    const [indexes] = await db.query("SHOW INDEX FROM users WHERE Key_name = 'uq_users_oauth'");
    if (!indexes.length) {
      await db.query("ALTER TABLE users ADD UNIQUE KEY uq_users_oauth (oauth_provider, oauth_id)");
      console.log("added uq_users_oauth");
    } else {
      console.log("skip  uq_users_oauth");
    }
  } catch (err) {
    console.log(`skip  uq_users_oauth (${err.message})`);
  }

  const [tables] = await db.query("SHOW TABLES");
  console.log("\nTables:", tables.map((t) => Object.values(t)[0]).join(", "));
}

main()
  .then(() => db.end())
  .catch(async (err) => {
    console.error("ensure-schema failed:", err.message);
    await db.end();
    process.exit(1);
  });
