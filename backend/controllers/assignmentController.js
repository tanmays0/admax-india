const db = require("../config/db");

exports.assignAd = async (req, res) => {
  try {
    const { ad_id, screen_ids, campaign_id } = req.body;

    if (!ad_id || !Array.isArray(screen_ids) || screen_ids.length === 0) {
      return res.status(400).json({ message: "ad_id and screen_ids are required" });
    }

    const [ads] = await db.query("SELECT * FROM ads WHERE id = ?", [ad_id]);
    if (!ads.length) {
      return res.status(404).json({ message: "Ad not found" });
    }
    if (ads[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to assign this ad" });
    }

    const values = screen_ids.map((screenId) => [
      Number(screenId),
      Number(ad_id),
      campaign_id ? Number(campaign_id) : null,
    ]);

    await db.query(
      `INSERT INTO screen_ads (screen_id, ad_id, campaign_id)
       VALUES ?
       ON DUPLICATE KEY UPDATE campaign_id = VALUES(campaign_id)`,
      [values]
    );

    return res.json({ message: "Ad assigned to screens successfully" });
  } catch (error) {
    console.error("Assign error:", error);
    return res.status(500).json({ message: "Assignment failed" });
  }
};
