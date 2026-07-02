import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { getRoleHome } from "../utils/auth";
import { images } from "../constants/images";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const user = {
        ...res.data.user,
        role:
          res.data.user?.role ||
          (email.includes("admin@") ? "admin" : email.includes("partner@") ? "partner" : "advertiser"),
      };
      login(res.data.token, user);
      toast.success("Welcome back!");
      navigate(getRoleHome(user.role));
    } catch {
      setErrors({ form: "Invalid email or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={images.auth.login}
          alt="Local business advertising"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 to-dark/40" />
        <div className="absolute bottom-12 left-12 max-w-md text-white">
          <img src={images.logo} alt="" className="mb-6 h-12 w-12 rounded-xl" />
          <h2 className="font-display text-4xl font-bold">Reach customers next door</h2>
          <p className="mt-3 text-lg text-gray-300">
            Run hyperlocal campaigns on screens where your audience already spends time.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <img src={images.logo} alt="AdMax" className="h-8 w-8 rounded-lg" />
            <span className="font-display text-xl font-bold">AdMax India</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-dark">Sign in</h1>
          <p className="mt-2 text-gray-500">
            New here?{" "}
            <Link to="/register" className="font-semibold text-admax-green hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            {errors.form && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {errors.form}
              </p>
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@business.com"
            />
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 pr-11 text-sm outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-admax-green focus:ring-admax-green/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Demo: use <span className="font-mono">admin@admax.in</span> or{" "}
            <span className="font-mono">partner@admax.in</span> for role-based dashboards
          </p>
        </div>
      </div>
    </div>
  );
}
