const db = require("../config/db");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, business, city, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "name, email, and message are required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, phone, business, city, message, source)
       VALUES (?, ?, ?, ?, ?, ?, 'contact')`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        business?.trim() || null,
        city?.trim() || null,
        message.trim(),
      ]
    );

    return res.status(201).json({
      message: "Message received. We will reply within 4 business hours.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Contact submit error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
};

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    await db.query(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE source = VALUES(source)`,
      [email.trim().toLowerCase(), source?.trim() || "blog"]
    );

    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return res.status(500).json({ message: "Failed to subscribe" });
  }
};

exports.listContactMessages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100"
    );
    return res.json(rows);
  } catch (error) {
    console.error("List contact messages error:", error);
    return res.status(500).json({ message: "Failed to load messages" });
  }
};
