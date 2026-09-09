const express = require("express");
const router = express.Router();
const {
  addScreen,
  getScreens,
  getPublicScreens,
  updateScreen,
  deleteScreen,
} = require("../controllers/screenController");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/public", getPublicScreens);
router.get("/", authenticate, getScreens);
router.post("/add", authenticate, authorize("partner", "admin"), addScreen);
router.patch("/:id", authenticate, authorize("partner", "admin"), updateScreen);
router.delete("/:id", authenticate, authorize("partner", "admin"), deleteScreen);

module.exports = router;
