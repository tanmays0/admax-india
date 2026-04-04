const db = require("../config/db");

exports.addScreen = (req, res) => {

  const { shop_name, city, latitude, longitude } = req.body;

  const sql = `
  INSERT INTO screens (shop_name, city, latitude, longitude)
  VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [shop_name, city, latitude, longitude], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Screen added successfully"
    });

  });

};

exports.getScreens = (req, res) => {

  const sql = "SELECT * FROM screens";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

};