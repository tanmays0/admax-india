const express = require("express");
const router = express.Router();
const { getPlayerAds, recordPlay } = require("../controllers/playerController");

// Public — TV players don't send JWT
router.get("/:screenId", getPlayerAds);
router.post("/:screenId/play", recordPlay);

module.exports = router;
