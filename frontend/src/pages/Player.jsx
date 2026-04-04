import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

// ── Mock ads (replaced by API response) ─────────────────────────
const MOCK_ADS = [
  { id: 1, title: "Pizza Palace", subtitle: "50% off today! Visit us now.", bg: "linear-gradient(135deg, #c0392b, #e74c3c)", icon: "🍕", cta: "Order Now · 98765 43210" },
  { id: 2, title: "IronFit Gym", subtitle: "Join this month. First week FREE.", bg: "linear-gradient(135deg, #1F7A4D, #2FA36B)", icon: "💪", cta: "Call us · 91234 56789" },
  { id: 3, title: "Glow Salon", subtitle: "Haircut + styling from ₹299 only.", bg: "linear-gradient(135deg, #8e44ad, #9b59b6)", icon: "💆", cta: "Book Now · Baner Road" },
  { id: 4, title: "Bean & Brew", subtitle: "Morning coffee deals. 7am – 11am.", bg: "linear-gradient(135deg, #7f5a2a, #c8913a)", icon: "☕", cta: "Walk in · FC Road" },
  { id: 5, title: "CityClinic", subtitle: "Free health checkup this week.", bg: "linear-gradient(135deg, #2980b9, #3498db)", icon: "🏥", cta: "Book · 020-2765 4321" },
];

const AD_DURATION = 12000; // 12 seconds per ad

export default function Player() {
  const { screen_id } = useParams();
  const [ads, setAds] = useState(MOCK_ADS);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [time, setTime] = useState(new Date());

  const progressRef = useRef(null);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const controlsTimerRef = useRef(null);

  // Fetch ads from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await API.get(`/screen/${screen_id}/ads`);
        if (res.data?.ads?.length) setAds(res.data.ads);
      } catch {
        // fallback to mock
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchAds, 1200); // simulate load
    return () => clearTimeout(timer);
  }, [screen_id]);

  // Clock
  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Auto-advance ads
  useEffect(() => {
    if (loading || paused || ads.length === 0) return;
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / (AD_DURATION / 100));
      });
    }, 100);

    intervalRef.current = setTimeout(() => {
      setCurrent(prev => (prev + 1) % ads.length);
    }, AD_DURATION);

    return () => {
      clearInterval(progressIntervalRef.current);
      clearTimeout(intervalRef.current);
    };
  }, [current, loading, paused, ads.length]);

  // Controls auto-hide
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const goNext = () => { setCurrent(prev => (prev + 1) % ads.length); setProgress(0); };
  const goPrev = () => { setCurrent(prev => (prev - 1 + ads.length) % ads.length); setProgress(0); };

  const ad = ads[current];

  const formatTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (d) => d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  if (loading) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
          @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        `}</style>
        <div style={{ fontSize: "48px", animation: "pulse 1.5s ease infinite" }}>📺</div>
        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: "700", color: "white" }}>AdMax Player</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
            <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="#1F7A4D" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#666" }}>Loading ads for screen {screen_id}...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", cursor: showControls ? "default" : "none", userSelect: "none" }}
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes slideUp { from{opacity:0; transform:translateY(40px);} to{opacity:1; transform:translateY(0);} }
        @keyframes pulse-ring { 0%{transform:scale(0.95); opacity:0.8;} 100%{transform:scale(1.3); opacity:0;} }
        @keyframes ticker { from{transform:translateX(100vw);} to{transform:translateX(-100%);} }
        @keyframes breathe { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
        @keyframes controls-in { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }

        .ad-scene { animation: fadeIn 0.8s ease; }
        .ad-icon { animation: breathe 3s ease-in-out infinite; }
        .ad-title { animation: slideUp 0.8s ease 0.2s both; }
        .ad-sub { animation: slideUp 0.8s ease 0.35s both; }
        .ad-cta { animation: slideUp 0.8s ease 0.5s both; }
        .controls-fade { animation: controls-in 0.3s ease; }

        .dot-btn {
          width: 10px; height: 10px; border-radius: 50%;
          border: none; cursor: pointer; transition: all 0.2s ease;
        }
        .dot-btn:hover { transform: scale(1.4); }

        .ctrl-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; cursor: pointer; color: white;
          transition: all 0.2s ease; backdrop-filter: blur(8px);
        }
        .ctrl-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
      `}</style>

      {/* ── AD BACKGROUND ── */}
      <div className="ad-scene" key={current} style={{ width: "100%", height: "100%", background: ad?.bg || "#1a1a1a", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        {/* Noise overlay */}
        <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />

        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: "60vw", height: "60vw", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(0,0,0,0.1)", pointerEvents: "none" }} />

        {/* Main content */}
        <div style={{ textAlign: "center", padding: "48px", position: "relative", zIndex: 2, maxWidth: "900px" }}>
          <div className="ad-icon" style={{ fontSize: "clamp(80px, 15vw, 140px)", lineHeight: "1", marginBottom: "32px", display: "block", filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.3))" }}>
            {ad?.icon || "📺"}
          </div>
          <h1 className="ad-title" style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(40px, 8vw, 96px)", fontWeight: "800", color: "white", letterSpacing: "-0.03em", lineHeight: "1.05", marginBottom: "20px", textShadow: "0 4px 32px rgba(0,0,0,0.3)" }}>
            {ad?.title}
          </h1>
          <p className="ad-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(18px, 3vw, 36px)", color: "rgba(255,255,255,0.85)", fontWeight: "400", lineHeight: "1.4", marginBottom: "36px", maxWidth: "700px", margin: "0 auto 36px" }}>
            {ad?.subtitle}
          </p>
          {ad?.cta && (
            <div className="ad-cta" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "100px", padding: "14px 32px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(14px, 2vw, 22px)", fontWeight: "600", color: "white", letterSpacing: "0.01em" }}>{ad.cta}</span>
            </div>
          )}
        </div>

        {/* Media (if URL provided) */}
        {ad?.media_url && ad?.media_type === "image" && (
          <img src={ad.media_url} alt={ad.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
        )}
        {ad?.media_url && ad?.media_type === "video" && (
          <video src={ad.media_url} autoPlay muted loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
        )}
      </div>

      {/* ── TOP BAR (clock + branding) ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "24px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 10, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}>
        {/* Clock */}
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: "800", color: "white", letterSpacing: "-0.03em", lineHeight: "1" }}>
            {formatTime(time)}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(12px, 1.5vw, 18px)", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
            {formatDate(time)}
          </div>
        </div>

        {/* AdMax branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "10px 18px" }}>
          <div style={{ width: "28px", height: "28px", background: "#1F7A4D", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>📺</div>
          <div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "14px", fontWeight: "800", color: "white", letterSpacing: "-0.01em" }}>AdMax</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Screen #{screen_id}</div>
          </div>
          {/* Live dot */}
          <div style={{ position: "relative", marginLeft: "4px" }}>
            <div style={{ position: "absolute", inset: 0, background: "#22c55e", borderRadius: "50%", animation: "pulse-ring 1.5s ease-out infinite" }} />
            <div style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", position: "relative" }} />
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR (progress + ticker) ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        {/* Ticker */}
        <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", padding: "10px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0", whiteSpace: "nowrap", animation: "ticker 30s linear infinite" }}>
            {[...ads, ...ads].map((a, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.7)", paddingRight: "60px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>{a.icon}</span>
                <span>{a.title}</span>
                <span style={{ color: "rgba(255,255,255,0.3)"}}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
          <div style={{ height: "100%", background: "#1F7A4D", width: `${progress}%`, transition: "width 0.1s linear", boxShadow: "0 0 8px rgba(31,122,77,0.8)" }} />
        </div>

        {/* Ad counter */}
        <div style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {ads.map((_, i) => (
              <button key={i} className="dot-btn"
                onClick={() => { setCurrent(i); setProgress(0); }}
                style={{ background: i === current ? "#1F7A4D" : "rgba(255,255,255,0.25)", width: i === current ? "24px" : "8px", height: "8px", borderRadius: "4px" }}
              />
            ))}
          </div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            {current + 1} / {ads.length}
          </span>
        </div>
      </div>

      {/* ── CONTROLS OVERLAY (mouse hover) ── */}
      {showControls && (
        <div className="controls-fade" style={{ position: "absolute", top: "50%", left: 0, right: 0, transform: "translateY(-50%)", display: "flex", justifyContent: "space-between", padding: "0 32px", zIndex: 20, pointerEvents: "none" }}>
          <button className="ctrl-btn" onClick={goPrev} style={{ pointerEvents: "all" }}>◀</button>
          <button className="ctrl-btn" onClick={() => setPaused(p => !p)} style={{ pointerEvents: "all", width: "56px", height: "56px", fontSize: "20px" }}>
            {paused ? "▶" : "⏸"}
          </button>
          <button className="ctrl-btn" onClick={goNext} style={{ pointerEvents: "all" }}>▶</button>
        </div>
      )}

      {/* Paused overlay */}
      {paused && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 15, backdropFilter: "blur(4px)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px", marginBottom: "12px" }}>⏸</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "24px", fontWeight: "700", color: "white" }}>Paused</div>
            <button className="ctrl-btn" onClick={() => setPaused(false)} style={{ margin: "20px auto 0", width: "auto", padding: "12px 28px", fontSize: "15px", fontFamily: "'DM Sans', sans-serif", fontWeight: "700" }}>
              ▶ Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}