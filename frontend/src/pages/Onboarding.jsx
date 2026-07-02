import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Dumbbell,
  Package,
  Phone,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Target,
  UtensilsCrossed,
} from "lucide-react";
import API from "../services/api";
import { images } from "../constants/images";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const steps = [
  { id: 1, title: "Business Info", icon: Building2 },
  { id: 2, title: "Contact Details", icon: Phone },
  { id: 3, title: "Business Type", icon: Target },
  { id: 4, title: "Verification", icon: CheckCircle2 },
];

const businessTypes = [
  {
    id: "restaurant",
    name: "Restaurant/Cafe",
    icon: UtensilsCrossed,
    image: images.categories.restaurant,
    desc: "Food & beverage businesses",
  },
  {
    id: "gym",
    name: "Gym/Fitness",
    icon: Dumbbell,
    image: images.categories.gym,
    desc: "Fitness centers & studios",
  },
  {
    id: "salon",
    name: "Salon/Spa",
    icon: Scissors,
    image: images.categories.salon,
    desc: "Beauty & wellness services",
  },
  {
    id: "clinic",
    name: "Clinic/Hospital",
    icon: Stethoscope,
    image: images.categories.hospital,
    desc: "Healthcare facilities",
  },
  {
    id: "retail",
    name: "Retail Store",
    icon: ShoppingBag,
    image: images.categories.retail,
    desc: "Shops & boutiques",
  },
  {
    id: "other",
    name: "Other",
    icon: Package,
    image: images.categories.cafe,
    desc: "Other business types",
  },
];

const selectClass = (hasError) =>
  `w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
      : "border-gray-300 focus:border-admax-green focus:ring-admax-green/20"
  }`;

const progressWidth = { 1: "w-0", 2: "w-1/3", 3: "w-2/3", 4: "w-full" };

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    businessName: "",
    businessCategory: "",
    gst: "",
    address: "",
    city: "",
    pincode: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    targetAudience: "",
    monthlyBudget: "",
    agreeTerms: false,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.businessName.trim()) e.businessName = "Business name is required";
      if (!formData.businessCategory) e.businessCategory = "Select a category";
      if (!formData.address.trim()) e.address = "Address is required";
      if (!formData.city.trim()) e.city = "City is required";
      if (!formData.pincode.trim()) e.pincode = "Pincode is required";
    }
    if (step === 2) {
      if (!formData.contactPerson.trim()) e.contactPerson = "Contact name is required";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
      if (!formData.phone.trim()) e.phone = "Phone is required";
    }
    if (step === 3) {
      if (!formData.businessType) e.businessType = "Select a business type";
      if (!formData.targetAudience.trim()) e.targetAudience = "Describe your target audience";
      if (!formData.monthlyBudget) e.monthlyBudget = "Select a budget range";
    }
    if (step === 4) {
      if (!formData.agreeTerms) e.agreeTerms = "You must accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      await API.post("/onboarding/complete", formData);
      toast.success("Onboarding complete! Welcome to AdMax.");
      navigate("/dashboard");
    } catch {
      toast.error("Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={images.logo} alt="AdMax" className="h-10 w-10 rounded-lg" />
            <div>
              <div className="font-display text-lg font-extrabold text-dark">AdMax India</div>
              <div className="text-xs text-gray-500">Business Onboarding</div>
            </div>
          </Link>
          <div className="text-sm text-gray-500">
            Step{" "}
            <span className="font-mono font-bold text-admax-green">{currentStep}</span> of 4
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
          <div className="relative flex justify-between">
            <div className="absolute left-10 right-10 top-5 h-0.5 bg-gray-200">
              <div
                className={`h-full bg-admax-green transition-all duration-300 ${progressWidth[currentStep]}`}
              />
            </div>
            {steps.map((step) => {
              const Icon = step.icon;
              const done = currentStep > step.id;
              const active = currentStep >= step.id;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition ${
                      active
                        ? "border-admax-green bg-admax-green text-white"
                        : "border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span
                    className={`hidden text-xs font-semibold sm:block ${
                      active ? "text-dark" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8">
          {currentStep === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">
                Tell us about your business
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                We&apos;ll use this to personalize your experience
              </p>
              <div className="mt-8 space-y-5">
                <Input
                  label="Business Name *"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  placeholder="e.g. Pizza Palace"
                  error={errors.businessName}
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Business Category *
                  </label>
                  <select
                    value={formData.businessCategory}
                    onChange={(e) => handleChange("businessCategory", e.target.value)}
                    className={selectClass(errors.businessCategory)}
                  >
                    <option value="">Select category</option>
                    <option value="restaurant">Restaurant/Cafe</option>
                    <option value="gym">Gym/Fitness</option>
                    <option value="salon">Salon/Spa</option>
                    <option value="clinic">Clinic/Hospital</option>
                    <option value="retail">Retail Store</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessCategory && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.businessCategory}</p>
                  )}
                </div>
                <Input
                  label="GST Number (Optional)"
                  value={formData.gst}
                  onChange={(e) => handleChange("gst", e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  hint="For invoicing purposes"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Business Address *
                  </label>
                  <textarea
                    placeholder="Street address, building name"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                    className={`${selectClass(errors.address)} resize-y`}
                  />
                  {errors.address && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>
                <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
                  <Input
                    label="City *"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Pune"
                    error={errors.city}
                  />
                  <Input
                    label="Pincode *"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    placeholder="411001"
                    error={errors.pincode}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Contact Information</h2>
              <p className="mt-2 text-sm text-gray-500">How can we reach you?</p>
              <div className="mt-8 space-y-5">
                <Input
                  label="Contact Person Name *"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                  placeholder="Full name"
                  error={errors.contactPerson}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@business.com"
                  error={errors.email}
                />
                <Input
                  label="Phone Number *"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  error={errors.phone}
                />
                <Input
                  label="Website (Optional)"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://yourbusiness.com"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Advertising Goals</h2>
              <p className="mt-2 text-sm text-gray-500">
                Help us recommend the best screens for you
              </p>
              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    What type of business are you advertising? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {businessTypes.map((type) => {
                      const Icon = type.icon;
                      const active = formData.businessType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleChange("businessType", type.id)}
                          className={`overflow-hidden rounded-xl border text-left transition ${
                            active
                              ? "border-admax-green bg-admax-green-light"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={type.image}
                            alt={type.name}
                            className="h-16 w-full object-cover"
                          />
                          <div className="p-3">
                            <Icon
                              className={`mb-1 h-4 w-4 ${
                                active ? "text-admax-green" : "text-gray-400"
                              }`}
                            />
                            <div
                              className={`text-sm font-semibold ${
                                active ? "text-admax-green" : "text-dark"
                              }`}
                            >
                              {type.name}
                            </div>
                            <div className="text-xs text-gray-500">{type.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.businessType && (
                    <p className="mt-2 text-xs text-red-600">{errors.businessType}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Target Audience *
                  </label>
                  <textarea
                    placeholder="e.g. Young professionals, families, fitness enthusiasts..."
                    value={formData.targetAudience}
                    onChange={(e) => handleChange("targetAudience", e.target.value)}
                    rows={3}
                    className={`${selectClass(errors.targetAudience)} resize-y`}
                  />
                  {errors.targetAudience && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.targetAudience}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Monthly Advertising Budget *
                  </label>
                  <select
                    value={formData.monthlyBudget}
                    onChange={(e) => handleChange("monthlyBudget", e.target.value)}
                    className={selectClass(errors.monthlyBudget)}
                  >
                    <option value="">Select budget range</option>
                    <option value="5000">₹5,000 - ₹10,000</option>
                    <option value="10000">₹10,000 - ₹25,000</option>
                    <option value="25000">₹25,000 - ₹50,000</option>
                    <option value="50000">₹50,000+</option>
                  </select>
                  {errors.monthlyBudget && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.monthlyBudget}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="mb-8 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-admax-green" />
                <h2 className="font-display text-2xl font-bold text-dark">Almost there!</h2>
                <p className="mt-2 text-sm text-gray-500">Review and confirm your details</p>
              </div>
              <div className="rounded-xl bg-surface p-6">
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      Business Name
                    </div>
                    <div className="font-semibold text-dark">{formData.businessName}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      Contact
                    </div>
                    <div className="font-semibold text-dark">{formData.email}</div>
                    <div className="text-gray-500">{formData.phone}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-gray-400">
                      Location
                    </div>
                    <div className="text-gray-500">
                      {formData.city}, {formData.pincode}
                    </div>
                  </div>
                </div>
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-admax-green focus:ring-admax-green"
                />
                <span className="text-sm leading-relaxed text-gray-500">
                  I agree to AdMax India&apos;s{" "}
                  <Link to="/terms" className="font-semibold text-admax-green hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="font-semibold text-admax-green hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="mt-2 text-xs text-red-600">{errors.agreeTerms}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3 border-t border-gray-200 pt-8">
            {currentStep > 1 && (
              <Button type="button" variant="secondary" onClick={handleBack} className="flex-1 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} className="flex-1 gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                loading={loading}
                className="flex-1"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
