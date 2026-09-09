const express = require("express");
const router = express.Router();
const {
  submitContact,
  subscribeNewsletter,
  listContactMessages,
} = require("../controllers/contactController");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", submitContact);
router.post("/newsletter", subscribeNewsletter);
router.get("/", authenticate, authorize("admin"), listContactMessages);

module.exports = router;
