const express = require("express");
const router = express.Router();
const {
  submitApplication,
  listApplications,
  updateApplicationStatus,
} = require("../controllers/partnerApplicationController");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/", submitApplication);
router.get("/", authenticate, authorize("admin"), listApplications);
router.patch("/:id", authenticate, authorize("admin"), updateApplicationStatus);

module.exports = router;
