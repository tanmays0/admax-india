const db = require("../config/db");

exports.createCampaign = (req, res) => {

  const { name, start_date, end_date } = req.body;

  const sql = `
  INSERT INTO campaigns (name, start_date, end_date)
  VALUES (?, ?, ?)
  `;

  db.query(sql, [name, start_date, end_date], (err, result) => {

    if (err) {

      console.log("DATABASE ERROR:", err);

      return res.status(500).json({
        message: err.sqlMessage
      });

    }

    res.json({
      message: "Campaign created successfully"
    });

  });

};

exports.getCampaigns = (req, res) => {

  const sql = "SELECT * FROM campaigns";

  db.query(sql, (err, result) => {

    if (err) {

      console.log("DATABASE ERROR:", err);

      return res.status(500).json({
        message: err.sqlMessage
      });

    }

    res.json(result);

  });

};