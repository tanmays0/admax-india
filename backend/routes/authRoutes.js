const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
  deleteAccount,
  listUsers,
} = require("../controllers/authController");
const {
  oauthSuccess,
  oauthFailure,
  getOAuthProviders,
} = require("../controllers/oauthController");
const { authenticate, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfile);
router.post("/avatar", authenticate, upload.single("avatar"), uploadAvatar);
router.delete("/avatar", authenticate, deleteAvatar);
router.put("/password", authenticate, changePassword);
router.delete("/account", authenticate, deleteAccount);
router.get("/users", authenticate, authorize("admin"), listUsers);

router.get("/providers", getOAuthProviders);

function providerConfigured(name) {
  if (name === "google") {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  }
  if (name === "github") {
    return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
  }
  return false;
}

function requireProvider(name) {
  return (req, res, next) => {
    if (!providerConfigured(name)) {
      return res.status(503).json({
        message: `${name} OAuth is not configured. Set credentials in backend/.env`,
      });
    }
    return next();
  };
}

router.get(
  "/google",
  requireProvider("google"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  requireProvider("google"),
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  oauthSuccess
);

router.get(
  "/github",
  requireProvider("github"),
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  requireProvider("github"),
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  oauthSuccess
);

router.get("/oauth/failure", oauthFailure);

module.exports = router;
