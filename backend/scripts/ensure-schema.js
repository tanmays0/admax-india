/**
 * Ensure required tables/columns exist on an older admax_india database.
 * Usage: node scripts/ensure-schema.js
 */
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
  override: true,
});

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
    "campaigns",
    "category",
    "ALTER TABLE campaigns ADD COLUMN category VARCHAR(100) NULL AFTER name"
  );
  await addColumn(
    "campaigns",
    "city",
    "ALTER TABLE campaigns ADD COLUMN city VARCHAR(100) NULL AFTER category"
  );
  await addColumn(
    "campaigns",
    "radius",
    "ALTER TABLE campaigns ADD COLUMN radius INT UNSIGNED NULL AFTER city"
  );
  await addColumn(
    "campaigns",
    "time_slots",
    "ALTER TABLE campaigns ADD COLUMN time_slots JSON NULL AFTER end_date"
  );
  await addColumn(
    "campaigns",
    "status",
    "ALTER TABLE campaigns ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active' AFTER time_slots"
  );
  await addColumn(
    "campaigns",
    "updated_at",
    "ALTER TABLE campaigns ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
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
    "screen_ads",
    "assigned_at",
    "ALTER TABLE screen_ads ADD COLUMN assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER campaign_id"
  );

  // Needed for INSERT ... ON DUPLICATE KEY UPDATE in assignmentController
  try {
    const [indexes] = await db.query(
      "SHOW INDEX FROM screen_ads WHERE Key_name IN ('uq_screen_ad', 'uniq_screen_ad')"
    );
    if (!indexes.length) {
      await db.query(
        "ALTER TABLE screen_ads ADD UNIQUE KEY uq_screen_ad (screen_id, ad_id)"
      );
      console.log("added uq_screen_ad");
    } else {
      console.log("skip  uq_screen_ad (unique on screen_id,ad_id already present)");
    }
  } catch (err) {
    console.log(`skip  uq_screen_ad (${err.message})`);
  }

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
