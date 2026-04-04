import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── Mock data (replace with API calls) ──────────────────────────
const impressionData = [
  { day: "Mon", views: 420 }, { day: "Tue", views: 680 },
  { day: "Wed", views: 540 }, { day: "Thu", views: 920 },
  { day: "Fri", views: 1100 }, { day: "Sat", views: 860 },
  { day: "Sun", views: 740 },
];

const screenData = [
  { name: "IronFit Gym", views: 340, status: "online" },
  { name: "Bean & Brew", views: 290, status: "online" },
  { name: "CityClinic", views: 210, status: "online" },
  { name: "Glow Salon", views: 180, status: "offline" },
  { name: "Pizza Palace", views: 160, status: "online" },
];

const recentCampaigns = [
  { name: "Summer Promo", status: "active", screens: 8, impressions: "2.4k", end: "Jun 30" },
  { name: "Weekend Special", status: "active", screens: 5, impressions: "1.1k", end: "Jun 15" },
  { name: "Grand Opening", status: "paused", screens: 12, impressions: "5.8k", end: "May 31" },
  { name: "Health Week", status: "ended", screens: 6, impressions: "3.2k", end: "May 20" },
];

const statusColors = {
  active: { bg: "#dcfce7", color: "#16a34a", label: "Active" },
  paused: { bg: "#fef9c3", color: "#ca8a04", label: "Paused" },
  ended: { bg: "#f3f4f6", color: "#6b7280", label: "Ended" },
};

// ── Custom Tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white", border: "1px solid #efefef",
        borderRadius: "10px", padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <p style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "16px", fontWeight: "700", color: "#1F7A4D" }}>
          {payload[0].value.toLocaleString()} views
        </p>
      </div>
    );
  }
  return null;
};

// ── Stat Card ───────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, trend, color = "#1F7A4D", delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const target = typeof value === "number" ? value : 0;

  useEffect(() => {
    let start = null;
    const duration = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <div style={{
      background: "white", border: "1px solid #efefef",
      borderRadius: "20px", padding: "24px 28px",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: `${color}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
        }}>{icon}</div>
        {trend && (
          <span style={{
            fontSize: "12px", fontWeight: "600",
            color: trend > 0 ? "#16a34a" : "#dc2626",
            background: trend > 0 ? "#dcfce7" : "#fef2f2",
            padding: "3px 8px", borderRadius: "100px",
          }}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: "32px", fontWeight: "800",
        color: "#0a0a0a", letterSpacing: "-0.03em",
        lineHeight: "1", marginBottom: "6px",
      }}>
        {typeof value === "number" ? displayed.toLocaleString() : value}
      </div>
      <div style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "12px", color: "#aaa" }}>{sub}</div>}
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────────
const navItems = [
  { icon: "⚡", label: "Dashboard", path: "/dashboard", active: true },
  { icon: "📣", label: "Campaigns", path: "/campaigns" },
  { icon: "🖼️", label: "My Ads", path: "/ads" },
  { icon: "📺", label: "Screens", path: "/screens" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
  { icon: "💳", label: "Billing", path: "/billing" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

function Sidebar({ active = "Dashboard" }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{
      width: "240px", minHeight: "100vh",
      background: "white", borderRight: "1px solid #f0f0f0",
      display: "flex", flexDirection: "column",
      padding: "24px 16px", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 12px", marginBottom: "32px",
      }}>
        <div style={{
          width: "36px", height: "36px", background: "#1F7A4D",
          borderRadius: "10px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "16px",
        }}>📺</div>
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>AdMax</div>
          <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "500" }}>India</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#ccc", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>
          MAIN MENU
        </p>
        {navItems.map((item) => {
          const isActive = item.label === active;
          return (
            <Link key={item.label} to={item.path} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "12px", textDecoration: "none",
              background: isActive ? "#EAF7EF" : "transparent",
              color: isActive ? "#1F7A4D" : "#555",
              fontWeight: isActive ? "700" : "500",
              fontSize: "14px", transition: "all 0.18s ease",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
              {item.label}
              {isActive && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#1F7A4D" }} />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "12px",
          marginBottom: "4px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "#EAF7EF", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", flexShrink: 0,
          }}>👤</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>My Business</div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>Advertiser</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", background: "none", border: "none",
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "12px",
          color: "#888", fontSize: "14px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
          transition: "all 0.18s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}
        >
          <span>🚪</span> Log out
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#f8fafb", fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.12s; }
        .d3 { animation-delay: 0.19s; }
        .d4 { animation-delay: 0.26s; }
        .d5 { animation-delay: 0.33s; }
        .d6 { animation-delay: 0.40s; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
      `}</style>

      <Sidebar active="Dashboard" />

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

        {/* Top bar */}
        <div className="fade-up d1" style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "32px",
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif", fontSize: "26px",
              fontWeight: "800", color: "#0a0a0a",
              letterSpacing: "-0.025em", marginBottom: "4px",
            }}>Good morning 👋</h1>
            <p style={{ fontSize: "14px", color: "#888" }}>Here's what's happening with your campaigns today.</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.15)",
              borderRadius: "100px", padding: "6px 14px",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "12px", color: "#1F7A4D", fontWeight: "600" }}>Network Live</span>
            </div>
            <Link to="/campaigns/new" style={{
              background: "#1F7A4D", color: "white",
              padding: "10px 20px", borderRadius: "12px",
              fontSize: "14px", fontWeight: "700", textDecoration: "none",
              transition: "all 0.2s ease", display: "inline-flex", gap: "6px",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,122,77,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              + New Campaign
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="fade-up d2" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px", marginBottom: "28px",
        }}>
          <StatCard icon="📣" label="Active Campaigns" value={3} sub="2 ending this week" trend={12} delay={0} />
          <StatCard icon="📺" label="Screens Running" value={8} sub="Across 3 locations" trend={5} delay={100} />
          <StatCard icon="🖼️" label="Total Ads" value={12} sub="4 pending approval" delay={200} />
          <StatCard icon="👁️" label="Impressions Today" value={1847} sub="↑ from yesterday" trend={18} delay={300} />
        </div>

        {/* Charts Row */}
        <div className="fade-up d3" style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px", marginBottom: "24px",
        }}>
          {/* Area chart */}
          <div style={{
            background: "white", border: "1px solid #efefef",
            borderRadius: "20px", padding: "24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "2px" }}>Weekly Impressions</h3>
                <p style={{ fontSize: "12px", color: "#aaa" }}>Views across all active screens</p>
              </div>
              <span style={{
                background: "#EAF7EF", color: "#1F7A4D",
                fontSize: "11px", fontWeight: "700",
                padding: "4px 10px", borderRadius: "100px",
              }}>This Week</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={impressionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A4D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1F7A4D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#1F7A4D" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: "#1F7A4D", r: 3 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart — top screens */}
          <div style={{
            background: "white", border: "1px solid #efefef",
            borderRadius: "20px", padding: "24px",
          }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "2px" }}>Top Screens</h3>
              <p style={{ fontSize: "12px", color: "#aaa" }}>By views this week</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={screenData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#1F7A4D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaigns table + Screen status */}
        <div className="fade-up d4" style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: "20px",
        }}>
          {/* Campaigns table */}
          <div style={{
            background: "white", border: "1px solid #efefef",
            borderRadius: "20px", padding: "24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "2px" }}>Recent Campaigns</h3>
                <p style={{ fontSize: "12px", color: "#aaa" }}>Your latest ad campaigns</p>
              </div>
              <Link to="/campaigns" style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600", textDecoration: "none" }}>
                View all →
              </Link>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Campaign", "Status", "Screens", "Impressions", "End Date"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", fontSize: "11px",
                      fontWeight: "700", color: "#bbb",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      paddingBottom: "12px", borderBottom: "1px solid #f5f5f5",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c, i) => (
                  <tr key={i} style={{ transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 0 14px", fontSize: "14px", fontWeight: "600", color: "#111", borderBottom: "1px solid #f9f9f9" }}>{c.name}</td>
                    <td style={{ padding: "14px 8px", borderBottom: "1px solid #f9f9f9" }}>
                      <span style={{
                        background: statusColors[c.status].bg,
                        color: statusColors[c.status].color,
                        fontSize: "11px", fontWeight: "700",
                        padding: "3px 10px", borderRadius: "100px",
                      }}>{statusColors[c.status].label}</span>
                    </td>
                    <td style={{ padding: "14px 8px", fontSize: "13px", color: "#555", borderBottom: "1px solid #f9f9f9" }}>{c.screens}</td>
                    <td style={{ padding: "14px 8px", fontSize: "13px", fontWeight: "600", color: "#1F7A4D", borderBottom: "1px solid #f9f9f9" }}>{c.impressions}</td>
                    <td style={{ padding: "14px 8px", fontSize: "12px", color: "#aaa", borderBottom: "1px solid #f9f9f9" }}>{c.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Screen Status List */}
          <div style={{
            background: "white", border: "1px solid #efefef",
            borderRadius: "20px", padding: "24px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111", marginBottom: "2px" }}>Screen Status</h3>
                <p style={{ fontSize: "12px", color: "#aaa" }}>Live network overview</p>
              </div>
              <Link to="/screens" style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600", textDecoration: "none" }}>
                View map →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {screenData.map((screen, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", borderRadius: "14px",
                  background: "#fafafa", border: "1px solid #f3f3f3",
                  transition: "all 0.2s ease", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f0faf5"; e.currentTarget.style.borderColor = "rgba(31,122,77,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f3f3f3"; }}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "#EAF7EF", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "16px",
                    }}>📺</div>
                    <div style={{
                      position: "absolute", bottom: "-1px", right: "-1px",
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: screen.status === "online" ? "#22c55e" : "#d1d5db",
                      border: "2px solid white",
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{screen.name}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{screen.views} views this week</div>
                  </div>
                  <div style={{
                    fontSize: "11px", fontWeight: "700",
                    color: screen.status === "online" ? "#16a34a" : "#9ca3af",
                    background: screen.status === "online" ? "#dcfce7" : "#f3f4f6",
                    padding: "3px 8px", borderRadius: "100px", flexShrink: 0,
                  }}>
                    {screen.status === "online" ? "● Online" : "○ Offline"}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "10px", marginTop: "16px",
            }}>
              {[
                { label: "Online", value: "4 / 5", color: "#16a34a", bg: "#dcfce7" },
                { label: "Avg Views", value: "236", color: "#1F7A4D", bg: "#EAF7EF" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.bg, borderRadius: "12px",
                  padding: "12px", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: s.color, fontWeight: "600", opacity: 0.7 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="fade-up d5" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px", marginTop: "24px",
        }}>
          {[
            { icon: "📣", label: "New Campaign", sub: "Launch an ad", to: "/campaigns/new", color: "#1F7A4D" },
            { icon: "🖼️", label: "Upload Ad", sub: "Add creative", to: "/ads/upload", color: "#2563eb" },
            { icon: "📊", label: "View Analytics", sub: "See full report", to: "/analytics", color: "#7c3aed" },
            { icon: "💳", label: "Billing", sub: "Invoices & history", to: "/billing", color: "#d97706" },
          ].map((action, i) => (
            <Link key={i} to={action.to} style={{
              background: "white", border: "1px solid #efefef",
              borderRadius: "16px", padding: "20px",
              textDecoration: "none", display: "flex",
              alignItems: "center", gap: "14px",
              transition: "all 0.22s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                background: `${action.color}15`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "18px", flexShrink: 0,
              }}>{action.icon}</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>{action.label}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>{action.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}