import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";

function useInView(threshold = 0.15) {
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

const mainServices = [
  {
    icon: "📺",
    tag: "Core",
    tagColor: "#1F7A4D",
    tagBg: "#EAF7EF",
    title: "Digital Screen Advertising",
    desc: "Get your brand on high-visibility TV screens inside busy restaurants, gyms, clinics, and salons — where your customers spend real time every day.",
    features: ["HD display support", "Auto-optimised layouts", "Real-time ad delivery", "Screen health monitoring"],
  },
  {
    icon: "🎯",
    tag: "Smart",
    tagColor: "#2563eb",
    tagBg: "#eff6ff",
    title: "Hyperlocal Campaign Management",
    desc: "Create and manage ad campaigns with precision radius targeting. Choose 1km, 3km, or 5km and control exactly where and when your ads appear.",
    features: ["Radius-based targeting", "Time slot scheduling", "Multi-screen campaigns", "One-click pause / resume"],
  },
  {
    icon: "🎬",
    tag: "Premium",
    tagColor: "#7c3aed",
    tagBg: "#f5f3ff",
    title: "Creative Ad Production",
    desc: "Don't have an ad ready? Our in-house team creates professional video ads and static creatives tailored for local TV display formats.",
    features: ["Script & storyboard", "Motion graphics", "Voice-over production", "TV-optimised output"],
  },
  {
    icon: "📊",
    tag: "Insights",
    tagColor: "#0891b2",
    tagBg: "#ecfeff",
    title: "Real-Time Analytics",
    desc: "Track impressions, screen views, and campaign ROI with a live analytics dashboard. Know exactly what's working and where.",
    features: ["Live impression tracking", "Screen-level breakdown", "Campaign comparison", "Exportable reports"],
  },
  {
    icon: "🤖",
    tag: "AI-Powered",
    tagColor: "#d97706",
    tagBg: "#fffbeb",
    title: "AI Ad Suggestions",
    desc: "Our AI engine analyses your business type, location, and time patterns to suggest the best-performing screens, time slots, and ad formats.",
    features: ["Best time slot suggestions", "Screen ranking by fit", "Budget optimisation", "Audience behaviour insights"],
  },
  {
    icon: "🖥️",
    tag: "Network",
    tagColor: "#1F7A4D",
    tagBg: "#EAF7EF",
    title: "Screen Network Access",
    desc: "Tap into AdMax's growing network of partner screens across Pune and beyond. New locations are added weekly — your reach grows with the network.",
    features: ["150+ partner screens", "Interactive map view", "New screens weekly", "Screen status tracking"],
  },
];

const process = [
  { num: "01", title: "Consult", desc: "We learn about your business, goals, and target audience.", icon: "🤝" },
  { num: "02", title: "Create", desc: "You upload your ad or we produce one for you.", icon: "🎨" },
  { num: "03", title: "Configure", desc: "Set your radius, time slots, and campaign duration.", icon: "⚙️" },
  { num: "04", title: "Go Live", desc: "Your ads appear on nearby screens within 24 hours.", icon: "🚀" },
  { num: "05", title: "Analyse", desc: "Track performance and optimise from your dashboard.", icon: "📈" },
];

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/ campaign",
    desc: "Perfect for trying out AdMax.",
    features: ["1 active campaign", "Up to 5 screens", "Basic analytics", "Image ads only", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Business",
    price: "₹3,499",
    period: "/ month",
    desc: "For businesses serious about local growth.",
    features: ["5 active campaigns", "Unlimited screens", "Full analytics + exports", "Image & video ads", "AI suggestions", "Priority support"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For chains, franchises & agencies.",
    features: ["Unlimited campaigns", "Multi-city targeting", "Dedicated account manager", "Custom integrations", "White-label option", "SLA support"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Services() {
  const [servicesRef, servicesInView] = useInView();
  const [processRef, processInView] = useInView();
  const [plansRef, plansInView] = useInView();

  return (
    <PublicLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .svc-heading { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .anim-up {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .anim-up.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.04s; }
        .d2 { transition-delay: 0.10s; }
        .d3 { transition-delay: 0.16s; }
        .d4 { transition-delay: 0.22s; }
        .d5 { transition-delay: 0.28s; }
        .d6 { transition-delay: 0.34s; }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 3s linear infinite;
        }

        .svc-card {
          background: white; border: 1px solid #efefef;
          border-radius: 22px; padding: 32px;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
          display: flex; flex-direction: column; gap: 16px;
        }
        .svc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
        }
        .svc-card:hover .svc-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .svc-icon { transition: transform 0.25s ease; display: inline-block; }

        .check-item {
          display: flex; align-items: center;
          gap: 8px; font-size: 13px; color: #555;
        }

        .process-step {
          background: white; border: 1px solid #efefef;
          border-radius: 18px; padding: 28px 24px;
          text-align: center; position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .process-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }

        .plan-card {
          border-radius: 22px; padding: 36px 32px;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .plan-card:hover { transform: translateY(-5px); }
        .plan-card.featured { box-shadow: 0 20px 60px rgba(31,122,77,0.18); }
        .plan-card.featured:hover { box-shadow: 0 28px 72px rgba(31,122,77,0.25); }

        .plan-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; border: none;
          transition: all 0.22s ease; text-decoration: none;
          display: block; text-align: center;
        }
        .plan-btn:hover { transform: translateY(-2px); }
      `}</style>

      {/* ── HEADER ── */}
      <section style={{
        background: "linear-gradient(160deg, #f0faf5 0%, #ffffff 55%, #f7fffe 100%)",
        padding: "96px 24px 80px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-100px", right: "-60px",
          width: "480px", height: "480px",
          background: "radial-gradient(circle, rgba(47,163,107,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.2)",
            borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
            animation: "fadeUp 0.5s ease both",
          }}>
            <span>📡</span>
            <span style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600" }}>
              Everything local businesses need to grow
            </span>
          </div>

          <h1 className="svc-heading" style={{
            fontSize: "clamp(34px, 5vw, 56px)", fontWeight: "800",
            letterSpacing: "-0.03em", color: "#0a0a0a", lineHeight: "1.1",
            marginBottom: "18px", animation: "fadeUp 0.6s ease 0.1s both",
          }}>
            Services built for <span className="shimmer-text">hyperlocal reach</span>
          </h1>

          <p style={{
            fontSize: "16px", color: "#555", lineHeight: "1.75",
            animation: "fadeUp 0.6s ease 0.22s both",
          }}>
            From ad creation to live screen distribution — AdMax India handles every step
            of your local advertising journey with smart, affordable tools.
          </p>
        </div>
      </section>

      {/* ── MAIN SERVICES GRID ── */}
      <section style={{ padding: "88px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
              WHAT WE OFFER
            </p>
            <h2 className="svc-heading" style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a", lineHeight: "1.15",
            }}>Six ways AdMax grows your business</h2>
          </div>

          <div ref={servicesRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}>
            {mainServices.map((svc, i) => (
              <div key={i} className={`svc-card anim-up d${i + 1} ${servicesInView ? "visible" : ""}`}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="svc-icon" style={{ fontSize: "32px" }}>{svc.icon}</span>
                  <span style={{
                    background: svc.tagBg, color: svc.tagColor,
                    fontSize: "10px", fontWeight: "700",
                    padding: "4px 10px", borderRadius: "100px",
                    letterSpacing: "0.06em",
                  }}>{svc.tag}</span>
                </div>

                <div>
                  <h3 style={{
                    fontSize: "17px", fontWeight: "700",
                    color: "#111", marginBottom: "8px", letterSpacing: "-0.01em",
                  }}>{svc.title}</h3>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.65" }}>{svc.desc}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "4px" }}>
                  {svc.features.map((f, j) => (
                    <div key={j} className="check-item">
                      <span style={{
                        width: "16px", height: "16px", borderRadius: "50%",
                        background: "#EAF7EF", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "9px", color: "#1F7A4D", flexShrink: 0,
                      }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW THE PROCESS WORKS ── */}
      <section style={{
        padding: "88px 24px",
        background: "linear-gradient(180deg, #F7FBF9 0%, #ffffff 100%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
              THE PROCESS
            </p>
            <h2 className="svc-heading" style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a", lineHeight: "1.15",
            }}>How it works, start to finish</h2>
          </div>

          <div ref={processRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}>
            {process.map((step, i) => (
              <div key={i} className={`process-step anim-up d${i + 1} ${processInView ? "visible" : ""}`}>
                <div style={{
                  position: "absolute", top: "14px", right: "16px",
                  fontFamily: "'Sora', sans-serif", fontSize: "36px",
                  fontWeight: "800", color: "#f3f4f6",
                  lineHeight: "1", userSelect: "none",
                }}>{step.num}</div>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{step.icon}</div>
                <h3 style={{
                  fontSize: "15px", fontWeight: "700",
                  color: "#111", marginBottom: "8px",
                }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: "#777", lineHeight: "1.6" }}>{step.desc}</p>

                {i < process.length - 1 && (
                  <div style={{
                    position: "absolute", right: "-10px", top: "50%",
                    transform: "translateY(-50%)", color: "#d1d5db",
                    fontSize: "16px", zIndex: 1,
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "88px 24px", background: "white" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", color: "#1F7A4D", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "10px" }}>
              PRICING
            </p>
            <h2 className="svc-heading" style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a", lineHeight: "1.15",
              marginBottom: "12px",
            }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: "15px", color: "#777" }}>No contracts. No hidden fees. Cancel anytime.</p>
          </div>

          <div ref={plansRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}>
            {plans.map((plan, i) => (
              <div key={i} className={`plan-card anim-up d${i + 1} ${plansRef && plansInView ? "visible" : ""} ${plan.highlight ? "featured" : ""}`}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(145deg, #1F7A4D, #155c39)"
                    : "white",
                  border: plan.highlight ? "none" : "1px solid #efefef",
                  position: "relative",
                  overflow: "hidden",
                }}>

                {plan.highlight && (
                  <>
                    <div style={{
                      position: "absolute", top: "16px", right: "20px",
                      background: "rgba(255,255,255,0.15)",
                      color: "white", fontSize: "10px",
                      fontWeight: "700", padding: "4px 10px",
                      borderRadius: "100px", letterSpacing: "0.06em",
                    }}>MOST POPULAR</div>
                    <div style={{
                      position: "absolute", bottom: "-40px", right: "-40px",
                      width: "160px", height: "160px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "50%",
                    }} />
                  </>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <h3 className="svc-heading" style={{
                    fontSize: "18px", fontWeight: "800",
                    color: plan.highlight ? "white" : "#111",
                    marginBottom: "6px", letterSpacing: "-0.01em",
                  }}>{plan.name}</h3>
                  <p style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.65)" : "#888", marginBottom: "16px" }}>{plan.desc}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                    <span className="svc-heading" style={{
                      fontSize: "36px", fontWeight: "800",
                      color: plan.highlight ? "white" : "#0a0a0a",
                      letterSpacing: "-0.03em",
                    }}>{plan.price}</span>
                    {plan.period && (
                      <span style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.6)" : "#999" }}>{plan.period}</span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "50%",
                        background: plan.highlight ? "rgba(255,255,255,0.15)" : "#EAF7EF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", color: plan.highlight ? "white" : "#1F7A4D",
                        flexShrink: 0,
                      }}>✓</span>
                      <span style={{ fontSize: "13px", color: plan.highlight ? "rgba(255,255,255,0.85)" : "#555" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link to={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className="plan-btn"
                  style={{
                    background: plan.highlight ? "white" : "#1F7A4D",
                    color: plan.highlight ? "#1F7A4D" : "white",
                    boxShadow: plan.highlight ? "none" : "0 4px 16px rgba(31,122,77,0.2)",
                  }}>
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: "0 24px 80px",
        background: "linear-gradient(135deg, #1F7A4D 0%, #155c39 100%)",
        borderRadius: "28px", padding: "72px 40px", textAlign: "center",
        position: "relative", overflow: "hidden",
        maxWidth: "1100px", marginLeft: "auto", marginRight: "auto",
      }}>
        {[300, 500].map((size, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${size}px`, height: `${size}px`,
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "50%", pointerEvents: "none",
          }} />
        ))}
        <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px" }}>
          READY TO ADVERTISE?
        </p>
        <h2 className="svc-heading" style={{
          fontSize: "clamp(26px, 4vw, 44px)", fontWeight: "800",
          color: "white", letterSpacing: "-0.02em", lineHeight: "1.15", marginBottom: "16px",
        }}>
          Start reaching local customers today
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", marginBottom: "36px", maxWidth: "440px", margin: "0 auto 36px", lineHeight: "1.7" }}>
          Join AdMax India's hyperlocal TV network and put your brand in front of the right people.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" style={{
            background: "white", color: "#1F7A4D",
            padding: "14px 32px", borderRadius: "12px",
            fontWeight: "700", fontSize: "15px", textDecoration: "none",
            transition: "transform 0.2s ease", display: "inline-block",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >Get Started →</Link>
          <Link to="/contact" style={{
            background: "transparent", color: "white",
            border: "1.5px solid rgba(255,255,255,0.35)",
            padding: "13px 32px", borderRadius: "12px",
            fontWeight: "600", fontSize: "15px", textDecoration: "none",
            transition: "all 0.2s ease", display: "inline-block",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "translateY(0)"; }}
          >📅 Book Demo</Link>
        </div>
      </section>
    </PublicLayout>
  );
}