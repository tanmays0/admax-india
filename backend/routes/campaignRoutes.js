const express = require("express");
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaignStatus,
  deleteCampaign,
} = require("../controllers/campaignController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, getCampaigns);
router.get("/:id", authenticate, getCampaignById);
router.post("/create", authenticate, createCampaign);
router.patch("/:id/status", authenticate, updateCampaignStatus);
router.delete("/:id", authenticate, deleteCampaign);

module.exports = router;
