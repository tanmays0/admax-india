const crypto = require("crypto");
const db = require("../config/db");

function makeOrderId() {
  return `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

exports.createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const campaignId = req.body.campaignId || req.body.campaign_id || null;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const orderId = makeOrderId();
    const amountPaise = Math.round(amount * 100);

    await db.query(
      `INSERT INTO payments (user_id, campaign_id, order_id, amount, currency, status)
       VALUES (?, ?, ?, ?, 'INR', 'created')`,
      [req.user.id, campaignId, orderId, amount]
    );

    // Mock Razorpay-compatible payload when keys are not configured
    return res.json({
      orderId,
      amount: amountPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || null,
      mock: !process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: "Failed to create payment order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, payment_id } =
      req.body;

    const orderId = razorpay_order_id || order_id;
    const paymentId = razorpay_payment_id || payment_id || `pay_mock_${Date.now()}`;

    if (!orderId) {
      return res.status(400).json({ message: "order_id is required" });
    }

    const [rows] = await db.query("SELECT * FROM payments WHERE order_id = ?", [orderId]);
    if (!rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Full signature verification when Razorpay secret is present
    if (process.env.RAZORPAY_KEY_SECRET && razorpay_signature && razorpay_payment_id) {
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${razorpay_payment_id}`)
        .digest("hex");
      if (expected !== razorpay_signature) {
        await db.query("UPDATE payments SET status = 'failed' WHERE order_id = ?", [orderId]);
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    await db.query(`UPDATE payments SET payment_id = ?, status = 'paid' WHERE order_id = ?`, [
      paymentId,
      orderId,
    ]);

    return res.json({
      message: "Payment verified",
      orderId,
      paymentId,
      status: "paid",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const sql = isAdmin
      ? `SELECT p.*, c.name AS campaign_name
         FROM payments p
         LEFT JOIN campaigns c ON c.id = p.campaign_id
         ORDER BY p.created_at DESC`
      : `SELECT p.*, c.name AS campaign_name
         FROM payments p
         LEFT JOIN campaigns c ON c.id = p.campaign_id
         WHERE p.user_id = ?
         ORDER BY p.created_at DESC`;
    const [rows] = isAdmin ? await db.query(sql) : await db.query(sql, [req.user.id]);
    return res.json(rows);
  } catch (error) {
    console.error("Get payments error:", error);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};
