const db = require("../config/db");

function daysForPeriod(period) {
  if (period === "7d") return 7;
  if (period === "90d") return 90;
  return 30;
}

exports.getSummary = async (req, res) => {
  try {
    const period = req.query.period || "30d";
    const days = daysForPeriod(period);
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const campaignFilter = isAdmin ? "" : "WHERE user_id = ?";
    const campaignParams = isAdmin ? [] : [userId];

    const [campaigns] = await db.query(
      `SELECT id, name, category, status, created_at, start_date, end_date
       FROM campaigns ${campaignFilter}
       ORDER BY created_at DESC`,
      campaignParams
    );

    const adFilter = isAdmin ? "" : "WHERE user_id = ?";
    const [ads] = await db.query(
      `SELECT id, title, status, media_type, created_at FROM ads ${adFilter}`,
      isAdmin ? [] : [userId]
    );

    const [screens] = await db.query(
      req.user.role === "partner"
        ? "SELECT id, shop_name, city, status FROM screens WHERE partner_id = ?"
        : "SELECT id, shop_name, city, status FROM screens",
      req.user.role === "partner" ? [userId] : []
    );

    const [payments] = await db.query(
      isAdmin
        ? "SELECT amount, status, created_at FROM payments"
        : "SELECT amount, status, created_at FROM payments WHERE user_id = ?",
      isAdmin ? [] : [userId]
    );

    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
    const approvedAds = ads.filter((a) => a.status === "approved" || a.status === "active").length;

    // Deterministic estimated impressions from real entity counts (honestly labeled on frontend)
    const seed = activeCampaigns * 420 + approvedAds * 180 + screens.length * 95;
    const impressionsSeries = [];
    for (let i = days - 1; i >= 0; i -= Math.max(1, Math.floor(days / 7))) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const wave = Math.round(seed * (0.6 + ((i % 5) + 1) * 0.12));
      impressionsSeries.push({
        date: d.toISOString().slice(0, 10),
        views: wave,
      });
    }

    const byCategoryMap = {};
    for (const c of campaigns) {
      const key = c.category || "Other";
      byCategoryMap[key] = (byCategoryMap[key] || 0) + 1;
    }
    const byCategory = Object.entries(byCategoryMap).map(([name, value]) => ({ name, value }));

    const campaignPerformance = campaigns.slice(0, 8).map((c, idx) => ({
      name: c.name,
      impressions: Math.round(seed * (0.4 + (8 - idx) * 0.08)),
      status: c.status,
    }));

    const spent = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const topScreens = screens.slice(0, 5).map((s, idx) => ({
      name: s.shop_name,
      views: Math.round(seed * (0.2 + (5 - idx) * 0.05)),
      city: s.city,
    }));

    return res.json({
      period,
      estimated: true,
      activeCampaigns,
      totalCampaigns: campaigns.length,
      totalAds: ads.length,
      approvedAds,
      totalScreens: screens.length,
      totalSpent: spent,
      estimatedWeeklyViews: impressionsSeries.slice(-7).reduce((s, p) => s + p.views, 0),
      impressionsSeries,
      byCategory,
      campaignPerformance,
      topScreens,
      recentCampaigns: campaigns.slice(0, 5),
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    return res.status(500).json({ message: "Failed to load analytics" });
  }
};
