const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const db = require("./db");

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return {
    firstName: parts[0] || null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  if (!email) {
    throw new Error("OAuth provider did not return an email address");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [byOauth] = await db.query(
    "SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ? LIMIT 1",
    [provider, providerId]
  );
  if (byOauth.length) {
    const user = byOauth[0];
    if (avatarUrl && !user.avatar_url) {
      await db.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, user.id]);
      user.avatar_url = avatarUrl;
    }
    return user;
  }

  const [byEmail] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [
    normalizedEmail,
  ]);
  if (byEmail.length) {
    const user = byEmail[0];
    await db.query(
      `UPDATE users SET
        oauth_provider = ?,
        oauth_id = ?,
        avatar_url = COALESCE(avatar_url, ?)
       WHERE id = ?`,
      [provider, providerId, avatarUrl || null, user.id]
    );
    user.oauth_provider = provider;
    user.oauth_id = providerId;
    if (!user.avatar_url && avatarUrl) user.avatar_url = avatarUrl;
    return user;
  }

  const { firstName, lastName } = splitName(name);
  const displayName = name?.trim() || normalizedEmail.split("@")[0];

  const [result] = await db.query(
    `INSERT INTO users
      (name, first_name, last_name, email, password, role, oauth_provider, oauth_id, avatar_url)
     VALUES (?, ?, ?, ?, NULL, 'advertiser', ?, ?, ?)`,
    [
      displayName,
      firstName,
      lastName,
      normalizedEmail,
      provider,
      providerId,
      avatarUrl || null,
    ]
  );

  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
  return rows[0];
}

function configurePassport() {
  const appUrl = (process.env.APP_URL || "http://localhost:5000").replace(/\/$/, "");

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${appUrl}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.find((e) => e.verified !== false)?.value ||
              profile.emails?.[0]?.value;
            const user = await findOrCreateOAuthUser({
              provider: "google",
              providerId: profile.id,
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value || null,
            });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${appUrl}/api/auth/github/callback`,
          scope: ["user:email"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const primaryEmail =
              profile.emails?.find((e) => e.primary)?.value ||
              profile.emails?.[0]?.value;
            const user = await findOrCreateOAuthUser({
              provider: "github",
              providerId: String(profile.id),
              email: primaryEmail,
              name: profile.displayName || profile.username,
              avatarUrl: profile.photos?.[0]?.value || null,
            });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  return passport;
}

module.exports = {
  configurePassport,
  findOrCreateOAuthUser,
};
