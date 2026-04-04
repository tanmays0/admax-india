const db = require("../config/db");

exports.getScreenAds = (req, res) => {

  const screenId = req.params.screen_id;

  const sql = `
  SELECT ads.media_url, ads.media_type, ads.duration
  FROM screen_ads
  JOIN ads ON screen_ads.ad_id = ads.id
  WHERE screen_ads.screen_id = ?
  `;

  db.query(sql, [screenId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

};