import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { images } from "../constants/images";

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-dark text-gray-400">
        <div className="container-page grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <img src={images.logo} alt="" className="h-8 w-8 rounded-lg" />
              <span className="font-display text-lg font-bold text-white">AdMax India</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Hyperlocal digital advertising for Indian businesses. Reach customers where they live,
              work, and spend time.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/pricing", "Pricing"],
                ["/screen-map", "Screen Map"],
                ["/case-studies", "Case Studies"],
                ["/api-docs", "API Docs"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-admax-green">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/about", "About"],
                ["/services", "Services"],
                ["/blog", "Blog"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-admax-green">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/terms", "Terms"],
                ["/privacy", "Privacy"],
                ["/refund-policy", "Refund Policy"],
                ["/ad-guidelines", "Ad Guidelines"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-admax-green">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-xs">
          © {new Date().getFullYear()} AdMax India. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
