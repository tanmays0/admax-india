import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateCampaign from "./pages/CreateCampaign";
import UploadAd from "./pages/UploadAd";
import Player from "./pages/Player";

// ── Protected Route Guard ────────────────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ── Guest Route (redirect to dashboard if already logged in) ────
function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* ── PUBLIC WEBSITE ── */}
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/services" element={<Services />} />

        {/* ── AUTH (redirect to dashboard if already logged in) ── */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* ── PROTECTED DASHBOARD ROUTES ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/campaigns/new" element={
          <ProtectedRoute><CreateCampaign /></ProtectedRoute>
        } />
        <Route path="/ads/upload" element={
          <ProtectedRoute><UploadAd /></ProtectedRoute>
        } />

        {/* ── SCREEN PLAYER (no auth needed — runs on TV) ── */}
        <Route path="/player/:screen_id" element={<Player />} />

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;