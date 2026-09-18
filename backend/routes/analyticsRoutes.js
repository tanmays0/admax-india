const express = require("express");
const router = express.Router();
const { getSummary } = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

router.get("/summary", authenticate, getSummary);

module.exports = router;
