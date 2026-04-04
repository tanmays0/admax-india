import { useEffect, useRef, useState } from "react";
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

const network = [
  { icon: "🍽️", title: "Restaurants", desc: "Display ads while customers dine and relax — high dwell time, full attention." },
  { icon: "💪", title: "Gyms", desc: "Reach health-conscious, motivated audiences in fitness centers daily." },
  { icon: "🏥", title: "Hospitals", desc: "Promote services calmly while visitors wait in reception areas." },
  { icon: "💆", title: "Salons", desc: "Engage customers during long waiting and service sessions." },
  { icon: "🩺", title: "Clinics", desc: "Connect local brands with neighbourhood communities." },
  { icon: "🛍️", title: "Retail Stores", desc: "Deliver ad messages at the exact moment people are in shopping mode." },
];

const whyUs = [
  {
    icon: "📍",
    title: "Target Local Audience",
    desc: "Ads appear within 1–5km of your business, so every view is from a potential walk-in customer.",
  },
  {
    icon: "👁️",
    title: "High Visibility",
    desc: "Large-screen TV placements in high-dwell locations mean your brand is impossible to ignore.",
  },
  {
    icon: "🎛️",
    title: "Smart Campaigns",
    desc: "Schedule, target, and manage your ads in minutes from the AdMax dashboard.",
  },
  {
    icon: "📊",
    title: "Live Analytics",
    desc: "Track impressions and screen views in real time. Know exactly what's working.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Suggestions",
    desc: "Our AI recommends the best time slots and screen locations for your business type.",
  },
  {
    icon: "💳",
    title: "Affordable & Transparent",
    desc: "No contracts, no hidden fees. Pay per campaign with full Razorpay billing history.",
  },
];

const team = [
  { name: "Sudhir Shinde", role: "Co-founder & CEO", emoji: "👨‍💼" },
  { name: "Dilip Satre", role: "Co-founder & CTO", emoji: "👩‍💻" },
  { name: "Rahul Sinha", role: "Head of Growth", emoji: "📈" },
];

export default function About() {
  const [networkRef, networkInView] = useInView();
  const [whyRef, whyInView] = useInView();
  const [teamRef, teamInView] = useInView();

  return (
    <PublicLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .about-heading { font-family: 'Sora', sans-serif; }
        body, p, span, div { font-family: 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .anim-fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .anim-fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .anim-delay-1 { transition-delay: 0.05s; }
        .anim-delay-2 { transition-delay: 0.12s; }
        .anim-delay-3 { transition-delay: 0.19s; }
        .anim-delay-4 { transition-delay: 0.26s; }
        .anim-delay-5 { transition-delay: 0.33s; }
        .anim-delay-6 { transition-delay: 0.40s; }

        .card-lift {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .card-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.09);
        }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .icon-bubble {
          transition: transform 0.25s ease;
        }
        .card-lift:hover .icon-bubble {
          transform: scale(1.12) rotate(6deg);
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <section style={{
        background: "linear-gradient(160deg, #f0faf5 0%, #ffffff 60%, #f7fffe 100%)",
        padding: "100px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-100px", right: "-80px",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(47,163,107,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "760px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.2)",
            borderRadius: "100px", padding: "6px 16px",
            marginBottom: "28px",
            animation: "fadeIn 0.5s ease forwards",
          }}>
            <span style={{ fontSize: "14px" }}>🌱</span>
            <span style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600" }}>
              Built in India, for India
            </span>
          </div>

          <h1 className="about-heading" style={{
            fontSize: "clamp(36px, 5vw, 58px)",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            color: "#0a0a0a",
            lineHeight: "1.1",
            marginBottom: "20px",
            animation: "fadeUp 0.7s ease 0.1s both",
          }}>
            The story behind <span className="shimmer-text">AdMax India</span>
          </h1>

          <p style={{
            fontSize: "17px",
            color: "#555",
            lineHeight: "1.75",
            fontWeight: "400",
            animation: "fadeUp 0.7s ease 0.25s both",
          }}>
            AdMax India is building the country's most powerful hyperlocal advertising network —
            connecting local businesses through smart digital screens placed in the locations
            their customers already visit every day.
          </p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ padding: "96px 24px", background: "white" }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap",
        }}>
          {/* Left visual */}
          <div style={{
            flex: "1", minWidth: "280px",
            background: "linear-gradient(135deg, #1F7A4D, #2FA36B)",
            borderRadius: "28px",
            padding: "56px 40px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", bottom: "-40px", right: "-40px",
              width: "200px", height: "200px",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }} />
            <div style={{
              position: "absolute", top: "-30px", left: "-30px",
              width: "150px", height: "150px",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "50%",
            }} />
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎯</div>
            <h3 className="about-heading" style={{
              fontSize: "28px", fontWeight: "800",
              letterSpacing: "-0.02em", marginBottom: "12px",
            }}>Our Mission</h3>
            <p style={{ fontSize: "15px", lineHeight: "1.75", opacity: "0.88", fontWeight: "400" }}>
              Help every local business grow by giving them access to affordable, highly
              visible advertising — right in the neighbourhoods they serve.
            </p>
          </div>

          {/* Right content */}
          <div style={{ flex: "1.2", minWidth: "280px" }}>
            <p style={{
              fontSize: "12px", fontWeight: "700", color: "#1F7A4D",
              letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "14px",
            }}>OUR STORY</p>

            <h2 className="about-heading" style={{
              fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a",
              lineHeight: "1.2", marginBottom: "20px",
            }}>
              We noticed a gap.<br />Local ads weren't local enough.
            </h2>

            <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "16px" }}>
              Small businesses in Pune were spending thousands on Facebook and Google ads,
              reaching people miles away — while the customer they needed was sitting 500 meters
              away at a coffee shop or gym.
            </p>
            <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.8" }}>
              AdMax India was built to solve that. We install smart TV screens inside local
              businesses and let them advertise to each other's customers — the people who
              already live, work, and spend time in the same neighbourhood.
            </p>

            <div style={{ display: "flex", gap: "32px", marginTop: "36px", flexWrap: "wrap" }}>
              {[["2026", "Founded"], ["₹0", "Hidden fees"], ["24hr", "Go-live time"]].map(([val, label]) => (
                <div key={label}>
                  <div className="about-heading" style={{
                    fontSize: "28px", fontWeight: "800",
                    color: "#1F7A4D", letterSpacing: "-0.02em",
                  }}>{val}</div>
                  <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NETWORK ── */}
      <section style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #F7FBF9 0%, #ffffff 100%)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{
              fontSize: "12px", fontWeight: "700", color: "#1F7A4D",
              letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px",
            }}>THE NETWORK</p>
            <h2 className="about-heading" style={{
              fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a", lineHeight: "1.15",
            }}>
              Where your ads appear
            </h2>
            <p style={{ color: "#666", fontSize: "16px", marginTop: "12px", maxWidth: "480px", margin: "12px auto 0" }}>
              Our screens are installed in 6 business categories across Pune and expanding fast.
            </p>
          </div>

          <div ref={networkRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {network.map((item, i) => (
              <div
                key={i}
                className={`card-lift anim-fade-up anim-delay-${i + 1} ${networkInView ? "visible" : ""}`}
                style={{
                  background: "white",
                  border: "1px solid #efefef",
                  borderRadius: "20px",
                  padding: "32px",
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                }}
              >
                <div className="icon-bubble" style={{
                  fontSize: "28px",
                  background: "#EAF7EF",
                  borderRadius: "14px",
                  width: "52px",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>{item.icon}</div>
                <div>
                  <h3 style={{
                    fontSize: "16px", fontWeight: "700",
                    color: "#111", marginBottom: "6px", letterSpacing: "-0.01em",
                  }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.65" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ADMAX ── */}
      <section style={{ padding: "96px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{
              fontSize: "12px", fontWeight: "700", color: "#1F7A4D",
              letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px",
            }}>WHY CHOOSE US</p>
            <h2 className="about-heading" style={{
              fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a", lineHeight: "1.15",
            }}>
              Built different. Built local.
            </h2>
          </div>

          <div ref={whyRef} style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {whyUs.map((item, i) => (
              <div
                key={i}
                className={`card-lift anim-fade-up anim-delay-${i + 1} ${whyInView ? "visible" : ""}`}
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #efefef",
                  borderRadius: "20px",
                  padding: "32px",
                }}
              >
                <div className="icon-bubble" style={{
                  fontSize: "22px",
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}>{item.icon}</div>
                <h3 style={{
                  fontSize: "16px", fontWeight: "700",
                  color: "#111", marginBottom: "8px", letterSpacing: "-0.01em",
                }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.65" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{
        padding: "96px 24px",
        background: "linear-gradient(180deg, #F7FBF9 0%, #ffffff 100%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{
            fontSize: "12px", fontWeight: "700", color: "#1F7A4D",
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px",
          }}>THE TEAM</p>
          <h2 className="about-heading" style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
            letterSpacing: "-0.02em", color: "#0a0a0a",
            lineHeight: "1.15", marginBottom: "48px",
          }}>
            People behind the platform
          </h2>

          <div ref={teamRef} style={{
            display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap",
          }}>
            {team.map((member, i) => (
              <div
                key={i}
                className={`card-lift anim-fade-up anim-delay-${i + 1} ${teamInView ? "visible" : ""}`}
                style={{
                  background: "white",
                  border: "1px solid #efefef",
                  borderRadius: "20px",
                  padding: "36px 32px",
                  minWidth: "200px",
                  flex: "1",
                }}
              >
                <div style={{
                  width: "64px", height: "64px",
                  background: "#EAF7EF",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 16px",
                }}>{member.emoji}</div>
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#111", marginBottom: "4px" }}>{member.name}</div>
                <div style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "500" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section style={{
        margin: "0 24px 80px",
        background: "linear-gradient(135deg, #1F7A4D 0%, #155c39 100%)",
        borderRadius: "28px",
        padding: "64px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "280px", height: "280px",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <h2 className="about-heading" style={{
          fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: "800",
          color: "white", letterSpacing: "-0.02em",
          lineHeight: "1.2", marginBottom: "16px",
        }}>
          Want to be part of the network?
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: "15px",
          marginBottom: "36px", maxWidth: "440px",
          margin: "0 auto 36px", lineHeight: "1.7",
        }}>
          Register your business today and start advertising on AdMax India's growing local screen network.
        </p>
        <a href="/register" style={{
          background: "white", color: "#1F7A4D",
          padding: "14px 36px", borderRadius: "12px",
          fontWeight: "700", fontSize: "15px",
          textDecoration: "none", display: "inline-block",
          transition: "transform 0.2s ease",
        }}
          onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.target.style.transform = "translateY(0)"}
        >
          Get Started →
        </a>
      </section>
    </PublicLayout>
  );
}