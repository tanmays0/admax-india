const express = require("express");
const router = express.Router();
const { addScreen, getScreens } = require("../controllers/screenController");

router.post("/add", addScreen);
router.get("/", getScreens);

module.exports = router;
