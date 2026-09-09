const express = require("express");
const router = express.Router();
const { assignAd, unassignAd } = require("../controllers/assignmentController");
const { authenticate } = require("../middleware/auth");

router.post("/assign", authenticate, assignAd);
router.post("/unassign", authenticate, unassignAd);

module.exports = router;
