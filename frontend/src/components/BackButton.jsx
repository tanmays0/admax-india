import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useBackNavigation from "../hooks/useBackNavigation";

const baseClass =
  "inline-flex items-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admax-green focus-visible:ring-offset-2";

const variants = {
  light: "text-gray-600 hover:bg-gray-100 hover:text-admax-green px-3 py-2",
  dark: "text-white/90 hover:bg-white/10 hover:text-white px-3 py-2",
  pill: "border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm hover:border-admax-green hover:text-admax-green",
};

export default function BackButton({ mode = "history", variant = "light", className = "", label }) {
  const { goBack, isHome } = useBackNavigation();

  if (mode === "history" && isHome) return null;

  if (mode === "home") {
    return (
      <Link to="/" className={`${baseClass} ${variants[variant]} ${className}`}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {label ?? "Back to home"}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label ?? "Back"}
    </button>
  );
}
