const express = require("express");
const router = express.Router();
const {
  getStripeConfig,
  createCheckoutSession,
  createPortalSession,
  getSubscription,
  getCheckoutSession,
} = require("../controllers/stripeController");
const { authenticate } = require("../middleware/auth");

router.get("/config", getStripeConfig);
router.post("/checkout", authenticate, createCheckoutSession);
router.post("/portal", authenticate, createPortalSession);
router.get("/subscription", authenticate, getSubscription);
router.get("/session/:sessionId", authenticate, getCheckoutSession);

module.exports = router;
