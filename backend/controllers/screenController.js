const db = require("../config/db");

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
