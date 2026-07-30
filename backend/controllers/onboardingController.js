const db = require("../config/db");
const { sanitizeUser } = require("../middleware/auth");

exports.completeOnboarding = async (req, res) => {
  try {
    const {
      businessName,
      business_name,
      city,
      pincode,
      contactPerson,
      contact_person,
      email,
      phone,
      businessType,
      business_type,
      targetAudience,
      target_audience,
      monthlyBudget,
      monthly_budget,
      category,
      address,
    } = req.body;

    await db.query(
      `UPDATE users SET
        business_name = COALESCE(?, business_name),
        city = COALESCE(?, city),
        location = COALESCE(?, location),
        pincode = COALESCE(?, pincode),
        contact_person = COALESCE(?, contact_person),
        phone = COALESCE(?, phone),
        business_type = COALESCE(?, business_type),
        category = COALESCE(?, category),
        target_audience = COALESCE(?, target_audience),
        monthly_budget = COALESCE(?, monthly_budget),
        onboarding_complete = 1
       WHERE id = ?`,
      [
        businessName || business_name || null,
        city || null,
        address || city || null,
        pincode || null,
        contactPerson || contact_person || null,
        phone || null,
        businessType || business_type || null,
        category || businessType || business_type || null,
        targetAudience || target_audience || null,
        monthlyBudget || monthly_budget || null,
        req.user.id,
      ]
    );

    // Optional: keep email in sync if provided and different
    if (email?.trim()) {
      await db.query("UPDATE users SET email = ? WHERE id = ?", [
        email.trim().toLowerCase(),
        req.user.id,
      ]);
    }

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    return res.json({
      message: "Onboarding complete",
      user: sanitizeUser(rows[0]),
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ message: "Onboarding failed" });
  }
};
