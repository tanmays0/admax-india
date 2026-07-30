const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPayments,
} = require("../controllers/paymentController");
const { authenticate } = require("../middleware/auth");

router.post("/create-order", authenticate, createOrder);
router.post("/verify", authenticate, verifyPayment);
router.get("/", authenticate, getPayments);

module.exports = router;
