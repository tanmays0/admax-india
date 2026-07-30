const express = require("express");
const router = express.Router();
const { assignAd } = require("../controllers/assignmentController");
const { authenticate } = require("../middleware/auth");

router.post("/assign", authenticate, assignAd);

module.exports = router;
