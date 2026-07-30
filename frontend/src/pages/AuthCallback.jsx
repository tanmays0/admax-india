import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/auth";
import Logo from "../components/Logo";

function decodeUser(encoded) {
  if (!encoded) return null;
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    const error = params.get("error");
    const token = params.get("token");
    const user = decodeUser(params.get("user"));

    if (error) {
      setMessage(error);
      toast.error(error);
      const timer = setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => clearTimeout(timer);
    }

    if (!token || !user) {
      setMessage("Invalid OAuth response");
      toast.error("Sign-in failed. Please try again.");
      const timer = setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => clearTimeout(timer);
    }

    login(token, user);
    toast.success("Welcome!");
    navigate(getRoleHome(user.role), { replace: true });
  }, [login, navigate, params]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4">
      <Logo size="lg" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
