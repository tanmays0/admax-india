const express = require("express");
const router = express.Router();
const { addScreen, getScreens } = require("../controllers/screenController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, getScreens);
router.post("/add", authenticate, addScreen);

module.exports = router;
