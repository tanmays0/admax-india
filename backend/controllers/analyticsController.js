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
    const isPartner = req.user.role === "partner";

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
      isPartner
        ? "SELECT id, shop_name, city, status FROM screens WHERE partner_id = ?"
        : "SELECT id, shop_name, city, status FROM screens",
      isPartner ? [userId] : []
    );

    const [payments] = await db.query(
      isAdmin
        ? "SELECT amount, status, created_at FROM payments"
        : "SELECT amount, status, created_at FROM payments WHERE user_id = ?",
      isAdmin ? [] : [userId]
    );

    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
    const approvedAds = ads.filter((a) => a.status === "approved" || a.status === "active").length;

    let playRows = [];
    try {
      if (isAdmin) {
        [playRows] = await db.query(
          `SELECT DATE(played_at) AS day, COUNT(*) AS views
           FROM play_events
           WHERE played_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
           GROUP BY DATE(played_at)
           ORDER BY day ASC`,
          [days]
        );
      } else if (isPartner) {
        [playRows] = await db.query(
          `SELECT DATE(pe.played_at) AS day, COUNT(*) AS views
           FROM play_events pe
           JOIN screens s ON s.id = pe.screen_id
           WHERE s.partner_id = ?
             AND pe.played_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
           GROUP BY DATE(pe.played_at)
           ORDER BY day ASC`,
          [userId, days]
        );
      } else {
        [playRows] = await db.query(
          `SELECT DATE(pe.played_at) AS day, COUNT(*) AS views
           FROM play_events pe
           JOIN ads a ON a.id = pe.ad_id
           WHERE a.user_id = ?
             AND pe.played_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
           GROUP BY DATE(pe.played_at)
           ORDER BY day ASC`,
          [userId, days]
        );
      }
    } catch (err) {
      // Table may not exist on older DBs until schema:ensure runs
      console.warn("play_events query skipped:", err.message);
      playRows = [];
    }

    const playMap = Object.fromEntries(
      playRows.map((r) => [String(r.day).slice(0, 10), Number(r.views)])
    );
    const hasPlayData = playRows.length > 0;

    const seed = activeCampaigns * 420 + approvedAds * 180 + screens.length * 95;
    const impressionsSeries = [];
    for (let i = days - 1; i >= 0; i -= Math.max(1, Math.floor(days / 7))) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const wave = Math.round(seed * (0.6 + ((i % 5) + 1) * 0.12));
      impressionsSeries.push({
        date: key,
        views: hasPlayData ? playMap[key] || 0 : wave,
      });
    }

    // Fill daily series when we have real play data
    if (hasPlayData) {
      impressionsSeries.length = 0;
      for (let i = days - 1; i >= 0; i -= 1) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        impressionsSeries.push({ date: key, views: playMap[key] || 0 });
      }
    }

    const byCategoryMap = {};
    for (const c of campaigns) {
      const key = c.category || "Other";
      byCategoryMap[key] = (byCategoryMap[key] || 0) + 1;
    }
    const byCategory = Object.entries(byCategoryMap).map(([name, value]) => ({ name, value }));

    let campaignPerformance;
    if (hasPlayData && !isPartner) {
      const adIds = ads.map((a) => a.id);
      let playsByAd = {};
      if (adIds.length) {
        const [adPlays] = await db.query(
          `SELECT ad_id, COUNT(*) AS views
           FROM play_events
           WHERE ad_id IN (?)
             AND played_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
           GROUP BY ad_id`,
          [adIds, days]
        );
        playsByAd = Object.fromEntries(adPlays.map((r) => [r.ad_id, Number(r.views)]));
      }
      campaignPerformance = campaigns.slice(0, 8).map((c) => ({
        name: c.name,
        impressions: Object.values(playsByAd).reduce((s, n) => s + n, 0),
        status: c.status,
      }));
    } else {
      campaignPerformance = campaigns.slice(0, 8).map((c, idx) => ({
        name: c.name,
        impressions: Math.round(seed * (0.4 + (8 - idx) * 0.08)),
        status: c.status,
      }));
    }

    const spent = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    let topScreens;
    if (hasPlayData) {
      const screenIds = screens.map((s) => s.id);
      let playsByScreen = {};
      if (screenIds.length) {
        const [screenPlays] = await db.query(
          `SELECT screen_id, COUNT(*) AS views
           FROM play_events
           WHERE screen_id IN (?)
             AND played_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
           GROUP BY screen_id`,
          [screenIds, days]
        );
        playsByScreen = Object.fromEntries(screenPlays.map((r) => [r.screen_id, Number(r.views)]));
      }
      topScreens = [...screens]
        .map((s) => ({
          name: s.shop_name,
          views: playsByScreen[s.id] || 0,
          city: s.city,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    } else {
      topScreens = screens.slice(0, 5).map((s, idx) => ({
        name: s.shop_name,
        views: Math.round(seed * (0.2 + (5 - idx) * 0.05)),
        city: s.city,
      }));
    }

    const estimatedWeeklyViews = impressionsSeries.slice(-7).reduce((s, p) => s + p.views, 0);

    return res.json({
      period,
      estimated: !hasPlayData,
      activeCampaigns,
      totalCampaigns: campaigns.length,
      totalAds: ads.length,
      approvedAds,
      totalScreens: screens.length,
      totalSpent: spent,
      estimatedWeeklyViews,
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
