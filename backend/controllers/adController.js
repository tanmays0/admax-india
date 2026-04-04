const db = require("../config/db");

exports.uploadAd = (req, res) => {

  const { user_id, media_url, media_type, duration } = req.body;

  const sql = `
  INSERT INTO ads (user_id, media_url, media_type, duration)
  VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, media_url, media_type, duration], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Ad uploaded successfully"
    });

  });

};