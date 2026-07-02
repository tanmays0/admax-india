import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { getRoleHome } from "./utils/auth";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import UploadAd from "./pages/UploadAd";
import Player from "./pages/Player";
import MyAds from "./pages/MyAds";
import Screens from "./pages/Screens";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import AssignAds from "./pages/AssignAds";
import ScreenMap from "./pages/ScreenMap";
import Onboarding from "./pages/Onboarding";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundPolicy from "./pages/RefundPolicy";
import PaymentSuccess from "./pages/PaymentSuccess";
import HelpCenter from "./pages/HelpCenter";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import PartnerApplication from "./pages/PartnerApplication";
import AdGuidelines from "./pages/AdGuidelines";
import APIDocumentation from "./pages/APIDocumentation";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) {
    return <Navigate to={getRoleHome(role)} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) return <Navigate to={getRoleHome(role)} replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute roles={["advertiser", "admin"]}>
              <Campaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns/new"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <CreateCampaign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ads"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <MyAds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ads/upload"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <UploadAd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/screens"
          element={
            <ProtectedRoute>
              <Screens />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/player/:screen_id" element={<Player />} />

        <Route path="/screen-map" element={<ScreenMap />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/ad-guidelines" element={<AdGuidelines />} />
        <Route path="/api-docs" element={<APIDocumentation />} />
        <Route path="/partner/apply" element={<PartnerApplication />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute roles={["advertiser"]}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partner"
          element={
            <ProtectedRoute roles={["partner"]}>
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns/:id/assign"
          element={
            <ProtectedRoute roles={["advertiser", "admin"]}>
              <AssignAds />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
