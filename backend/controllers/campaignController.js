const db = require("../config/db");

exports.createCampaign = async (req, res) => {
  try {
    const { name, category, city, radius, start_date, end_date, time_slots } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Campaign name is required" });
    }

    const timeSlotsJson = time_slots ? JSON.stringify(time_slots) : null;

    const [result] = await db.query(
      `INSERT INTO campaigns
        (user_id, name, category, city, radius, start_date, end_date, time_slots, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        req.user.id,
        name.trim(),
        category || null,
        city || null,
        radius || null,
        start_date || null,
        end_date || null,
        timeSlotsJson,
      ]
    );

    return res.status(201).json({
      message: "Campaign created successfully",
      campaignId: result.insertId,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return res.status(500).json({
      message: error.sqlMessage || "Failed to create campaign",
    });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const [rows] = isAdmin
      ? await db.query("SELECT * FROM campaigns ORDER BY created_at DESC")
      : await db.query("SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC", [
          req.user.id,
        ]);
    return res.json(rows);
  } catch (error) {
    console.error("Get campaigns error:", error);
    return res.status(500).json({
      message: error.sqlMessage || "Failed to fetch campaigns",
    });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM campaigns WHERE id = ?", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    const campaign = rows[0];
    if (campaign.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    return res.json(campaign);
  } catch (error) {
    console.error("Get campaign error:", error);
    return res.status(500).json({ message: "Failed to fetch campaign" });
  }
};

exports.updateCampaignStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["draft", "pending", "active", "paused", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [rows] = await db.query("SELECT * FROM campaigns WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Campaign not found" });
    if (rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await db.query("UPDATE campaigns SET status = ? WHERE id = ?", [status, req.params.id]);
    return res.json({ message: "Campaign updated", id: Number(req.params.id), status });
  } catch (error) {
    console.error("Update campaign error:", error);
    return res.status(500).json({ message: "Failed to update campaign" });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM campaigns WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Campaign not found" });
    if (rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }
    await db.query("DELETE FROM campaigns WHERE id = ?", [req.params.id]);
    return res.json({ message: "Campaign deleted" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return res.status(500).json({ message: "Failed to delete campaign" });
  }
};
