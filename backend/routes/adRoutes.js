const express = require("express");
const router = express.Router();
const { uploadAd } = require("../controllers/adController");

router.post("/upload", uploadAd);

module.exports = router;