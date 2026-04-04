const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");
const adRoutes = require("./routes/adRoutes");
const screenRoutes = require("./routes/screenRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();

/* ───────── Middleware ───────── */
app.use(cors());
app.use(express.json());

/* ───────── DB Check ───────── */
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected");
    connection.release();
  }
});

/* ───────── Routes ───────── */
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/screens", screenRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/assign", assignmentRoutes);

/* ───────── Health Check ───────── */
app.get("/", (req, res) => {
  res.send("🚀 AdMax India API running");
});

/* ───────── Global Error Handler ───────── */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong on the server",
  });
});

/* ───────── Server Start ───────── */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});