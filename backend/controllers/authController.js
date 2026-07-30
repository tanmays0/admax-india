const bcrypt = require("bcrypt");
const db = require("../config/db");
const { signToken, sanitizeUser } = require("../middleware/auth");

const ALLOWED_ROLES = new Set(["advertiser", "partner", "admin"]);

function publicUrl(_req, filename) {
  // Relative path so the Vite /uploads proxy (and same-origin hosting) serve the file.
  return `/uploads/${filename}`;
}

function buildFullName(firstName, lastName, fallback) {
  const full = [firstName, lastName].filter(Boolean).join(" ").trim();
  return full || fallback || null;
}

async function fetchUser(id) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      business_name,
      category,
      location,
      role,
      account_type,
      accountType,
    } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const requestedRole = (role || account_type || accountType || "advertiser").toLowerCase();
    const userRole =
      ALLOWED_ROLES.has(requestedRole) && requestedRole !== "admin" ? requestedRole : "advertiser";

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email.trim()]);
    if (existing.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || null;
    const lastName = nameParts.slice(1).join(" ") || null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users
        (name, first_name, last_name, email, password, role, business_name, category, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        firstName,
        lastName,
        email.trim().toLowerCase(),
        hashedPassword,
        userRole,
        business_name || null,
        category || null,
        location || null,
      ]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);
    if (!rows.length) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google or GitHub sign-in. Continue with OAuth instead.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: signToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await fetchUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      firstName,
      lastName,
      email,
      phone,
      business_name,
      businessName,
      category,
      location,
      address,
      city,
      pincode,
      notification_prefs,
      notificationPrefs,
    } = req.body;

    const first = (first_name ?? firstName)?.trim() || null;
    const last = (last_name ?? lastName)?.trim() || null;
    const bizName = (business_name ?? businessName)?.trim() || null;
    const loc = (location ?? address)?.trim() || null;
    const prefs = notification_prefs ?? notificationPrefs;

    if (email?.trim()) {
      const [dup] = await db.query("SELECT id FROM users WHERE email = ? AND id <> ?", [
        email.trim().toLowerCase(),
        req.user.id,
      ]);
      if (dup.length) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    const current = await fetchUser(req.user.id);
    if (!current) return res.status(404).json({ message: "User not found" });

    const nextFirst = first !== null ? first : current.first_name;
    const nextLast = last !== null ? last : current.last_name;
    const fullName = buildFullName(nextFirst, nextLast, current.name);

    await db.query(
      `UPDATE users SET
        first_name = ?,
        last_name = ?,
        name = ?,
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        business_name = COALESCE(?, business_name),
        category = COALESCE(?, category),
        location = COALESCE(?, location),
        city = COALESCE(?, city),
        pincode = COALESCE(?, pincode),
        notification_prefs = COALESCE(?, notification_prefs)
       WHERE id = ?`,
      [
        nextFirst,
        nextLast,
        fullName,
        email?.trim()?.toLowerCase() || null,
        phone?.trim() || null,
        bizName,
        category || null,
        loc,
        city?.trim() || null,
        pincode?.trim() || null,
        prefs != null ? JSON.stringify(prefs) : null,
        req.user.id,
      ]
    );

    const user = await fetchUser(req.user.id);
    return res.json({ message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Avatar file is required" });
    }
    const avatarUrl = publicUrl(req, req.file.filename);
    await db.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, req.user.id]);
    const user = await fetchUser(req.user.id);
    return res.json({ message: "Avatar updated", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return res.status(500).json({ message: "Failed to upload avatar" });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    await db.query("UPDATE users SET avatar_url = NULL WHERE id = ?", [req.user.id]);
    const user = await fetchUser(req.user.id);
    return res.json({ message: "Avatar removed", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return res.status(500).json({ message: "Failed to remove avatar" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await fetchUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      const hash = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id]);
      return res.json({ message: "Password set successfully" });
    }

    if (!currentPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, req.user.id]);
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Failed to update password" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await fetchUser(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Password is required to delete account" });
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
    }

    await db.query("DELETE FROM users WHERE id = ?", [req.user.id]);
    return res.json({ message: "Account deleted" });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, first_name, last_name, email, role, business_name, category, city,
              avatar_url, onboarding_complete, oauth_provider, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    console.error("List users error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};
