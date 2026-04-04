import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${focused === name ? "#1F7A4D" : error ? "#fee2e2" : "#e5e7eb"}`,
    fontSize: "14px",
    color: "#111",
    outline: "none",
    background: focused === name ? "#f9fffe" : "white",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: focused === name ? "0 0 0 4px rgba(31,122,77,0.08)" : "none",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'DM Sans', sans-serif",
      background: "#f8fafb",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .login-heading { font-family: 'Sora', sans-serif; }

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
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.2);  opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }

        .form-card { animation: fadeUp 0.6s ease both; }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .float-1 { animation: float 4s ease-in-out infinite; }
        .float-2 { animation: float 4s ease-in-out infinite 1s; }
        .float-3 { animation: float 4s ease-in-out infinite 2s; }

        .submit-btn {
          width: 100%;
          background: #1F7A4D;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(31,122,77,0.32);
        }
        .submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .error-shake { animation: shake 0.4s ease; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #aaa;
          padding: 4px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #1F7A4D; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #f0f0f0;
        }

        .social-btn {
          width: 100%;
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .social-btn:hover {
          border-color: #d0d0d0;
          background: #fafafa;
          transform: translateY(-1px);
        }
      `}</style>

      {/* ── LEFT PANEL (decorative) ── */}
      <div style={{
        flex: "1",
        background: "linear-gradient(145deg, #1F7A4D 0%, #155c39 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 48px",
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
        className="hide-mobile"
      >
        {/* Decorative rings */}
        {[300, 480, 660].map((size, i) => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${size}px`, height: `${size}px`,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "50%",
            pointerEvents: "none",
          }} />
        ))}

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "64px", position: "relative" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 16px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>📺</div>
          <div className="login-heading" style={{
            fontSize: "24px", fontWeight: "800",
            color: "white", letterSpacing: "-0.02em",
          }}>AdMax India</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginTop: "4px" }}>
            Hyperlocal TV Advertising
          </div>
        </div>

        {/* Floating TV mock screens */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", marginBottom: "56px" }}>
          {[
            { icon: "🍕", name: "Pizza Palace", sub: "50% off today!", color: "#c0392b", cls: "float-1" },
            { icon: "💪", name: "IronFit Gym", sub: "Join this month", color: "#1F7A4D", cls: "float-2", big: true },
            { icon: "💆", name: "Glow Salon", sub: "Hair deals", color: "#8e44ad", cls: "float-3" },
          ].map((ad, i) => (
            <div key={i} className={ad.cls} style={{
              background: "#111",
              borderRadius: ad.big ? "14px" : "12px",
              padding: "6px",
              boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
              width: ad.big ? "130px" : "110px",
              marginBottom: ad.big ? "20px" : "0",
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${ad.color}, ${ad.color}cc)`,
                borderRadius: ad.big ? "10px" : "8px",
                height: ad.big ? "90px" : "75px",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px",
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

        {/* Stats */}
        <div style={{ display: "flex", gap: "32px" }}>
          {[["142+", "Live Screens"], ["300+", "Businesses"], ["1M+", "Monthly Views"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div className="login-heading" style={{
                fontSize: "22px", fontWeight: "800",
                color: "white", letterSpacing: "-0.02em",
              }}>{val}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div style={{
          marginTop: "40px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "100px",
          padding: "8px 18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ position: "relative", width: "8px", height: "8px" }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "#4ade80", borderRadius: "50%",
              animation: "pulse-ring 1.5s ease-out infinite",
            }} />
            <div style={{ width: "8px", height: "8px", background: "#4ade80", borderRadius: "50%", position: "relative" }} />
          </div>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>
            Network is live right now
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div style={{
        width: "480px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        background: "white",
        boxShadow: "-4px 0 40px rgba(0,0,0,0.04)",
      }}>
        <div className="form-card" style={{ width: "100%", maxWidth: "380px" }}>

          {/* Header */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{
              width: "44px", height: "44px",
              background: "#EAF7EF",
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", marginBottom: "20px",
            }}>👋</div>

            <h1 className="login-heading" style={{
              fontSize: "28px", fontWeight: "800",
              letterSpacing: "-0.025em", color: "#0a0a0a",
              marginBottom: "6px", lineHeight: "1.15",
            }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "#777", lineHeight: "1.5" }}>
              Sign in to your AdMax dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-shake" style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                fontSize: "13px", fontWeight: "600",
                color: "#333", marginBottom: "6px",
                display: "block", letterSpacing: "-0.01em",
              }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{
                fontSize: "13px", fontWeight: "600",
                color: "#333", marginBottom: "6px",
                display: "block", letterSpacing: "-0.01em",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <a href="/forgot-password" style={{
                fontSize: "13px", color: "#1F7A4D",
                fontWeight: "600", textDecoration: "none",
              }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    style={{ animation: "spin 0.8s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          <div className="divider">
            <span style={{ fontSize: "12px", color: "#bbb" }}>or</span>
          </div>

          <button className="social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#888",
            marginTop: "28px",
          }}>
            Don't have an account?{" "}
            <Link to="/register" style={{
              color: "#1F7A4D", fontWeight: "700",
              textDecoration: "none",
            }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}
            >
              Create one free →
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p style={{
          fontSize: "11px", color: "#ccc",
          marginTop: "40px", textAlign: "center", lineHeight: "1.5",
        }}>
          By signing in you agree to AdMax India's{" "}
          <a href="/terms" style={{ color: "#aaa", textDecoration: "underline" }}>Terms</a>
          {" & "}
          <a href="/privacy" style={{ color: "#aaa", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}