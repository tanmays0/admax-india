/**
 * Seed demo users for local development.
 * Usage: node scripts/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const bcrypt = require("bcrypt");
const db = require("../config/db");

const users = [
  {
    name: "Demo Advertiser",
    email: "advertiser@admax.in",
    password: "password123",
    role: "advertiser",
    business_name: "Demo Cafe",
    category: "Cafe",
    location: "Pune",
  },
  {
    name: "Demo Partner",
    email: "partner@admax.in",
    password: "password123",
    role: "partner",
    business_name: "Partner Screens",
    category: "Retail",
    location: "Pune",
  },
  {
    name: "Demo Admin",
    email: "admin@admax.in",
    password: "password123",
    role: "admin",
    business_name: "AdMax India",
    category: null,
    location: "Pune",
  },
];

async function seed() {
  try {
    for (const u of users) {
      const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [u.email]);
      if (existing.length) {
        console.log(`skip  ${u.email} (exists)`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await db.query(
        `INSERT INTO users (name, email, password, role, business_name, category, location, onboarding_complete)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [u.name, u.email, hash, u.role, u.business_name, u.category, u.location]
      );
      console.log(`added ${u.email} / ${u.password} (${u.role})`);
    }
    console.log("\nSeed complete.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

seed();
