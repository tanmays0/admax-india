const db = require("../config/db");

exports.getPlayerAds = async (req, res) => {
  try {
    const { screenId } = req.params;

    const [ads] = await db.query(
      `SELECT a.id, a.title, a.media_url, a.media_type, a.duration, a.status
       FROM ads a
       JOIN screen_ads sa ON a.id = sa.ad_id
       WHERE sa.screen_id = ?
         AND a.status IN ('approved', 'active', 'pending')
       ORDER BY sa.assigned_at DESC`,
      [screenId]
    );

    return res.json(ads);
  } catch (error) {
    console.error("Player error:", error);
    return res.status(500).json({ message: "Failed to load ads" });
  }
};
