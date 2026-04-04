import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

// ── Sidebar (consistent with Dashboard) ─────────────────────────
const navItems = [
  { icon: "⚡", label: "Dashboard", path: "/dashboard" },
  { icon: "📣", label: "Campaigns", path: "/campaigns" },
  { icon: "🖼️", label: "My Ads", path: "/ads", active: true },
  { icon: "📺", label: "Screens", path: "/screens" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
  { icon: "💳", label: "Billing", path: "/billing" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("token"); navigate("/login"); };
  return (
    <div style={{ width: "240px", minHeight: "100vh", background: "white", borderRight: "1px solid #f0f0f0", display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0 }}>
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
          <Link key={item.label} to={item.path} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", textDecoration: "none", background: item.active ? "#EAF7EF" : "transparent", color: item.active ? "#1F7A4D" : "#555", fontWeight: item.active ? "700" : "500", fontSize: "14px", transition: "all 0.18s ease" }}
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
        <button onClick={handleLogout} style={{ width: "100%", background: "none", border: "none", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", color: "#888", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: "500", transition: "all 0.18s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}
        >
          <span>🚪</span> Log out
        </button>
      </div>
    </div>
  );
}

const ACCEPTED = { "image/jpeg": "JPG", "image/png": "PNG", "video/mp4": "MP4" };
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function UploadAd() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(15);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Existing ads mock (replace with API)
  const existingAds = [
    { id: 1, title: "Summer Promo", type: "image", status: "active", views: "2.4k", thumb: "🍕" },
    { id: 2, title: "Grand Opening", type: "video", status: "active", views: "5.1k", thumb: "🎉" },
    { id: 3, title: "Weekend Deal", type: "image", status: "pending", views: "—", thumb: "🛍️" },
  ];

  const validateFile = (f) => {
    if (!ACCEPTED[f.type]) { setError("Only JPG, PNG, and MP4 files are allowed."); return false; }
    if (f.size > MAX_SIZE) { setError("File size must be under 50MB."); return false; }
    return true;
  };

  const handleFile = (f) => {
    setError("");
    if (!validateFile(f)) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview({ url, type: f.type.startsWith("video") ? "video" : "image" });
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file to upload."); return; }
    if (!title.trim()) { setError("Please enter an ad title."); return; }
    setUploading(true);
    setProgress(0);
    setError("");

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title);
    formData.append("duration", duration);

    try {
      await API.post("/ads/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setTitle(""); setDuration(15);
    setProgress(0); setSuccess(false); setError("");
  };

  const inputStyle = (name) => ({
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    border: `1.5px solid ${focused === name ? "#1F7A4D" : "#e5e7eb"}`,
    fontSize: "14px", color: "#111", outline: "none",
    background: focused === name ? "#f9fffe" : "white",
    transition: "all 0.2s ease", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: focused === name ? "0 0 0 4px rgba(31,122,77,0.08)" : "none",
  });

  const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "6px", display: "block", letterSpacing: "-0.01em" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafb", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        @keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes progress-fill { from{width:0%;} to{width:100%;} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .success-anim { animation: scaleIn 0.4s ease both; }
        .error-shake { animation: shake 0.4s ease; }
        .drop-zone { transition: all 0.25s ease; }
        .drop-zone:hover { border-color: #1F7A4D !important; background: #f9fffe !important; }
        .submit-btn { background:#1F7A4D; color:white; border:none; padding:15px 32px; border-radius:12px; font-size:15px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.25s ease; display:inline-flex; align-items:center; gap:8px; }
        .submit-btn:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(31,122,77,0.3); }
        .submit-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .ad-card { background:white; border:1px solid #efefef; border-radius:16px; padding:16px; display:flex; align-items:center; gap:14px; transition:all 0.2s ease; }
        .ad-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.07); }
      `}</style>

      <Sidebar />

      <div style={{ flex: 1, padding: "36px 48px", overflowY: "auto" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
          <Link to="/ads" style={{ color: "#aaa", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}
            onMouseEnter={e => e.currentTarget.style.color = "#555"}
            onMouseLeave={e => e.currentTarget.style.color = "#aaa"}
          >← My Ads</Link>
          <span style={{ color: "#e5e7eb" }}>/</span>
          <span style={{ fontSize: "14px", color: "#333", fontWeight: "600" }}>Upload New Ad</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "28px", maxWidth: "1100px" }}>

          {/* ── LEFT: Upload form ── */}
          <div>
            <div style={{ marginBottom: "28px" }}>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "26px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.025em", marginBottom: "6px" }}>Upload Ad Creative</h1>
              <p style={{ fontSize: "14px", color: "#888" }}>Upload an image or video that will display on AdMax screens.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-shake" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                <span>⚠️</span>
                <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "500" }}>{error}</span>
              </div>
            )}

            {!success ? (
              <form onSubmit={handleSubmit}>

                {/* Drop Zone */}
                <div
                  ref={dropRef}
                  className="drop-zone"
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? "#1F7A4D" : file ? "#1F7A4D" : "#d1d5db"}`,
                    borderRadius: "20px",
                    padding: "40px 24px",
                    textAlign: "center",
                    cursor: file ? "default" : "pointer",
                    background: dragging ? "#f0faf5" : file ? "#f9fffe" : "white",
                    marginBottom: "24px",
                    transition: "all 0.25s ease",
                  }}
                >
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.mp4" style={{ display: "none" }}
                    onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />

                  {!file ? (
                    <>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>☁️</div>
                      <p style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "6px" }}>
                        Drop your file here
                      </p>
                      <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>or click to browse</p>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                        {["JPG", "PNG", "MP4"].map(f => (
                          <span key={f} style={{ background: "#EAF7EF", color: "#1F7A4D", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "100px" }}>{f}</span>
                        ))}
                        <span style={{ background: "#f3f4f6", color: "#888", fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "100px" }}>Max 50MB</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      {/* Preview */}
                      <div style={{ marginBottom: "16px" }}>
                        {preview?.type === "image" ? (
                          <img src={preview.url} alt="preview" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "12px", objectFit: "contain" }} />
                        ) : (
                          <video src={preview.url} controls style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "12px" }} />
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111" }}>{file.name}</span>
                        <span style={{ background: "#EAF7EF", color: "#1F7A4D", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "100px" }}>
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <button type="button" onClick={e => { e.stopPropagation(); reset(); }} style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ad Details */}
                <div style={{ background: "white", border: "1px solid #efefef", borderRadius: "20px", padding: "28px", marginBottom: "20px" }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "16px", fontWeight: "800", color: "#0a0a0a", marginBottom: "20px", letterSpacing: "-0.01em" }}>Ad Details</h3>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={labelStyle}>Ad Title *</label>
                    <input placeholder='e.g. "Summer Pizza Offer"' value={title}
                      onChange={e => setTitle(e.target.value)} required
                      style={inputStyle("title")}
                      onFocus={() => setFocused("title")} onBlur={() => setFocused(null)} />
                  </div>

                  <div>
                    <label style={labelStyle}>Display Duration</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                      {[10, 15, 20, 30].map(sec => (
                        <button key={sec} type="button"
                          onClick={() => setDuration(sec)}
                          style={{
                            padding: "12px", borderRadius: "12px", border: "1.5px solid",
                            borderColor: duration === sec ? "#1F7A4D" : "#e5e7eb",
                            background: duration === sec ? "#EAF7EF" : "white",
                            color: duration === sec ? "#1F7A4D" : "#555",
                            fontWeight: duration === sec ? "700" : "500",
                            fontSize: "14px", cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "all 0.18s ease",
                          }}>
                          {sec}s
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "#aaa", marginTop: "8px" }}>How long your ad displays before rotating to the next.</p>
                  </div>
                </div>

                {/* Upload progress */}
                {uploading && (
                  <div style={{ background: "white", border: "1px solid #efefef", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Uploading...</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#1F7A4D" }}>{progress}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #1F7A4D, #2FA36B)", borderRadius: "3px", width: `${progress}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={uploading || !file}>
                  {uploading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Uploading...
                    </>
                  ) : "☁️ Upload Ad"}
                </button>
              </form>
            ) : (
              // Success
              <div className="success-anim" style={{ background: "white", border: "1px solid #efefef", borderRadius: "24px", padding: "56px 36px", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", background: "#EAF7EF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", margin: "0 auto 24px", boxShadow: "0 0 0 14px rgba(31,122,77,0.06)" }}>✅</div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: "800", color: "#0a0a0a", marginBottom: "10px" }}>Ad uploaded!</h2>
                <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", maxWidth: "300px", margin: "0 auto 28px" }}>
                  <strong>{title}</strong> has been submitted. It will be reviewed and go live within 24 hours.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <Link to="/campaigns/new" style={{ background: "#1F7A4D", color: "white", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
                    Create Campaign →
                  </Link>
                  <button onClick={reset} style={{ background: "white", color: "#555", border: "1.5px solid #e5e7eb", padding: "11px 22px", borderRadius: "12px", fontWeight: "600", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Upload another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Tips + Existing Ads ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Format tips */}
            <div style={{ background: "white", border: "1px solid #efefef", borderRadius: "20px", padding: "24px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: "800", color: "#0a0a0a", marginBottom: "16px", letterSpacing: "-0.01em" }}>📋 Ad Specs</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { fmt: "JPG / PNG", spec: "1920×1080px recommended", icon: "🖼️" },
                  { fmt: "MP4 Video", spec: "Max 30s · H.264 codec", icon: "🎬" },
                  { fmt: "Aspect Ratio", spec: "16:9 landscape only", icon: "📐" },
                  { fmt: "File Size", spec: "Maximum 50MB", icon: "📦" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px" }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#111" }}>{s.fmt}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{s.spec}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{ background: "#EAF7EF", border: "1px solid rgba(31,122,77,0.15)", borderRadius: "20px", padding: "24px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: "800", color: "#1F7A4D", marginBottom: "14px" }}>💡 Tips for better ads</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Keep text large — screens are viewed from a distance",
                  "Use your brand colours prominently",
                  "Add a clear call-to-action (e.g. 'Visit us today!')",
                  "Include your phone number or address",
                  "Bright, high-contrast visuals perform best",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "#1F7A4D", fontWeight: "700", fontSize: "12px", marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "13px", color: "#2d6a47", lineHeight: "1.5" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Existing ads */}
            <div style={{ background: "white", border: "1px solid #efefef", borderRadius: "20px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px", fontWeight: "800", color: "#0a0a0a", letterSpacing: "-0.01em" }}>My Ads</h3>
                <Link to="/ads" style={{ fontSize: "13px", color: "#1F7A4D", fontWeight: "600", textDecoration: "none" }}>View all →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {existingAds.map((ad) => (
                  <div key={ad.id} className="ad-card">
                    <div style={{ width: "40px", height: "40px", background: "#EAF7EF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{ad.thumb}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ad.title}</div>
                      <div style={{ fontSize: "11px", color: "#aaa" }}>{ad.type.toUpperCase()} · {ad.views} views</div>
                    </div>
                    <span style={{
                      fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "100px",
                      background: ad.status === "active" ? "#dcfce7" : "#fef9c3",
                      color: ad.status === "active" ? "#16a34a" : "#ca8a04",
                    }}>{ad.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}