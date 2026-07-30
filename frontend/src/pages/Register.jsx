import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { images } from "../constants/images";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import OAuthButtons from "../components/OAuthButtons";

const CATEGORIES = [
  "Restaurant",
  "Gym",
  "Salon",
  "Hospital",
  "Pharmacy",
  "Cafe",
  "Dental",
  "Retail",
];

const ACCOUNT_TYPES = [
  { value: "advertiser", label: "Advertiser", desc: "Run ads on nearby screens" },
  { value: "partner", label: "Screen Partner", desc: "Host a screen and earn revenue" },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "advertiser",
    businessName: "",
    category: "",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validateStep1 = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "At least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next = {};
    if (!form.businessName.trim()) next.businessName = "Business name is required";
    if (!form.category) next.category = "Select a category";
    if (!form.city.trim()) next.city = "City is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.accountType,
        business_name: form.businessName,
        category: form.category,
        location: form.city,
      });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      setErrors({
        form: err?.response?.data?.message || "Registration failed. Email may already be in use.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col justify-center px-4 pb-12 pt-16 sm:px-8 lg:px-12 lg:py-12">
        <div className="absolute left-4 top-4">
          <BackButton mode="home" variant="pill" />
        </div>
        <Logo size="lg" className="mb-8" />

        <div className="mb-6 flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${step >= s ? "bg-admax-green" : "bg-gray-200"}`}
            />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 className="font-display text-3xl font-bold">Create account</h1>
            <p className="mt-2 text-gray-500">Join India&apos;s hyperlocal ad network</p>
            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateStep1()) setStep(2);
              }}
              noValidate
            >
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Account type</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ACCOUNT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("accountType", t.value)}
                      className={`rounded-xl border p-4 text-left transition ${
                        form.accountType === t.value
                          ? "border-admax-green bg-admax-green-light"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-semibold text-dark">{t.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={errors.password}
                hint="Minimum 8 characters"
              />
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
            <OAuthButtons />
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-bold">Business details</h1>
            <p className="mt-2 text-gray-500">Tell us about your business</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              {errors.form && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
              )}
              <Input
                label="Business name"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                error={errors.businessName}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-300 focus:border-admax-green focus:ring-admax-green/20"
                  }`}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.category}</p>
                )}
              </div>
              <Input
                label="City"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                error={errors.city}
              />
              <Input
                label="Phone (optional)"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  Create account
                </Button>
              </div>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-admax-green hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={images.auth.register}
          alt="Business team planning"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-dark/80 to-transparent" />
      </div>
    </div>
  );
}
