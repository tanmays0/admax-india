import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PublicLayout from "../layouts/PublicLayout";

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// Animated TV Screen Component
function TVScreen({ ads, delay = 0 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % ads.length);
      }, 2500);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [ads.length, delay]);

  return (
    <div style={{
      background: "#111",
      borderRadius: "16px",
      padding: "8px",
      boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      width: "220px",
    }}>
      <div style={{
        background: "#000",
        borderRadius: "10px",
        overflow: "hidden",
        height: "130px",
        position: "relative",
      }}>
        {ads.map((ad, i) => (
          <div key={i} style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: ad.bg,
            opacity: current === i ? 1 : 0,
            transition: "opacity 0.7s ease",
            padding: "16px",
          }}>
            <span style={{ fontSize: "28px", marginBottom: "6px" }}>{ad.icon}</span>
            <span style={{ color: "#fff", fontWeight: "700", fontSize: "13px", textAlign: "center" }}>{ad.title}</span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "10px", marginTop: "4px", textAlign: "center" }}>{ad.sub}</span>
          </div>
        ))}
        {/* scan line effect */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
          zIndex: 10,
        }} />
      </div>
      {/* TV stand */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
        <div style={{ width: "60px", height: "4px", background: "#222", borderRadius: "2px" }} />
      </div>
    </div>
  );
}

const tvAds = [
  [
    { icon: "🍕", title: "Pizza Palace", sub: "50% off today!", bg: "linear-gradient(135deg, #c0392b, #e74c3c)" },
    { icon: "💆", title: "Glow Salon", sub: "Hair care deals", bg: "linear-gradient(135deg, #8e44ad, #9b59b6)" },
    { icon: "🏥", title: "CityClinic", sub: "Free checkup", bg: "linear-gradient(135deg, #1F7A4D, #2FA36B)" },
  ],
  [
    { icon: "☕", title: "Bean & Brew", sub: "Morning specials", bg: "linear-gradient(135deg, #7f5a2a, #c8913a)" },
    { icon: "💊", title: "MedPlus", sub: "10% on generics", bg: "linear-gradient(135deg, #2980b9, #3498db)" },
    { icon: "🏋️", title: "IronFit Gym", sub: "Join this month", bg: "linear-gradient(135deg, #1F7A4D, #27ae60)" },
  ],
  [
    { icon: "🦷", title: "SmileDent", sub: "Free consultation", bg: "linear-gradient(135deg, #16a085, #1abc9c)" },
    { icon: "🍜", title: "Spice Route", sub: "Lunch buffet ₹199", bg: "linear-gradient(135deg, #d35400, #e67e22)" },
    { icon: "🛍️", title: "StyleStreet", sub: "New arrivals", bg: "linear-gradient(135deg, #8e44ad, #6c3483)" },
  ],
];

const steps = [
  { num: "01", title: "Register Your Business", desc: "Create your AdMax account and set up your business profile in minutes.", icon: "🏢" },
  { num: "02", title: "Upload Your Ad", desc: "Upload images or short videos. Our system handles format optimization automatically.", icon: "📤" },
  { num: "03", title: "Set Your Radius", desc: "Choose your targeting radius — 1km, 3km, or 5km — and pick your time slots.", icon: "📍" },
  { num: "04", title: "Go Live Instantly", desc: "Your ads appear on nearby business screens reaching real local customers.", icon: "📺" },
];

const services = [
  {
    icon: "📺",
    title: "Digital Screen Network",
    desc: "Your brand displayed on high-visibility TV screens inside busy local establishments.",
    tag: "Core",
  },
  {
    icon: "🎯",
    title: "Hyperlocal Targeting",
    desc: "Radius-based ad distribution ensures your message reaches the right neighborhood.",
    tag: "Smart",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    desc: "Track impressions, views, and performance with a live analytics dashboard.",
    tag: "Insights",
  },
  {
    icon: "⏰",
    title: "Smart Scheduling",
    desc: "Schedule ads by time slots — breakfast offers at 9am, dinner deals at 7pm.",
    tag: "Automated",
  },
  {
    icon: "🤖",
    title: "AI Suggestions",
    desc: "Our AI recommends the best screens, times, and locations for your campaign.",
    tag: "AI-Powered",
  },
  {
    icon: "💳",
    title: "Simple Billing",
    desc: "Transparent pay-per-campaign pricing with Razorpay. No hidden charges.",
    tag: "Transparent",
  },
];

const categories = ["🍽️ Restaurant", "💪 Gym", "💆 Salon", "🏥 Hospital", "💊 Pharmacy", "☕ Cafe", "🦷 Dental", "🛍️ Retail"];

export default function Home() {
  const [statsRef, statsInView] = useInView();
  const c1 = useCounter(150, 1800, statsInView);
  const c2 = useCounter(300, 2000, statsInView);
  const c3 = useCounter(1000000, 2200, statsInView);

  return (
    <PublicLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

        * { font-family: 'DM Sans', sans-serif; }

        .hero-heading { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }

        .float-1 { animation: float 4s ease-in-out infinite; }
        .float-2 { animation: float 4s ease-in-out infinite 0.8s; }
        .float-3 { animation: float 4s ease-in-out infinite 1.6s; }

        .btn-primary {
          background: #1F7A4D;
          color: white;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(31,122,77,0.35); }
        .btn-primary:hover::before { opacity: 1; }

        .btn-secondary {
          background: white;
          color: #1F7A4D;
          border: 1.5px solid #1F7A4D;
          padding: 13px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s ease;
          letter-spacing: -0.01em;
        }
        .btn-secondary:hover { background: #EAF7EF; transform: translateY(-2px); }

        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.1);
        }

        .step-card:hover .step-icon {
          transform: scale(1.1) rotate(5deg);
          transition: transform 0.3s ease;
        }

        .category-pill {
          transition: all 0.2s ease;
          cursor: default;
        }
        .category-pill:hover {
          background: #1F7A4D;
          color: white;
          transform: scale(1.05);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .noise-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg, #f0faf5 0%, #ffffff 50%, #f7fffe 100%)",
        padding: "100px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute",
          top: "-120px",
          right: "-80px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(47,163,107,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(31,122,77,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          {/* Left */}
          <div style={{ flex: "1", minWidth: "340px" }}>
            <div className="fade-up delay-1" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#EAF7EF",
              border: "1px solid rgba(31,122,77,0.2)",
              borderRadius: "100px",
              padding: "6px 14px 6px 8px",
              marginBottom: "28px",
            }}>
              <span style={{
                background: "#1F7A4D",
                color: "white",
                fontSize: "10px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "100px",
                letterSpacing: "0.05em",
              }}>NEW</span>
              <span style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "500" }}>
                AI-powered ad targeting is here
              </span>
            </div>

            <h1 className="hero-heading fade-up delay-2" style={{
              fontSize: "clamp(38px, 5vw, 58px)",
              fontWeight: "800",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              color: "#0a0a0a",
              marginBottom: "20px",
            }}>
              Advertise Where<br />
              <span className="shimmer-text">Customers Already</span><br />
              Walk In
            </h1>

            <p className="fade-up delay-3" style={{
              fontSize: "17px",
              color: "#444",
              lineHeight: "1.7",
              marginBottom: "36px",
              maxWidth: "480px",
              fontWeight: "400",
            }}>
              AdMax India connects local businesses through smart TV screens installed across restaurants, gyms, hospitals & salons — turning waiting time into ad time.
            </p>

            <div className="fade-up delay-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/register" className="btn-primary">
                Start Advertising →
              </Link>
              <Link to="/contact" className="btn-secondary">
                📅 Book Demo
              </Link>
            </div>

            <div className="fade-up delay-4" style={{
              display: "flex",
              gap: "24px",
              marginTop: "40px",
              flexWrap: "wrap",
            }}>
              {[["🔒", "No contracts"], ["⚡", "Live in 24hrs"], ["📍", "Hyperlocal"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", color: "#555", fontSize: "13px" }}>
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Floating TV Screens */}
          <div style={{
            flex: "1",
            minWidth: "340px",
            display: "flex",
            gap: "20px",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative",
          }}>
            <div className="float-1" style={{ marginBottom: "40px" }}>
              <TVScreen ads={tvAds[0]} delay={0} />
            </div>
            <div className="float-2">
              <TVScreen ads={tvAds[1]} delay={800} />
            </div>
            <div className="float-3" style={{ marginBottom: "20px" }}>
              <TVScreen ads={tvAds[2]} delay={1600} />
            </div>

            {/* Live badge */}
            <div style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "100px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              whiteSpace: "nowrap",
            }}>
              <div style={{ position: "relative", width: "8px", height: "8px" }}>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "#22c55e",
                  borderRadius: "50%",
                  animation: "pulse-ring 1.5s ease-out infinite",
                }} />
                <div style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", position: "relative" }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#111" }}>142 screens live right now</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "80px 24px", background: "white" }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
        }}>
          {[
            { value: c1, suffix: "+", label: "Screens Installed", sub: "Across Pune & Mumbai" },
            { value: c2, suffix: "+", label: "Businesses Connected", sub: "Growing every week" },
            { value: c3, suffix: "+", label: "Monthly Ad Views", sub: "Real local impressions" },
          ].map(({ value, suffix, label, sub }, i) => (
            <div key={i} style={{
              textAlign: "center",
              padding: "40px 24px",
              borderRight: i < 2 ? "1px solid #f0f0f0" : "none",
            }}>
              <div className="hero-heading" style={{
                fontSize: "clamp(40px, 5vw, 56px)",
                fontWeight: "800",
                color: "#1F7A4D",
                lineHeight: "1",
                letterSpacing: "-0.03em",
                marginBottom: "8px",
              }}>
                {value >= 1000000
                  ? `${(value / 1000000).toFixed(1)}M`
                  : value.toLocaleString()}
                {suffix}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#111", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "13px", color: "#888" }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY PILLS ── */}
      <section style={{ padding: "48px 24px", background: "#FAFAFA", borderTop: "1px solid #efc5c5ff", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>
            Trusted by businesses across categories
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {categories.map((cat) => (
              <span key={cat} className="category-pill" style={{
                background: "white",
                border: "1.5px solid #e5e7eb",
                borderRadius: "100px",
                padding: "8px 18px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
              }}>{cat}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
              HOW IT WORKS
            </p>
            <h2 className="hero-heading" style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
              lineHeight: "1.15",
            }}>
              From signup to live ads<br />in under 24 hours
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "24px",
            position: "relative",
          }}>
            {steps.map((step, i) => (
              <div key={i} className="card-hover step-card" style={{
                background: "#FAFAFA",
                border: "1px solid #efefef",
                borderRadius: "20px",
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute",
                  top: "16px",
                  right: "20px",
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "42px",
                  fontWeight: "800",
                  color: "#f0f0f0",
                  lineHeight: "1",
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                }}>{step.num}</div>
                <div className="step-icon" style={{
                  fontSize: "32px",
                  marginBottom: "16px",
                  display: "inline-block",
                }}>{step.icon}</div>
                <h3 style={{
                  fontSize: "17px",
                  fontWeight: "700",
                  color: "#111",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}>{step.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.65" }}>{step.desc}</p>

                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute",
                    right: "-14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    color: "#ccc",
                    fontSize: "18px",
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(180deg, #F7FBF9 0%, #ffffff 100%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}>
              PLATFORM FEATURES
            </p>
            <h2 className="hero-heading" style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
              lineHeight: "1.15",
            }}>
              Everything you need to<br />dominate your local market
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {services.map((svc, i) => (
              <div key={i} className="card-hover" style={{
                background: "white",
                border: "1px solid #efefef",
                borderRadius: "20px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "30px" }}>{svc.icon}</span>
                  <span style={{
                    background: "#EAF7EF",
                    color: "#1F7A4D",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "100px",
                    letterSpacing: "0.08em",
                  }}>{svc.tag}</span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111", letterSpacing: "-0.01em" }}>{svc.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.65" }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL / SOCIAL PROOF ── */}
      <section style={{ padding: "80px 24px", background: "white", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "40px" }}>
            WHAT BUSINESSES SAY
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { quote: "We got 3x more walk-ins from the gym next door after our ads started running there.", author: "Rajan Mehta", biz: "Pizza Palace, Pune" },
              { quote: "Setup took 10 minutes. Within a week we saw new patients mentioning our clinic ad.", author: "Dr. Priya Nair", biz: "CityClinic, Kothrud" },
              { quote: "AdMax is the most cost-effective local advertising I've ever tried. Genuinely impressed.", author: "Sunita Sharma", biz: "Glow Salon, Baner" },
            ].map((t, i) => (
              <div key={i} className="card-hover" style={{
                background: "#FAFAFA",
                border: "1px solid #efefef",
                borderRadius: "20px",
                padding: "28px",
                textAlign: "left",
              }}>
                <div style={{ fontSize: "24px", color: "#1F7A4D", marginBottom: "12px", fontFamily: "serif" }}>"</div>
                <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.7", marginBottom: "20px" }}>{t.quote}</p>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#111" }}>{t.author}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{t.biz}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: "40px 24px 80px",
        background: "linear-gradient(135deg, #1F7A4D 0%, #155c39 100%)",
        borderRadius: "28px",
        padding: "80px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-80px",
          left: "-40px",
          width: "250px",
          height: "250px",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <p style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>GET STARTED TODAY</p>

        <h2 className="hero-heading" style={{
          fontSize: "clamp(28px, 4vw, 46px)",
          fontWeight: "800",
          color: "white",
          letterSpacing: "-0.02em",
          lineHeight: "1.15",
          marginBottom: "20px",
        }}>
          Ready to grow your local business?
        </h2>

        <p style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.7)",
          marginBottom: "40px",
          maxWidth: "480px",
          margin: "0 auto 40px",
          lineHeight: "1.65",
        }}>
          Join hundreds of businesses already running ads on AdMax India's hyperlocal TV network.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{
            background: "white",
            color: "#1F7A4D",
            padding: "14px 32px",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "15px",
            textDecoration: "none",
            transition: "all 0.25s ease",
            display: "inline-block",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            Start Advertising →
          </Link>
          <Link to="/contact" style={{
            background: "transparent",
            color: "white",
            border: "1.5px solid rgba(255,255,255,0.35)",
            padding: "13px 32px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "15px",
            textDecoration: "none",
            transition: "all 0.25s ease",
            display: "inline-block",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "translateY(0)"; }}
          >
            📅 Book a Demo
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}