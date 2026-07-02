const db = require("../config/db");

exports.createCampaign = (req, res) => {
  const { name, category, city, radius, start_date, end_date, time_slots } = req.body;

  const timeSlotsJson = time_slots ? JSON.stringify(time_slots) : null;

  const sql = `
    INSERT INTO campaigns (name, category, city, radius, start_date, end_date, time_slots, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
  `;

  db.query(
    sql,
    [name, category, city, radius, start_date, end_date, timeSlotsJson],
    (err, result) => {
      if (err) {
        console.log("DATABASE ERROR:", err);
        return res.status(500).json({
          message: err.sqlMessage || "Failed to create campaign",
        });
      }

      res.json({
        message: "Campaign created successfully",
        campaignId: result.insertId,
      });
    }
  );
};

exports.getCampaigns = (req, res) => {
  const sql = "SELECT * FROM campaigns ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("DATABASE ERROR:", err);
      return res.status(500).json({
        message: err.sqlMessage || "Failed to fetch campaigns",
      });
    }

    res.json(result);
  });
};
