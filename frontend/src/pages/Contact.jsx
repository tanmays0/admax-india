import { useState } from "react";
import PublicLayout from "../layouts/PublicLayout";

const contactInfo = [
  { icon: "📍", label: "Our Office", value: "Sterling Towers, Amanora Park Town, Hadapsar, Pune, Maharashtra - 411028" },
  { icon: "📧", label: "Email Us", value: "hello@admaxindia.com" },
  { icon: "📞", label: "Call Us", value: "+91 9923191542" },
  { icon: "🕐", label: "Working Hours", value: "Mon–Sat, 9am – 7pm IST" },
];

const faqs = [
  { q: "How quickly can my ad go live?", a: "Once your campaign is approved by our team, ads typically go live within 24 hours." },
  { q: "What ad formats do you support?", a: "We support JPG, PNG images and MP4 videos. Our system auto-optimises for TV screen resolution." },
  { q: "Can I choose which screens to advertise on?", a: "Yes — our interactive map lets you hand-pick screens or target by radius from your location." },
  { q: "Is there a minimum campaign budget?", a: "No minimum. Our Starter plan lets you run campaigns from as little as ₹999." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "", city: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "-0.01em",
  };

  return (
    <PublicLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .contact-heading { font-family: 'Sora', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }

        .hero-anim { animation: fadeUp 0.6s ease both; }
        .delay-1   { animation-delay: 0.1s; }
        .delay-2   { animation-delay: 0.22s; }
        .delay-3   { animation-delay: 0.34s; }

        .shimmer-text {
          background: linear-gradient(90deg, #1F7A4D 0%, #2FA36B 40%, #1F7A4D 60%, #2FA36B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        .info-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        .faq-item {
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .faq-item:last-child { border-bottom: none; }

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
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(31,122,77,0.3);
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active { transform: translateY(0); }

        .success-anim { animation: scaleIn 0.4s ease both; }
      `}</style>

      {/* ── HEADER ── */}
      <section style={{
        background: "linear-gradient(160deg, #f0faf5 0%, #ffffff 55%, #f7fffe 100%)",
        padding: "96px 24px 72px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-100px", right: "-60px",
          width: "450px", height: "450px",
          background: "radial-gradient(circle, rgba(47,163,107,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(31,122,77,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative" }}>
          <div className="hero-anim delay-1" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.2)",
            borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
          }}>
            <span style={{ fontSize: "14px" }}>💬</span>
            <span style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600" }}>
              We reply within 4 business hours
            </span>
          </div>

          <h1 className="contact-heading hero-anim delay-2" style={{
            fontSize: "clamp(34px, 5vw, 54px)",
            fontWeight: "800",
            letterSpacing: "-0.03em",
            color: "#0a0a0a",
            lineHeight: "1.1",
            marginBottom: "16px",
          }}>
            Let's <span className="shimmer-text">talk business</span>
          </h1>

          <p className="hero-anim delay-3" style={{
            fontSize: "16px", color: "#555",
            lineHeight: "1.75", fontWeight: "400",
          }}>
            Whether you want to advertise, join our screen network,
            or just have a question — we're all ears.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section style={{ padding: "56px 24px 0", background: "white" }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "16px",
        }}>
          {contactInfo.map((item, i) => (
            <div key={i} className="info-card" style={{
              background: "#FAFAFA",
              border: "1px solid #efefef",
              borderRadius: "18px",
              padding: "24px 20px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}>
              <div style={{
                fontSize: "20px",
                background: "#EAF7EF",
                borderRadius: "10px",
                width: "42px", height: "42px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "500", color: "#333", lineHeight: "1.5" }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT: FORM + FAQ ── */}
      <section style={{ padding: "56px 24px 96px", background: "white" }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "32px",
          alignItems: "start",
        }}>

          {/* ── FORM ── */}
          <div style={{
            background: "white",
            border: "1px solid #efefef",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}>
            {!submitted ? (
              <>
                <h2 className="contact-heading" style={{
                  fontSize: "22px", fontWeight: "800",
                  letterSpacing: "-0.02em", color: "#0a0a0a",
                  marginBottom: "6px",
                }}>Send us a message</h2>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "28px" }}>
                  Fill in the details below and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder="Rajan Mehta" required style={inputStyle("name")}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="rajan@example.com" required style={inputStyle("email")}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <div>
                      <label style={labelStyle}>Phone Number</label>
                      <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210" style={inputStyle("phone")}
                        onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>City</label>
                      <input
                        name="city" value={form.city} onChange={handleChange}
                        placeholder="Pune" style={inputStyle("city")}
                        onFocus={() => setFocused("city")} onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>Business Name</label>
                    <input
                      name="business" value={form.business} onChange={handleChange}
                      placeholder="Your business name" style={inputStyle("business")}
                      onFocus={() => setFocused("business")} onBlur={() => setFocused(null)}
                    />
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      placeholder="Tell us what you're looking for..." required
                      rows={4}
                      style={{ ...inputStyle("message"), resize: "vertical", lineHeight: "1.6" }}
                      onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    />
                  </div>

                  <button type="submit" className="submit-btn">
                    Send Message →
                  </button>

                  <p style={{ fontSize: "12px", color: "#aaa", textAlign: "center", marginTop: "14px" }}>
                    🔒 Your data is safe with us. We never share your details.
                  </p>
                </form>
              </>
            ) : (
              <div className="success-anim" style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{
                  width: "72px", height: "72px",
                  background: "#EAF7EF",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px",
                }}>✅</div>
                <h3 className="contact-heading" style={{
                  fontSize: "22px", fontWeight: "800",
                  color: "#0a0a0a", marginBottom: "10px",
                }}>Message sent!</h3>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", marginBottom: "28px" }}>
                  Thanks for reaching out, <strong>{form.name || "there"}</strong>.<br />
                  Our team will get back to you within 4 business hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", business: "", city: "", message: "" }); }}
                  style={{
                    background: "white", color: "#1F7A4D",
                    border: "1.5px solid #1F7A4D",
                    padding: "11px 28px", borderRadius: "10px",
                    fontWeight: "600", fontSize: "14px",
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

          {/* ── FAQ ── */}
          <div>
            <h2 className="contact-heading" style={{
              fontSize: "22px", fontWeight: "800",
              letterSpacing: "-0.02em", color: "#0a0a0a",
              marginBottom: "6px",
            }}>Common questions</h2>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
              Quick answers to things people usually ask us.
            </p>

            <div style={{
              background: "white",
              border: "1px solid #efefef",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: "20px 24px" }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: "12px",
                  }}>
                    <span style={{
                      fontSize: "14px", fontWeight: "600",
                      color: openFaq === i ? "#1F7A4D" : "#111",
                      lineHeight: "1.4",
                      transition: "color 0.2s",
                    }}>{faq.q}</span>
                    <span style={{
                      fontSize: "18px", color: "#aaa",
                      transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                      flexShrink: 0,
                    }}>+</span>
                  </div>
                  <div style={{
                    overflow: "hidden",
                    maxHeight: openFaq === i ? "120px" : "0",
                    transition: "max-height 0.3s ease",
                  }}>
                    <p style={{
                      fontSize: "13px", color: "#666",
                      lineHeight: "1.7", paddingTop: "10px",
                      margin: 0,
                    }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Book demo card */}
            <div style={{
              marginTop: "20px",
              background: "linear-gradient(135deg, #1F7A4D, #155c39)",
              borderRadius: "20px",
              padding: "28px 24px",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                width: "120px", height: "120px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "50%",
              }} />
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>📅</div>
              <h3 className="contact-heading" style={{
                fontSize: "17px", fontWeight: "800",
                marginBottom: "8px", letterSpacing: "-0.01em",
              }}>Book a live demo</h3>
              <p style={{ fontSize: "13px", opacity: "0.8", lineHeight: "1.65", marginBottom: "20px" }}>
                See AdMax in action. We'll walk you through the platform and answer all your questions live.
              </p>
              <a href="/book-demo" style={{
                background: "white", color: "#1F7A4D",
                padding: "10px 22px", borderRadius: "10px",
                fontWeight: "700", fontSize: "13px",
                textDecoration: "none", display: "inline-block",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
              >
                Schedule Demo →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}