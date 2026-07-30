const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const db = require("./config/db");
const { configurePassport } = require("./config/passport");
const { handleStripeWebhook } = require("./controllers/stripeController");

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");
const adRoutes = require("./routes/adRoutes");
const screenRoutes = require("./routes/screenRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const passport = configurePassport();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Stripe webhooks need the raw body for signature verification
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function checkDb() {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL Connected");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("   Check backend/.env and run: mysql -u root -p < schema.sql");
  }
}
checkDb();

app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/assign", assignmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "AdMax India API running" });
});

app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ready", async (_req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    return res.status(200).json({ status: "ready" });
  } catch (err) {
    return res.status(503).json({ status: "not_ready", message: err.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error("🔥 Server Error:", err.message || err);
  if (err instanceof multer.MulterError || err.message?.includes("Only image")) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
