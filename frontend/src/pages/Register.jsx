import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const CATEGORIES = [
  "🍽️ Restaurant", "💪 Gym", "💆 Salon", "🏥 Hospital",
  "💊 Pharmacy", "☕ Cafe", "🦷 Dental", "🛍️ Retail Store",
  "🏫 Education", "🔧 Services", "🏨 Hotel", "Other",
];

const STEPS = ["Account", "Business", "Done"];

export default function Register() {
  const navigate = useNavigate();

  // Step control
  const [step, setStep] = useState(1);

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);

  // Password strength
  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  const handlePasswordChange = (val) => {
    setPassword(val);
    setStrength(calcStrength(val));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (strength < 2) { setError("Please choose a stronger password."); return; }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!businessName || !category || !city) { setError("Please complete all business fields."); return; }
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password, businessName, category, city, phone });
      setStep(3);
    } catch {
      setError("Registration failed. This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === name ? "#1F7A4D" : "#e5e7eb"}`,
    fontSize: "14px",
    color: "#111",
    outline: "none",
    background: focused === name ? "#f9fffe" : "white",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: focused === name ? "0 0 0 4px rgba(31,122,77,0.08)" : "none",
  });

  const labelStyle = {
    fontSize: "13px", fontWeight: "600", color: "#333",
    marginBottom: "6px", display: "block", letterSpacing: "-0.01em",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
      background: "#f8fafb",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .reg-heading { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.2);  opacity: 0; }
        }

        .form-card { animation: fadeUp 0.55s ease both; }
        .success-card { animation: scaleIn 0.4s ease both; }
        .error-shake { animation: shake 0.4s ease; }
        .float-1 { animation: float 4s ease-in-out infinite; }
        .float-2 { animation: float 4s ease-in-out infinite 1.1s; }
        .float-3 { animation: float 4s ease-in-out infinite 2.2s; }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .submit-btn {
          width: 100%; background: #1F7A4D; color: white;
          border: none; padding: 15px; border-radius: 12px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: -0.01em;
          transition: all 0.25s ease; display: flex;
          align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(31,122,77,0.32);
        }
        .submit-btn:disabled { opacity: 0.72; cursor: not-allowed; }

        .back-btn {
          background: white; color: #555; border: 1.5px solid #e5e7eb;
          padding: 14px; border-radius: 12px; font-size: 14px;
          font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s ease; flex: 1;
        }
        .back-btn:hover { border-color: #ccc; background: #fafafa; }

        .cat-pill {
          padding: 9px 14px; border-radius: 100px; font-size: 13px;
          font-weight: 500; cursor: pointer; border: 1.5px solid #e5e7eb;
          background: white; color: #444; transition: all 0.18s ease;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
        }
        .cat-pill:hover { border-color: #1F7A4D; color: #1F7A4D; }
        .cat-pill.selected {
          background: #EAF7EF; border-color: #1F7A4D;
          color: #1F7A4D; font-weight: 600;
        }

        .eye-btn {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%); background: none;
          border: none; cursor: pointer; font-size: 16px;
          color: #aaa; padding: 4px; transition: color 0.2s;
        }
        .eye-btn:hover { color: #1F7A4D; }

        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>

      {/* ── LEFT DECORATIVE PANEL ── */}
      <div className="hide-mobile" style={{
        flex: "1",
        background: "linear-gradient(145deg, #1F7A4D 0%, #155c39 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 48px", position: "relative",
        overflow: "hidden", minHeight: "100vh",
      }}>
        {[320, 500, 680].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${size}px`, height: `${size}px`,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "50%", pointerEvents: "none",
          }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "52px", position: "relative" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 16px",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>📺</div>
          <div className="reg-heading" style={{
            fontSize: "24px", fontWeight: "800", color: "white", letterSpacing: "-0.02em",
          }}>AdMax India</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            Hyperlocal TV Advertising
          </div>
        </div>

        {/* Floating screens */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", marginBottom: "52px" }}>
          {[
            { icon: "☕", name: "Bean & Brew", sub: "Morning deal", color: "#7f5a2a", cls: "float-1" },
            { icon: "🏥", name: "CityClinic", sub: "Free checkup", color: "#1F7A4D", cls: "float-2", big: true },
            { icon: "🛍️", name: "StyleStreet", sub: "New arrivals", color: "#8e44ad", cls: "float-3" },
          ].map((ad, i) => (
            <div key={i} className={ad.cls} style={{
              background: "#111", borderRadius: ad.big ? "14px" : "12px",
              padding: "6px", boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
              width: ad.big ? "130px" : "110px",
              marginBottom: ad.big ? "20px" : "0",
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${ad.color}, ${ad.color}cc)`,
                borderRadius: ad.big ? "10px" : "8px",
                height: ad.big ? "90px" : "75px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", padding: "10px",
              }}>
                <span style={{ fontSize: ad.big ? "22px" : "18px" }}>{ad.icon}</span>
                <span style={{ color: "white", fontSize: "9px", fontWeight: "700", marginTop: "4px", textAlign: "center" }}>{ad.name}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "8px", marginTop: "2px", textAlign: "center" }}>{ad.sub}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
                <div style={{ width: "30px", height: "3px", background: "#222", borderRadius: "2px" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Why join bullets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%", maxWidth: "280px" }}>
          {[
            ["⚡", "Go live in under 24 hours"],
            ["📍", "Ads shown within your local area"],
            ["📊", "Real-time analytics dashboard"],
            ["💳", "No contracts, cancel anytime"],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "15px", flexShrink: 0,
              }}>{icon}</div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: "400" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: "500px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "white",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.04)",
        overflowY: "auto",
      }}>
        <div className="form-card" style={{ width: "100%", maxWidth: "400px" }}>

          {/* Step indicator */}
          {step < 3 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "36px" }}>
              {STEPS.map((label, i) => {
                const idx = i + 1;
                const done = step > idx;
                const active = step === idx;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: done ? "#1F7A4D" : active ? "#EAF7EF" : "#f3f4f6",
                        border: `2px solid ${done || active ? "#1F7A4D" : "#e5e7eb"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: "700",
                        color: done ? "white" : active ? "#1F7A4D" : "#aaa",
                        transition: "all 0.3s ease",
                      }}>
                        {done ? "✓" : idx}
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: active ? "700" : "500",
                        color: active ? "#1F7A4D" : done ? "#555" : "#aaa",
                        whiteSpace: "nowrap",
                      }}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{
                        flex: 1, height: "2px", margin: "0 8px",
                        marginBottom: "18px",
                        background: done ? "#1F7A4D" : "#e5e7eb",
                        transition: "background 0.3s ease",
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <div style={{
                  width: "44px", height: "44px", background: "#EAF7EF",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", marginBottom: "16px",
                }}>🚀</div>
                <h1 className="reg-heading" style={{
                  fontSize: "26px", fontWeight: "800",
                  letterSpacing: "-0.025em", color: "#0a0a0a",
                  marginBottom: "6px",
                }}>Create your account</h1>
                <p style={{ fontSize: "13px", color: "#888" }}>
                  Start advertising locally in minutes.
                </p>
              </div>

              {error && (
                <div className="error-shake" style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: "12px", padding: "12px 16px",
                  marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center",
                }}>
                  <span>⚠️</span>
                  <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleNext}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Full Name</label>
                  <input placeholder="Rajan Mehta" value={name}
                    onChange={e => setName(e.target.value)} required
                    style={inputStyle("name")}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    style={inputStyle("email")}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={e => handlePasswordChange(e.target.value)}
                      required
                      style={{ ...inputStyle("password"), paddingRight: "44px" }}
                      onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: "3px", borderRadius: "2px",
                          background: i <= strength ? strengthColor[strength] : "#e5e7eb",
                          transition: "background 0.3s ease",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", color: strengthColor[strength], fontWeight: "600" }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}

                <button type="submit" className="submit-btn" style={{ marginTop: password.length > 0 ? "0" : "20px" }}>
                  Continue →
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginTop: "24px" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1F7A4D", fontWeight: "700", textDecoration: "none" }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >Sign in →</Link>
              </p>
            </>
          )}

          {/* ── STEP 2: Business ── */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <div style={{
                  width: "44px", height: "44px", background: "#EAF7EF",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "20px", marginBottom: "16px",
                }}>🏢</div>
                <h1 className="reg-heading" style={{
                  fontSize: "26px", fontWeight: "800",
                  letterSpacing: "-0.025em", color: "#0a0a0a", marginBottom: "6px",
                }}>Your business</h1>
                <p style={{ fontSize: "13px", color: "#888" }}>
                  Help us tailor AdMax to your business type.
                </p>
              </div>

              {error && (
                <div className="error-shake" style={{
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: "12px", padding: "12px 16px",
                  marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center",
                }}>
                  <span>⚠️</span>
                  <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={labelStyle}>Business Name</label>
                  <input placeholder="e.g. Pizza Palace" value={businessName}
                    onChange={e => setBusinessName(e.target.value)} required
                    style={inputStyle("businessName")}
                    onFocus={() => setFocused("businessName")} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Business Category</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {CATEGORIES.map((cat) => (
                      <button key={cat} type="button"
                        className={`cat-pill ${category === cat ? "selected" : ""}`}
                        onClick={() => setCategory(cat)}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input placeholder="Pune" value={city}
                      onChange={e => setCity(e.target.value)} required
                      style={inputStyle("city")}
                      onFocus={() => setFocused("city")} onBlur={() => setFocused(null)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input placeholder="+91 98765 43210" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={inputStyle("phone")}
                      onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" className="back-btn" onClick={() => { setStep(1); setError(""); }}>
                    ← Back
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading} style={{ flex: 2 }}>
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                          <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                          <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Creating account...
                      </>
                    ) : "Create Account →"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="success-card" style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: "80px", height: "80px",
                background: "#EAF7EF",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "36px", margin: "0 auto 24px",
                boxShadow: "0 0 0 12px rgba(31,122,77,0.06)",
              }}>🎉</div>

              <h2 className="reg-heading" style={{
                fontSize: "26px", fontWeight: "800",
                letterSpacing: "-0.025em", color: "#0a0a0a", marginBottom: "10px",
              }}>You're in, {name.split(" ")[0]}!</h2>

              <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", marginBottom: "32px", maxWidth: "300px", margin: "0 auto 32px" }}>
                Your AdMax account is ready. Head to your dashboard to upload your first ad and go live.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button className="submit-btn" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard →
                </button>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "white", color: "#555",
                    border: "1.5px solid #e5e7eb", padding: "13px",
                    borderRadius: "12px", fontSize: "14px",
                    fontWeight: "600", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.target.style.borderColor = "#ccc"}
                  onMouseLeave={e => e.target.style.borderColor = "#e5e7eb"}
                >
                  Sign in instead
                </button>
              </div>
            </div>
          )}

          {step < 3 && (
            <p style={{ fontSize: "11px", color: "#ccc", textAlign: "center", marginTop: "28px" }}>
              By registering you agree to AdMax India's{" "}
              <a href="/terms" style={{ color: "#aaa", textDecoration: "underline" }}>Terms</a>
              {" & "}
              <a href="/privacy" style={{ color: "#aaa", textDecoration: "underline" }}>Privacy Policy</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}