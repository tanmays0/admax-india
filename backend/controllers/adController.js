const db = require("../config/db");

function mediaTypeFromFile(file) {
  if (!file) return "image";
  if (file.mimetype.startsWith("video/")) return "video";
  return "image";
}

function publicUrl(req, filename) {
  const base = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  return `${base}/uploads/${filename}`;
}

exports.getAds = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const [rows] = isAdmin
      ? await db.query("SELECT * FROM ads ORDER BY created_at DESC")
      : await db.query("SELECT * FROM ads WHERE user_id = ? ORDER BY created_at DESC", [
          req.user.id,
        ]);
    return res.json(rows);
  } catch (error) {
    console.error("Get ads error:", error);
    return res.status(500).json({ message: "Failed to fetch ads" });
  }
};

exports.uploadAd = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Media file is required" });
    }

    const title = (req.body.title || "Untitled Ad").trim();
    const duration = Number(req.body.duration) || 15;
    const media_type = mediaTypeFromFile(req.file);
    const media_url = publicUrl(req, req.file.filename);

    const [result] = await db.query(
      `INSERT INTO ads (user_id, title, media_url, media_type, duration, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, title, media_url, media_type, duration]
    );

    return res.status(201).json({
      message: "Ad uploaded successfully",
      ad: {
        id: result.insertId,
        user_id: req.user.id,
        title,
        media_url,
        media_type,
        duration,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Upload ad error:", error);
    return res.status(500).json({ message: error.message || "Upload failed" });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const adId = Number(req.params.id);
    const [rows] = await db.query("SELECT * FROM ads WHERE id = ?", [adId]);
    if (!rows.length) {
      return res.status(404).json({ message: "Ad not found" });
    }
    if (rows[0].user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await db.query("DELETE FROM ads WHERE id = ?", [adId]);
    return res.json({ message: "Ad deleted" });
  } catch (error) {
    console.error("Delete ad error:", error);
    return res.status(500).json({ message: "Failed to delete ad" });
  }
};

exports.updateAdStatus = async (req, res) => {
  try {
    const adId = Number(req.params.id);
    const { status } = req.body;
    const allowed = ["pending", "approved", "rejected", "active"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can change ad status" });
    }

    const [rows] = await db.query("SELECT * FROM ads WHERE id = ?", [adId]);
    if (!rows.length) return res.status(404).json({ message: "Ad not found" });

    await db.query("UPDATE ads SET status = ? WHERE id = ?", [status, adId]);
    return res.json({ message: "Ad status updated", id: adId, status });
  } catch (error) {
    console.error("Update ad status error:", error);
    return res.status(500).json({ message: "Failed to update ad status" });
  }
};
