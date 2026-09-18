const express = require("express");
const router = express.Router();
const { completeOnboarding } = require("../controllers/onboardingController");
const { authenticate } = require("../middleware/auth");

router.post("/complete", authenticate, completeOnboarding);

module.exports = router;
