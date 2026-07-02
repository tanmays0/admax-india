import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, MonitorOff } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";

const quickLinks = [
  { label: "Campaigns", to: "/campaigns" },
  { label: "Screen Map", to: "/screen-map" },
  { label: "Pricing", to: "/pricing" },
  { label: "Help Center", to: "/help" },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-dark px-4 py-20">
        <div className="pointer-events-none absolute right-0 top-0 h-3/5 w-2/5 bg-admax-green opacity-[0.04] [clip-path:polygon(20%_0,100%_0,100%_100%,0_80%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-[35%] bg-admax-orange opacity-[0.03] [clip-path:polygon(0_20%,100%_0,80%_100%,0_100%)]" />

        <div className="relative max-w-lg text-center">
          <div className="relative mb-2">
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(7rem,20vw,12rem)] font-bold leading-none tracking-tighter text-white opacity-[0.06]">
              404
            </span>
            <p className="relative font-display text-[clamp(4rem,12vw,7rem)] font-bold leading-none tracking-tighter text-white">
              4<span className="text-admax-green">0</span>4
            </p>
          </div>

          <div className="mx-auto mb-8 h-0.5 w-12 bg-admax-green" />

          <div className="mb-4 flex justify-center">
            <MonitorOff className="h-10 w-10 text-gray-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white lg:text-3xl">
            This screen is offline
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get
            you back to where the action is.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Button variant="secondary" className="gap-2 border-gray-600 bg-transparent text-gray-400 hover:bg-white/10 hover:text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="mt-16 border-t border-gray-800 pt-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-600">
              Useful Links
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {quickLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-gray-500 transition hover:text-admax-green"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
