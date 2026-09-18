const express = require("express");
const router = express.Router();
const { getAds, uploadAd, deleteAd, updateAdStatus } = require("../controllers/adController");
const { authenticate, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.get("/", authenticate, getAds);
router.post("/upload", authenticate, upload.single("media"), uploadAd);
router.patch("/:id/status", authenticate, authorize("admin"), updateAdStatus);
router.delete("/:id", authenticate, deleteAd);

module.exports = router;
