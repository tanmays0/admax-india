const db = require("../config/db");

function makeApplicationCode() {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 90 + 10);
  return `ADX-${stamp}${rand}`;
}

exports.submitApplication = async (req, res) => {
  try {
    const {
      ownerName,
      email,
      phone,
      businessName,
      screenCount,
      screenType,
      screenSize,
      resolution,
      address,
      city,
      state,
      pincode,
      connectivity,
      powerSupply,
      accessType,
      monthlyFootfall,
      primaryAudience,
      terms,
    } = req.body;

    if (!ownerName?.trim() || !email?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: "ownerName, email, and phone are required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }
    if (!address?.trim() || !city?.trim() || !pincode?.trim()) {
      return res.status(400).json({ message: "address, city, and pincode are required" });
    }
    if (!terms) {
      return res.status(400).json({ message: "Please accept the terms" });
    }

    let applicationCode = makeApplicationCode();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const [result] = await db.query(
          `INSERT INTO partner_applications (
            application_code, owner_name, email, phone, business_name,
            screen_count, screen_type, screen_size, resolution,
            address, city, state, pincode, connectivity, power_supply,
            access_type, monthly_footfall, primary_audience, status, payload
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
          [
            applicationCode,
            ownerName.trim(),
            email.trim().toLowerCase(),
            phone.trim(),
            businessName?.trim() || null,
            Number(screenCount) || 1,
            screenType || null,
            screenSize || null,
            resolution || null,
            address.trim(),
            city.trim(),
            state?.trim() || null,
            pincode.trim(),
            connectivity || null,
            powerSupply || null,
            accessType || null,
            monthlyFootfall || null,
            primaryAudience || null,
            JSON.stringify(req.body),
          ]
        );

        return res.status(201).json({
          message: "Application received",
          id: result.insertId,
          applicationCode,
        });
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          applicationCode = makeApplicationCode();
          continue;
        }
        throw err;
      }
    }

    return res.status(500).json({ message: "Failed to create application code" });
  } catch (error) {
    console.error("Partner application error:", error);
    return res.status(500).json({ message: "Failed to submit application" });
  }
};

exports.listApplications = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, application_code, owner_name, email, phone, business_name,
              city, screen_count, status, created_at
       FROM partner_applications
       ORDER BY created_at DESC
       LIMIT 200`
    );
    return res.json(rows);
  } catch (error) {
    console.error("List partner applications error:", error);
    return res.status(500).json({ message: "Failed to load applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const [result] = await db.query("UPDATE partner_applications SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ message: "Application updated", status });
  } catch (error) {
    console.error("Update partner application error:", error);
    return res.status(500).json({ message: "Failed to update application" });
  }
};
