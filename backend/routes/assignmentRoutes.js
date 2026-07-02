const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/assign", async (req, res) => {
  try {
    const { ad_id, screen_ids } = req.body;

    if (!ad_id || !screen_ids || screen_ids.length === 0) {
      return res.status(400).json({ error: "Missing data" });
    }

    const values = screen_ids.map((screenId) => [screenId, ad_id]);

    await db.query("INSERT INTO screen_ads (screen_id, ad_id) VALUES ?", [values]);

    res.json({ message: "Ad assigned to screens successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assignment failed" });
  }
});

module.exports = router;
