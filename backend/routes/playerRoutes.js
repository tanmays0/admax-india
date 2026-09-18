const express = require("express");
const router = express.Router();
const { getPlayerAds } = require("../controllers/playerController");

// Public — TV players don't send JWT
router.get("/:screenId", getPlayerAds);

module.exports = router;
