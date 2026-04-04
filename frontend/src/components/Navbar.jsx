import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = [
  "🍽️ Restaurant", "💪 Gym", "💆 Salon", "🏥 Hospital",
  "💊 Pharmacy", "☕ Cafe", "🦷 Dental", "🛍️ Retail",
];

const RADIUS_OPTIONS = [
  { value: 1, label: "1 km", sub: "Immediate area", icon: "🎯" },
  { value: 3, label: "3 km", sub: "Neighbourhood", icon: "📍" },
  { value: 5, label: "5 km", sub: "Wider locality", icon: "🗺️" },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "6am – 12pm", icon: "🌅" },
  { id: "lunch", label: "Lunch", time: "12pm – 3pm", icon: "🍽️" },
  { id: "evening", label: "Evening", time: "3pm – 7pm", icon: "🌆" },
  { id: "night", label: "Night", time: "7pm – 11pm", icon: "🌙" },
];

const STEPS = ["Details", "Targeting", "Schedule", "Review"];

// ── Sidebar (same as Dashboard) ─────────────────────────────────
const navItems = [
  { icon: "⚡", label: "Dashboard", path: "/dashboard" },
  { icon: "📣", label: "Campaigns", path: "/campaigns", active: true },
  { icon: "🖼️", label: "My Ads", path: "/ads" },
  { icon: "📺", label: "Screens", path: "/screens" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
  { icon: "💳", label: "Billing", path: "/billing" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };
  return (
    <div style={{
      width: "240px", minHeight: "100vh", background: "white",
      borderRight: "1px solid #f0f0f0", display: "flex",
      flexDirection: "column", padding: "24px 16px", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", marginBottom: "32px" }}>
        <div style={{ width: "36px", height: "36px", background: "#1F7A4D", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📺</div>
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>AdMax</div>
          <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "500" }}>India</div>
        </div>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#ccc", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 12px", marginBottom: "8px" }}>MAIN MENU</p>
        {navItems.map((item) => (
          <Link key={item.label} to={item.path} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "12px", textDecoration: "none",
            background: item.active ? "#EAF7EF" : "transparent",
            color: item.active ? "#1F7A4D" : "#555",
            fontWeight: item.active ? "700" : "500", fontSize: "14px",
            transition: "all 0.18s ease",
          }}
            onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = "#f9fafb"; }}
            onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: "16px", width: "20px", textAlign: "center" }}>{item.icon}</span>
            {item.label}
            {item.active && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#1F7A4D" }} />}
          </Link>
        ))}
      </nav>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "4px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#EAF7EF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>👤</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#111" }}>My Business</div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>Advertiser</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", background: "none", border: "none",
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "12px", color: "#888",
          fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          fontWeight: "500", transition: "all 0.18s ease",
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

// ── Main Component ───────────────────────────────────────────────
export default function CreateCampaign() {
  const navigate = useNavigate();

  // Step
  const [step, setStep] = useState(1);

  // Step 1 — Details
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  // Step 2 — Targeting
  const [radius, setRadius] = useState(null);

  // Step 3 — Schedule
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slots, setSlots] = useState([]);

  // UI
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleSlot = (id) =>
    setSlots((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const inputStyle = (fname) => ({
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    border: `1.5px solid ${focused === fname ? "#1F7A4D" : "#e5e7eb"}`,
    fontSize: "14px", color: "#111", outline: "none",
    background: focused === fname ? "#f9fffe" : "white",
    transition: "all 0.2s ease", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: focused === fname ? "0 0 0 4px rgba(31,122,77,0.08)" : "none",
  });

  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "#333",
    marginBottom: "6px", display: "block", letterSpacing: "-0.01em",
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!name || !city) { setError("Please fill in all required fields."); return; }
    }
    if (step === 2) {
      if (!radius) { setError("Please select a targeting radius."); return; }
    }
    if (step === 3) {
      if (!startDate || !endDate) { setError("Please set start and end dates."); return; }
      if (new Date(endDate) <= new Date(startDate)) { setError("End date must be after start date."); return; }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/campaigns/create", {
        name, category, city, radius,
        start_date: startDate, end_date: endDate,
        time_slots: slots,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Campaign creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafb", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .cc-card { animation: fadeUp 0.5s ease both; }
        .success-anim { animation: scaleIn 0.4s ease both; }
        .error-shake { animation: shake 0.4s ease; }

        .radius-pill {
          border: 1.5px solid #e5e7eb; border-radius: 16px;
          padding: 16px 20px; cursor: pointer; background: white;
          transition: all 0.2s ease; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .radius-pill:hover { border-color: #1F7A4D; background: #f9fffe; }
        .radius-pill.selected { border-color: #1F7A4D; background: #EAF7EF; }

        .slot-pill {
          border: 1.5px solid #e5e7eb; border-radius: 14px;
          padding: 14px 16px; cursor: pointer; background: white;
          transition: all 0.2s ease; display: flex; flex-direction: column; gap: 4px;
        }
        .slot-pill:hover { border-color: #1F7A4D; background: #f9fffe; }
        .slot-pill.selected { border-color: #1F7A4D; background: #EAF7EF; }

        .cat-pill {
          padding: 9px 14px; border-radius: 100px; font-size: 13px;
          font-weight: 500; cursor: pointer; border: 1.5px solid #e5e7eb;
          background: white; color: #444; transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .cat-pill:hover { border-color: #1F7A4D; color: #1F7A4D; }
        .cat-pill.selected { background: #EAF7EF; border-color: #1F7A4D; color: #1F7A4D; font-weight: 600; }

        .submit-btn {
          background: #1F7A4D; color: white; border: none;
          padding: 15px 32px; border-radius: 12px; font-size: 15px;
          font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.25s ease; display: inline-flex; align-items: center; gap: 8px;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px); box-shadow: 0 12px 28px rgba(31,122,77,0.3);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .back-btn {
          background: white; color: #555; border: 1.5px solid #e5e7eb;
          padding: 14px 24px; border-radius: 12px; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease;
        }
        .back-btn:hover { border-color: #ccc; background: #fafafa; }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1, padding: "36px 48px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <Link to="/campaigns" style={{ color: "#aaa", textDecoration: "none", fontSize: "14px", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}
            onMouseEnter={e => e.currentTarget.style.color = "#555"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >← Campaigns</Link>
          <span style={{ color: "#e5e7eb" }}>/</span>
          <span style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}>New Campaign</span>
        </div>

        <div style={{ maxWidth: "680px" }}>

          {/* Page title */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: "6px" }}>
              Create Campaign
            </h1>
            <p style={{ fontSize: "14px", color: "#888" }}>Launch a new local ad campaign in minutes.</p>
          </div>

          {/* Step indicator */}
          {!success && (
            <div style={{ display: "flex", alignItems: "center", marginBottom: "36px" }}>
              {STEPS.map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: done ? "#1F7A4D" : active ? "#EAF7EF" : "#f3f4f6",
                        border: `2px solid ${done || active ? "#1F7A4D" : "#e5e7eb"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: "700",
                        color: done ? "white" : active ? "#1F7A4D" : "#aaa",
                        transition: "all 0.3s ease",
                      }}>{done ? "✓" : idx}</div>
                      <span style={{ fontSize: "11px", fontWeight: active ? "700" : "500", color: active ? "#1F7A4D" : done ? "#555" : "#aaa", whiteSpace: "nowrap" }}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: "2px", margin: "0 8px", marginBottom: "18px", background: done ? "#1F7A4D" : "#e5e7eb", transition: "background 0.3s ease" }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && !success && (
            <div className="error-shake" style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "12px", padding: "12px 16px",
              marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center",
            }}>
              <span>⚠️</span>
              <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>{error}</span>
            </div>
          )}

          {/* ── STEP 1: Campaign Details ── */}
          {step === 1 && !success && (
            <div className="cc-card" style={{ background: "white", border: "1px solid #efefef", borderRadius: "24px", padding: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", background: "#EAF7EF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📣</div>
                <div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>Campaign Details</h2>
                  <p style={{ fontSize: "12px", color: "#aaa" }}>Name your campaign and define its scope.</p>
                </div>
              </div>

              <form onSubmit={handleNext}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Campaign Name *</label>
                  <input placeholder='e.g. "Summer Lunch Offer"' value={name}
                    onChange={e => setName(e.target.value)} required
                    style={inputStyle("name")}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>City *</label>
                  <input placeholder="Pune" value={city}
                    onChange={e => setCity(e.target.value)} required
                    style={inputStyle("city")}
                    onFocus={() => setFocused("city")} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: "28px" }}>
                  <label style={labelStyle}>Business Category</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                    {CATEGORIES.map((cat) => (
                      <button key={cat} type="button"
                        className={`cat-pill ${category === cat ? "selected" : ""}`}
                        onClick={() => setCategory(cat)}>{cat}</button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="submit-btn">Continue →</button>
              </form>
            </div>
          )}

          {/* ── STEP 2: Targeting ── */}
          {step === 2 && !success && (
            <div className="cc-card" style={{ background: "white", border: "1px solid #efefef", borderRadius: "24px", padding: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", background: "#EAF7EF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎯</div>
                <div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>Hyperlocal Targeting</h2>
                  <p style={{ fontSize: "12px", color: "#aaa" }}>Choose how far your ads should reach.</p>
                </div>
              </div>

              <label style={{ ...labelStyle, marginBottom: "12px" }}>Select Radius *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
                {RADIUS_OPTIONS.map((opt) => (
                  <div key={opt.value}
                    className={`radius-pill ${radius === opt.value ? "selected" : ""}`}
                    onClick={() => setRadius(opt.value)}
                  >
                    <span style={{ fontSize: "24px" }}>{opt.icon}</span>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: radius === opt.value ? "#1F7A4D" : "#0a0a0a", letterSpacing: "-0.02em" }}>{opt.label}</span>
                    <span style={{ fontSize: "12px", color: "#888" }}>{opt.sub}</span>
                    {radius === opt.value && (
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#1F7A4D", background: "rgba(31,122,77,0.1)", padding: "2px 8px", borderRadius: "100px" }}>Selected ✓</span>
                    )}
                  </div>
                ))}
              </div>

              {radius && (
                <div style={{ background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.2)", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <span>📍</span>
                  <span style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "500" }}>
                    Your ads will appear on screens within <strong>{radius}km</strong> of your business in {city || "your city"}.
                  </span>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="back-btn" onClick={() => { setStep(1); setError(""); }}>← Back</button>
                <button className="submit-btn" onClick={handleNext}>Continue →</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Schedule ── */}
          {step === 3 && !success && (
            <div className="cc-card" style={{ background: "white", border: "1px solid #efefef", borderRadius: "24px", padding: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", background: "#EAF7EF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📅</div>
                <div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>Campaign Schedule</h2>
                  <p style={{ fontSize: "12px", color: "#aaa" }}>Set your campaign duration and time slots.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={labelStyle}>Start Date *</label>
                  <input type="date" value={startDate}
                    onChange={e => setStartDate(e.target.value)} required
                    min={new Date().toISOString().split("T")[0]}
                    style={inputStyle("startDate")}
                    onFocus={() => setFocused("startDate")} onBlur={() => setFocused(null)} />
                </div>
                <div>
                  <label style={labelStyle}>End Date *</label>
                  <input type="date" value={endDate}
                    onChange={e => setEndDate(e.target.value)} required
                    min={startDate || new Date().toISOString().split("T")[0]}
                    style={inputStyle("endDate")}
                    onFocus={() => setFocused("endDate")} onBlur={() => setFocused(null)} />
                </div>
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ ...labelStyle, marginBottom: "12px" }}>Time Slots (optional)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot.id}
                      className={`slot-pill ${slots.includes(slot.id) ? "selected" : ""}`}
                      onClick={() => toggleSlot(slot.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{slot.icon}</span>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: slots.includes(slot.id) ? "#1F7A4D" : "#111" }}>{slot.label}</span>
                        {slots.includes(slot.id) && <span style={{ marginLeft: "auto", color: "#1F7A4D", fontSize: "14px" }}>✓</span>}
                      </div>
                      <span style={{ fontSize: "12px", color: "#888", paddingLeft: "26px" }}>{slot.time}</span>
                    </div>
                  ))}
                </div>
                {slots.length === 0 && (
                  <p style={{ fontSize: "12px", color: "#aaa", marginTop: "8px" }}>No slots selected — ads will run all day.</p>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="back-btn" onClick={() => { setStep(2); setError(""); }}>← Back</button>
                <button className="submit-btn" onClick={handleNext}>Review →</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && !success && (
            <div className="cc-card" style={{ background: "white", border: "1px solid #efefef", borderRadius: "24px", padding: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", background: "#EAF7EF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✅</div>
                <div>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em" }}>Review & Launch</h2>
                  <p style={{ fontSize: "12px", color: "#aaa" }}>Confirm your campaign details before going live.</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {[
                  { label: "Campaign Name", value: name, icon: "📣" },
                  { label: "City", value: city, icon: "🏙️" },
                  { label: "Category", value: category || "Not specified", icon: "🏷️" },
                  { label: "Radius", value: `${radius} km`, icon: "📍" },
                  { label: "Start Date", value: startDate, icon: "📅" },
                  { label: "End Date", value: endDate, icon: "🏁" },
                  { label: "Time Slots", value: slots.length > 0 ? slots.map(s => TIME_SLOTS.find(t => t.id === s)?.label).join(", ") : "All day", icon: "⏰" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 16px", borderRadius: "12px", background: "#fafafa",
                    border: "1px solid #f3f3f3",
                  }}>
                    <span style={{ fontSize: "13px", color: "#888", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{row.icon}</span>{row.label}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.2)", borderRadius: "12px", padding: "14px 16px", marginBottom: "24px", display: "flex", gap: "10px" }}>
                <span>ℹ️</span>
                <span style={{ fontSize: "13px", color: "#1F7A4D", lineHeight: "1.55" }}>
                  Your campaign will be reviewed by our team and go live within 24 hours of approval.
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="back-btn" onClick={() => { setStep(3); setError(""); }}>← Back</button>
                <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{ flex: 1, justifyContent: "center" }}>
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Launching...
                    </>
                  ) : "🚀 Launch Campaign"}
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {success && (
            <div className="success-anim" style={{
              background: "white", border: "1px solid #efefef",
              borderRadius: "24px", padding: "56px 36px", textAlign: "center",
            }}>
              <div style={{
                width: "80px", height: "80px", background: "#EAF7EF",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "36px",
                margin: "0 auto 24px",
                boxShadow: "0 0 0 14px rgba(31,122,77,0.06)",
              }}>🎉</div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.02em", marginBottom: "10px" }}>
                Campaign launched!
              </h2>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto 32px" }}>
                <strong>{name}</strong> has been submitted for review. You'll receive a confirmation once it goes live — usually within 24 hours.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <Link to="/campaigns" style={{
                  background: "#1F7A4D", color: "white", padding: "13px 28px",
                  borderRadius: "12px", fontWeight: "700", fontSize: "14px",
                  textDecoration: "none", transition: "all 0.2s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >View Campaigns →</Link>
                <button onClick={() => { setSuccess(false); setStep(1); setName(""); setCity(""); setCategory(""); setRadius(null); setStartDate(""); setEndDate(""); setSlots([]); }}
                  style={{
                    background: "white", color: "#555", border: "1.5px solid #e5e7eb",
                    padding: "12px 24px", borderRadius: "12px",
                    fontWeight: "600", fontSize: "14px", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#ccc"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                >Create another</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}