import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, CheckCircle2, Monitor } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { images } from "../constants/images";
import API from "../services/api";

const steps = ["Screen Info", "Location & Access", "Submit"];

const initialForm = {
  screenCount: "1",
  screenType: "",
  screenSize: "",
  resolution: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  connectivity: "",
  powerSupply: "",
  accessType: "",
  ownerName: "",
  email: "",
  phone: "",
  businessName: "",
  monthlyFootfall: "",
  primaryAudience: "",
  terms: false,
};

function SelectField({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const selectClass = (hasError) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-admax-green focus:ring-admax-green/20"
  }`;

export default function PartnerApplication() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.screenType) e.screenType = "Required";
      if (!form.screenSize) e.screenSize = "Required";
    }
    if (step === 1) {
      if (!form.address.trim()) e.address = "Required";
      if (!form.city.trim()) e.city = "Required";
      if (!form.pincode.trim()) e.pincode = "Required";
    }
    if (step === 2) {
      if (!form.ownerName.trim()) e.ownerName = "Required";
      if (!form.email.trim()) e.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
      if (!form.phone.trim()) e.phone = "Required";
      if (!form.terms) e.terms = "Please accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => s + 1);
  };
  const back = () => setStep((s) => s - 1);
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await API.post("/partner-applications", form);
      setApplicationId(res.data.applicationCode || `ADX-${Date.now().toString().slice(-8)}`);
      setSubmitted(true);
      toast.success("Application submitted");
    } catch {
      // interceptor toast
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="flex min-h-[70vh] items-center justify-center bg-dark px-4 py-20">
          <div className="max-w-md text-center">
            <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-admax-green" />
            <h2 className="font-display text-3xl font-bold text-white">Application Received</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-400">
              Our partner team will review your screen details and reach out within 2–3 business
              days.
            </p>
            <div className="mt-8 rounded-xl bg-gray-900 p-6 text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Application ID
              </div>
              <div className="mt-2 font-mono text-lg font-bold text-admax-green">
                {String(applicationId).startsWith("ADX-") ? applicationId : `ADX-${applicationId}`}
              </div>
            </div>
            <Link to="/" className="mt-8 inline-block">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-dark py-14 lg:py-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-2/5 bg-admax-green opacity-[0.04] [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" />
        <div className="container-page relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-admax-green">
            Screen Partner Program
          </p>
          <h1 className="font-display text-3xl font-bold text-white lg:text-5xl">
            Apply to List Your Screen
          </h1>
          <p className="mt-3 text-base text-gray-400">
            Turn your display into a revenue stream. 3-minute application.
          </p>
        </div>
      </section>

      <div className="border-b border-gray-200 bg-white">
        <div className="container-page flex overflow-x-auto">
          {steps.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-3 py-5 pr-8 ${i <= step ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold ${
                  i <= step ? "bg-dark text-admax-green" : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-sm font-semibold ${
                  i === step ? "text-dark" : "text-gray-400"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <span className="ml-4 hidden h-px w-10 bg-gray-200 sm:block" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl">
            {step === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8">
                <h2 className="mb-8 font-display text-xl font-bold text-dark">
                  Tell us about your screen
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <SelectField label="Number of Screens">
                    <select
                      value={form.screenCount}
                      onChange={(e) => set("screenCount", e.target.value)}
                      className={selectClass(false)}
                    >
                      {["1", "2", "3", "4", "5", "6-10", "10+"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <SelectField label="Screen Type *" error={errors.screenType}>
                    <select
                      value={form.screenType}
                      onChange={(e) => set("screenType", e.target.value)}
                      className={selectClass(errors.screenType)}
                    >
                      <option value="">Select type</option>
                      {[
                        "LED Billboard",
                        "LCD Indoor",
                        "LED Indoor",
                        "Kiosk",
                        "Transparent LED",
                        "Other",
                      ].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <SelectField label="Screen Size *" error={errors.screenSize}>
                    <select
                      value={form.screenSize}
                      onChange={(e) => set("screenSize", e.target.value)}
                      className={selectClass(errors.screenSize)}
                    >
                      <option value="">Select size</option>
                      {['< 32"', '32"–55"', '55"–80"', '80"–120"', '> 120" / Billboard'].map(
                        (v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        )
                      )}
                    </select>
                  </SelectField>
                  <SelectField label="Resolution">
                    <select
                      value={form.resolution}
                      onChange={(e) => set("resolution", e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select resolution</option>
                      {["HD (1280×720)", "Full HD (1920×1080)", "4K (3840×2160)", "Custom"].map(
                        (v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        )
                      )}
                    </select>
                  </SelectField>
                  <SelectField label="Monthly Footfall (est.)">
                    <select
                      value={form.monthlyFootfall}
                      onChange={(e) => set("monthlyFootfall", e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select range</option>
                      {["< 1,000", "1k–5k", "5k–20k", "20k–100k", "100k+"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <SelectField label="Primary Audience">
                    <select
                      value={form.primaryAudience}
                      onChange={(e) => set("primaryAudience", e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select audience</option>
                      {[
                        "General Public",
                        "Office Workers",
                        "Shoppers / Retail",
                        "Students",
                        "Travelers",
                        "Residents",
                      ].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8">
                <h2 className="mb-8 font-display text-xl font-bold text-dark">
                  Location & Access Details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address *"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="Building name, street"
                      error={errors.address}
                    />
                  </div>
                  <Input
                    label="City *"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Mumbai"
                    error={errors.city}
                  />
                  <Input
                    label="State"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    placeholder="Maharashtra"
                  />
                  <Input
                    label="Pincode *"
                    value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value)}
                    placeholder="400001"
                    error={errors.pincode}
                  />
                  <SelectField label="Internet Connectivity">
                    <select
                      value={form.connectivity}
                      onChange={(e) => set("connectivity", e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select</option>
                      {["Broadband (Wired)", "4G / 5G", "WiFi", "No connectivity"].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <SelectField label="Power Supply">
                    <select
                      value={form.powerSupply}
                      onChange={(e) => set("powerSupply", e.target.value)}
                      className={selectClass(false)}
                    >
                      <option value="">Select</option>
                      {[
                        "24/7 Stable",
                        "Business Hours Only",
                        "Solar Hybrid",
                        "Generator Backup",
                      ].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </SelectField>
                  <div className="sm:col-span-2">
                    <SelectField label="Content Update Access">
                      <select
                        value={form.accessType}
                        onChange={(e) => set("accessType", e.target.value)}
                        className={selectClass(false)}
                      >
                        <option value="">Select</option>
                        {["Remote (API / CMS)", "USB / Manual", "Technician Visit Required"].map(
                          (v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          )
                        )}
                      </select>
                    </SelectField>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="rounded-xl border border-gray-200 bg-white p-8">
                <h2 className="mb-8 font-display text-xl font-bold text-dark">
                  Your Contact Information
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Full Name *"
                    value={form.ownerName}
                    onChange={(e) => set("ownerName", e.target.value)}
                    placeholder="Rajesh Kumar"
                    error={errors.ownerName}
                  />
                  <Input
                    label="Business Name"
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    placeholder="Kumar Media Pvt Ltd"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    error={errors.email}
                  />
                  <Input
                    label="Phone *"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    error={errors.phone}
                  />
                </div>

                <div className="mt-6 border-l-[3px] border-admax-green bg-gray-50 p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Application Summary
                  </p>
                  {[
                    ["Screens", `${form.screenCount} × ${form.screenType || "—"}`],
                    ["Size", form.screenSize || "—"],
                    ["Location", form.city ? `${form.city}, ${form.state}` : "—"],
                    ["Monthly Footfall", form.monthlyFootfall || "—"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between border-b border-gray-200 py-2 text-sm last:border-b-0"
                    >
                      <span className="text-gray-500">{k}</span>
                      <span className="font-semibold text-dark">{v}</span>
                    </div>
                  ))}
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-admax-green focus:ring-admax-green"
                  />
                  <span className="text-sm leading-relaxed text-gray-500">
                    I agree to AdMax&apos;s{" "}
                    <Link to="/terms" className="font-semibold text-admax-green hover:underline">
                      Partner Terms
                    </Link>{" "}
                    and confirm the screen details are accurate.
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-2 text-xs text-red-600" role="alert">
                    {errors.terms}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 0 ? (
                <Button type="button" variant="secondary" onClick={back} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < 2 ? (
                <Button type="button" onClick={next} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={submit} loading={submitting}>
                  Submit Application
                </Button>
              )}
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-xl lg:block">
            <img
              src={images.partner.apply}
              alt="Digital screen in venue"
              className="h-full min-h-[480px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
            <div className="absolute bottom-0 p-8 text-white">
              <Monitor className="mb-3 h-8 w-8 text-admax-green" />
              <p className="font-display text-xl font-bold">Earn from your screen</p>
              <p className="mt-2 text-sm text-gray-300">
                Partners earn an average of ₹12,000 per screen per month with AdMax India.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
