const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:screenId", async (req, res) => {
  try {
    const { screenId } = req.params;

    const [ads] = await db.query(
      `
      SELECT a.*
      FROM ads a
      JOIN screen_ads sa ON a.id = sa.ad_id
      WHERE sa.screen_id = ?
    `,
      [screenId]
    );

    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load ads" });
  }
});

module.exports = router;
