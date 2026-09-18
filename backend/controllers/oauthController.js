const { signToken, sanitizeUser } = require("../middleware/auth");

function frontendBase() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
}

function redirectWithError(res, message) {
  const url = new URL("/auth/callback", frontendBase());
  url.searchParams.set("error", message);
  return res.redirect(url.toString());
}

exports.oauthSuccess = (req, res) => {
  try {
    if (!req.user) {
      return redirectWithError(res, "Authentication failed");
    }

    const token = signToken(req.user);
    const user = sanitizeUser(req.user);
    const url = new URL("/auth/callback", frontendBase());
    url.searchParams.set("token", token);
    // Compact user payload so the SPA can hydrate without an extra round-trip
    url.searchParams.set("user", Buffer.from(JSON.stringify(user)).toString("base64url"));
    return res.redirect(url.toString());
  } catch (error) {
    console.error("OAuth success handler error:", error);
    return redirectWithError(res, "Authentication failed");
  }
};

exports.oauthFailure = (_req, res) => {
  return redirectWithError(res, "OAuth sign-in was cancelled or failed");
};

exports.getOAuthProviders = (_req, res) => {
  return res.json({
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  });
};
