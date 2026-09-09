const db = require("../config/db");

const SCREEN_PLACEHOLDER = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";

exports.addScreen = async (req, res) => {
  try {
    const { shop_name, city, latitude, longitude } = req.body;
    if (!shop_name?.trim() || !city?.trim()) {
      return res.status(400).json({ message: "shop_name and city are required" });
    }

    const partnerId = req.user.role === "partner" ? req.user.id : req.body.partner_id || null;

    const [result] = await db.query(
      `INSERT INTO screens (partner_id, shop_name, city, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [partnerId, shop_name.trim(), city.trim(), latitude || null, longitude || null]
    );

    return res.status(201).json({
      message: "Screen added successfully",
      screenId: result.insertId,
    });
  } catch (error) {
    console.error("Add screen error:", error);
    return res.status(500).json({ message: "Failed to add screen" });
  }
};

exports.getScreens = async (req, res) => {
  try {
    let rows;
    if (req.user.role === "partner") {
      [rows] = await db.query(
        "SELECT * FROM screens WHERE partner_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
    } else {
      [rows] = await db.query("SELECT * FROM screens ORDER BY created_at DESC");
    }
    return res.json(rows);
  } catch (error) {
    console.error("Get screens error:", error);
    return res.status(500).json({ message: "Failed to fetch screens" });
  }
};

exports.getPublicScreens = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, shop_name, city, latitude, longitude, status
       FROM screens
       WHERE status = 'active'
         AND latitude IS NOT NULL
         AND longitude IS NOT NULL
       ORDER BY city, shop_name`
    );

    return res.json(
      rows.map((s) => ({
        id: s.id,
        name: s.shop_name,
        city: s.city,
        lat: Number(s.latitude),
        lng: Number(s.longitude),
        status: s.status,
        image: SCREEN_PLACEHOLDER,
      }))
    );
  } catch (error) {
    console.error("Public screens error:", error);
    return res.status(500).json({ message: "Failed to fetch screens" });
  }
};

exports.updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { shop_name, city, latitude, longitude, status } = req.body;

    const [existing] = await db.query("SELECT * FROM screens WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const screen = existing[0];
    if (req.user.role === "partner" && Number(screen.partner_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Not allowed to update this screen" });
    }

    const nextStatus = status || screen.status;
    if (!["active", "inactive", "pending"].includes(nextStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query(
      `UPDATE screens
       SET shop_name = ?, city = ?, latitude = ?, longitude = ?, status = ?
       WHERE id = ?`,
      [
        shop_name?.trim() || screen.shop_name,
        city?.trim() || screen.city,
        latitude !== undefined ? latitude : screen.latitude,
        longitude !== undefined ? longitude : screen.longitude,
        nextStatus,
        id,
      ]
    );

    return res.json({ message: "Screen updated" });
  } catch (error) {
    console.error("Update screen error:", error);
    return res.status(500).json({ message: "Failed to update screen" });
  }
};

exports.deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query("SELECT * FROM screens WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ message: "Screen not found" });
    }

    const screen = existing[0];
    if (req.user.role === "partner" && Number(screen.partner_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: "Not allowed to delete this screen" });
    }

    await db.query("DELETE FROM screens WHERE id = ?", [id]);
    return res.json({ message: "Screen deleted" });
  } catch (error) {
    console.error("Delete screen error:", error);
    return res.status(500).json({ message: "Failed to delete screen" });
  }
};
