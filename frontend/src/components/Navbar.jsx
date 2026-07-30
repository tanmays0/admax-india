import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/auth";
import Logo from "./Logo";

const links = [
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { isAuthenticated, role } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to) => pathname === to;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/60 bg-white/90 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="container-page flex h-[4.75rem] items-center justify-between gap-6">
          <Logo size="nav" framed />

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide transition ${
                  isActive(l.to)
                    ? "bg-admax-green/10 text-admax-green"
                    : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <Link
                to={getRoleHome(role)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-admax-green to-admax-green-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-admax-green/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-admax-green/30"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-dark"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-admax-green to-admax-green-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-admax-green/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-admax-green/30"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-100 bg-white/95 px-4 py-5 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(l.to)
                      ? "bg-admax-green-light text-admax-green"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <Link
                    to={getRoleHome(role)}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-admax-green to-admax-green-dark px-5 py-3 text-sm font-semibold text-white"
                  >
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-700"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-admax-green to-admax-green-dark px-5 py-3 text-sm font-semibold text-white"
                    >
                      Get started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      <div className="h-[4.75rem]" aria-hidden="true" />
    </>
  );
}
