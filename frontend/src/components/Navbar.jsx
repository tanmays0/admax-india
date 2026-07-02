import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/auth";
import { images } from "../constants/images";
import Button from "./ui/Button";

const links = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={images.logo} alt="AdMax India" className="h-9 w-9 rounded-lg" />
            <div>
              <div className="font-display text-lg font-extrabold tracking-tight text-dark">
                AdMax
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-widest text-admax-green">
                India
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link">
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link to={getRoleHome(role)}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-admax-green hover:underline">
                  Log in
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          <button
            type="button"
            className="rounded-lg p-2 text-gray-600 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link to={getRoleHome(role)} onClick={() => setOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
