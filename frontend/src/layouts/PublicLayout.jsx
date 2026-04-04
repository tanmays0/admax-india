import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicLayout({ children }) {
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .footer-link {
          color: #aaa; text-decoration: none; font-size: 14px;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: white; }

        .footer-social {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; text-decoration: none;
          transition: all 0.2s ease; cursor: pointer;
        }
        .footer-social:hover {
          background: rgba(31,122,77,0.3);
          border-color: rgba(31,122,77,0.5);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Navbar (already fixed + has spacer built in) */}
      <Navbar />

      {/* Page Content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#0a0a0a",
        color: "white",
        padding: "64px 24px 32px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Top section */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "56px",
          }}>

            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "36px", height: "36px", background: "#1F7A4D",
                  borderRadius: "10px", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "16px",
                }}>📺</div>
                <div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "17px", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>AdMax India</div>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "#888", lineHeight: "1.75", maxWidth: "260px", marginBottom: "20px" }}>
                India's hyperlocal TV advertising network — helping local businesses reach nearby customers through smart digital screens.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["𝕏", "in", "📘", "📸"].map((icon, i) => (
                  <a key={i} className="footer-social" href="#">{icon}</a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                COMPANY
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Home", path: "/" },
                  { label: "About Us", path: "/about" },
                  { label: "Services", path: "/services" },
                  { label: "Contact", path: "/contact" },
                ].map((link) => (
                  <Link key={link.path} to={link.path} className="footer-link">{link.label}</Link>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                PLATFORM
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Dashboard", path: "/dashboard" },
                  { label: "Campaigns", path: "/campaigns" },
                  { label: "Screen Network", path: "/screens" },
                  { label: "Analytics", path: "/analytics" },
                  { label: "Billing", path: "/billing" },
                ].map((link) => (
                  <Link key={link.path} to={link.path} className="footer-link">{link.label}</Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: "700", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
                LEGAL
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Privacy Policy", path: "/privacy" },
                  { label: "Terms of Service", path: "/terms" },
                  { label: "Refund Policy", path: "/refunds" },
                  { label: "Cookie Policy", path: "/cookies" },
                ].map((link) => (
                  <Link key={link.path} to={link.path} className="footer-link">{link.label}</Link>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, #1F7A4D, #155c39)",
            borderRadius: "20px",
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
            marginBottom: "48px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "50%", pointerEvents: "none",
            }} />
            <div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: "800", color: "white", letterSpacing: "-0.02em", marginBottom: "6px" }}>
                Ready to advertise locally?
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>
                Join AdMax India's hyperlocal TV network and start reaching real customers.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              <Link to="/register" style={{
                background: "white", color: "#1F7A4D",
                padding: "12px 24px", borderRadius: "10px",
                fontWeight: "700", fontSize: "14px", textDecoration: "none",
                transition: "transform 0.2s ease", display: "inline-block",
              }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
              >Get Started →</Link>
              <Link to="/contact" style={{
                background: "transparent", color: "white",
                border: "1.5px solid rgba(255,255,255,0.3)",
                padding: "11px 22px", borderRadius: "10px",
                fontWeight: "600", fontSize: "14px", textDecoration: "none",
                transition: "all 0.2s ease", display: "inline-block",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >Book Demo</Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize: "13px", color: "#555" }}>
              © 2026 AdMax India. All rights reserved. Made with 💚 in Pune.
            </p>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;