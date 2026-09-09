/**
 * Lightweight API smoke checks against a running backend.
 * Usage: node scripts/smoke-api.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const BASE = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${process.env.PORT || 5000}`;

async function req(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const health = await req("GET", "/healthz");
  assert(health.status === 200, `healthz failed: ${health.status}`);

  const screens = await req("GET", "/api/screens/public");
  assert(screens.status === 200 && Array.isArray(screens.data), "public screens failed");

  const contact = await req("POST", "/api/contact", {
    name: "Smoke Tester",
    email: "smoke@admax.in",
    message: "Smoke contact message",
    city: "Pune",
  });
  assert(contact.status === 201, `contact failed: ${contact.status}`);

  const partner = await req("POST", "/api/partner-applications", {
    ownerName: "Smoke Partner",
    email: "smoke-partner@admax.in",
    phone: "9999999999",
    address: "1 Test Street",
    city: "Pune",
    pincode: "411001",
    screenType: "LED",
    screenSize: "43",
    terms: true,
  });
  assert(partner.status === 201 && partner.data.applicationCode, "partner apply failed");

  const login = await req("POST", "/api/auth/login", {
    email: "admin@admax.in",
    password: "password123",
  });
  assert(login.status === 200 && login.data.token, "admin login failed — run npm run seed");

  const token = login.data.token;
  const inbox = await req("GET", "/api/contact", null, token);
  assert(inbox.status === 200 && Array.isArray(inbox.data), "admin contact list failed");

  const apps = await req("GET", "/api/partner-applications", null, token);
  assert(apps.status === 200 && Array.isArray(apps.data), "admin partner apps failed");

  console.log("Smoke OK");
  console.log(
    JSON.stringify(
      {
        screens: screens.data.length,
        contactId: contact.data.id,
        applicationCode: partner.data.applicationCode,
        inbox: inbox.data.length,
        partnerApps: apps.data.length,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error("Smoke failed:", err.message);
  process.exit(1);
});
