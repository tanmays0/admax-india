const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "admax_secret_key";

exports.registerUser = async (req, res) => {
  const { name, email, password, business_name, category, location } = req.body;

  try {
    const checkUser = "SELECT * FROM users WHERE email = ?";

    db.query(checkUser, [email], async (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users
        (name,email,password,business_name,category,location)
        VALUES (?,?,?,?,?,?)
      `;

      db.query(
        sql,
        [name, email, hashedPassword, business_name, category, location],
        (err, _result) => {
          if (err) {
            return res.status(500).json(err);
          }

          res.status(201).json({
            message: "User registered successfully",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (result.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  });
};
