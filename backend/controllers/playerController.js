const db = require("../config/db");

exports.getPlayerAds = async (req, res) => {
  try {
    const { screenId } = req.params;

    const [ads] = await db.query(
      `SELECT a.id, a.title, a.media_url, a.media_type, a.duration, a.status
       FROM ads a
       JOIN screen_ads sa ON a.id = sa.ad_id
       WHERE sa.screen_id = ?
         AND a.status IN ('approved', 'active')
       ORDER BY sa.assigned_at DESC`,
      [screenId]
    );

    return res.json(ads);
  } catch (error) {
    console.error("Player error:", error);
    return res.status(500).json({ message: "Failed to load ads" });
  }
};

exports.recordPlay = async (req, res) => {
  try {
    const { screenId } = req.params;
    const { ad_id: adId } = req.body || {};

    const [screens] = await db.query("SELECT id FROM screens WHERE id = ?", [screenId]);
    if (!screens.length) {
      return res.status(404).json({ message: "Screen not found" });
    }

    if (adId) {
      const [ads] = await db.query("SELECT id FROM ads WHERE id = ?", [adId]);
      if (!ads.length) {
        return res.status(404).json({ message: "Ad not found" });
      }
    }

    await db.query("INSERT INTO play_events (screen_id, ad_id) VALUES (?, ?)", [
      screenId,
      adId || null,
    ]);

    return res.status(201).json({ message: "Play recorded" });
  } catch (error) {
    console.error("Record play error:", error);
    return res.status(500).json({ message: "Failed to record play" });
  }
};
