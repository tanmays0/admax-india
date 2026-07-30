import { useEffect, useState } from "react";
import API from "../services/api";

function oauthStartUrl(provider) {
  const base = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
  // Prefer absolute backend URL for OAuth so redirects leave the Vite origin cleanly.
  const apiOrigin = (import.meta.env.VITE_API_ORIGIN || "").replace(/\/$/, "");
  if (apiOrigin) {
    return `${apiOrigin}/api/auth/${provider}`;
  }
  return `${base}/auth/${provider}`;
}

export default function OAuthButtons({ className = "" }) {
  const [providers, setProviders] = useState({ google: false, github: false });

  useEffect(() => {
    let cancelled = false;
    API.get("/auth/providers")
      .then((res) => {
        if (!cancelled) setProviders(res.data || {});
      })
      .catch(() => {
        if (!cancelled) setProviders({ google: false, github: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!providers.google && !providers.github) {
    return null;
  }

  return (
    <div className={className}>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-white px-3 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {providers.google && (
          <a
            href={oauthStartUrl("google")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-dark transition hover:border-admax-green hover:text-admax-green"
          >
            <GoogleIcon />
            Google
          </a>
        )}
        {providers.github && (
          <a
            href={oauthStartUrl("github")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-dark transition hover:border-admax-green hover:text-admax-green"
          >
            <GitHubIcon />
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.7 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.8H12z"
      />
      <path
        fill="#34A853"
        d="M3.6 7.4l3 2.2C7.5 7.5 9.6 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.7 14.6 2.7 12 2.7 8.3 2.7 5.1 4.8 3.6 7.4z"
      />
      <path
        fill="#4A90E2"
        d="M12 21.3c2.5 0 4.6-.8 6.1-2.2l-2.9-2.2c-.8.6-1.9 1-3.2 1-3.5 0-6.5-2.4-7.5-5.6l-3 2.3C3.1 18.9 7.2 21.3 12 21.3z"
      />
      <path
        fill="#FBBC05"
        d="M4.5 12c0-.8.1-1.5.4-2.2l-3-2.3C1.3 9 1 10.5 1 12s.3 3 1 4.5l3-2.3c-.3-.7-.5-1.4-.5-2.2z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0112 6.8c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.05 10.05 0 0022 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}
