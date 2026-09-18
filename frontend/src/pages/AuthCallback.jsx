import { useEffect } from "react";
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

  const error = params.get("error");
  const token = params.get("token");
  const encodedUser = params.get("user");
  const user = decodeUser(encodedUser);

  const message = error ? error : !token || !user ? "Invalid OAuth response" : "Finishing sign-in…";

  useEffect(() => {
    if (error) {
      toast.error(error);
      const timer = setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => clearTimeout(timer);
    }

    const parsedUser = decodeUser(encodedUser);
    if (!token || !parsedUser) {
      toast.error("Sign-in failed. Please try again.");
      const timer = setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => clearTimeout(timer);
    }

    login(token, parsedUser);
    toast.success("Welcome!");
    navigate(getRoleHome(parsedUser.role), { replace: true });
  }, [encodedUser, error, login, navigate, token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4">
      <Logo size="lg" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
