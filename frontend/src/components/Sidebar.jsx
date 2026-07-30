import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Image,
  Monitor,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Shield,
  Store,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { images } from "../constants/images";
import Logo from "./Logo";

const advertiserNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Megaphone, label: "Campaigns", path: "/campaigns" },
  { icon: Image, label: "My Ads", path: "/ads" },
  { icon: Monitor, label: "Screens", path: "/screens" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: CreditCard, label: "Billing", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const partnerNav = [
  { icon: Store, label: "Partner Hub", path: "/partner" },
  { icon: Monitor, label: "My Screens", path: "/screens" },
  { icon: CreditCard, label: "Earnings", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminNav = [
  { icon: Shield, label: "Admin", path: "/admin" },
  { icon: Monitor, label: "Screens", path: "/screen-map" },
  { icon: Megaphone, label: "Campaigns", path: "/campaigns" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const navItems = role === "admin" ? adminNav : role === "partner" ? partnerNav : advertiserNav;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-800 bg-dark text-white">
      <div className="border-b border-gray-800 p-4">
        <div className="mb-4">
          <Logo size="xl" darkBg className="mx-auto" />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {navItems.map((item) => {
          const active = activePage === item.path;
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-admax-green text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <ItemIcon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-gray-800 p-4">
        <div className="mb-3 flex items-center gap-3">
          <img
            src={user?.avatar_url || images.placeholder.avatar}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name || "User"}</p>
            <p className="truncate text-xs capitalize text-gray-500">{role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
