import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Rocket,
  PartyPopper,
} from "lucide-react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { images } from "../constants/images";

const CATEGORIES = [
  { id: "restaurant", label: "Restaurant", image: images.categories.restaurant },
  { id: "gym", label: "Gym", image: images.categories.gym },
  { id: "salon", label: "Salon", image: images.categories.salon },
  { id: "hospital", label: "Hospital", image: images.categories.hospital },
  { id: "pharmacy", label: "Pharmacy", image: images.categories.pharmacy },
  { id: "cafe", label: "Cafe", image: images.categories.cafe },
  { id: "dental", label: "Dental", image: images.categories.dental },
  { id: "retail", label: "Retail", image: images.categories.retail },
];

const RADIUS_OPTIONS = [
  { value: 1, label: "1 km", sub: "Immediate area" },
  { value: 3, label: "3 km", sub: "Neighbourhood" },
  { value: 5, label: "5 km", sub: "Wider locality" },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "6am – 12pm" },
  { id: "lunch", label: "Lunch", time: "12pm – 3pm" },
  { id: "evening", label: "Evening", time: "3pm – 7pm" },
  { id: "night", label: "Night", time: "7pm – 11pm" },
];

const STEPS = ["Details", "Targeting", "Schedule", "Review"];

function StepIndicator({ step }) {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition ${
                  done
                    ? "bg-admax-green text-white"
                    : active
                      ? "bg-admax-green-light text-admax-green"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : idx}
              </div>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  active ? "text-dark" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 mb-6 h-0.5 flex-1 transition ${done ? "bg-admax-green" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreateCampaign() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [radius, setRadius] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const toggleSlot = (id) =>
    setSlots((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const validateStep = () => {
    const next = {};
    if (step === 1) {
      if (!name.trim()) next.name = "Campaign name is required";
      if (!city.trim()) next.city = "City is required";
    }
    if (step === 2 && !radius) {
      next.radius = "Please select a targeting radius";
    }
    if (step === 3) {
      if (!startDate) next.startDate = "Start date is required";
      if (!endDate) next.endDate = "End date is required";
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        next.endDate = "End date must be after start date";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormError("");
    try {
      await API.post("/campaigns/create", {
        name,
        category,
        city,
        radius,
        start_date: startDate,
        end_date: endDate,
        time_slots: slots,
      });
      setSuccess(true);
    } catch (err) {
      setFormError(err?.response?.data?.message || "Campaign creation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(1);
    setName("");
    setCity("");
    setCategory("");
    setRadius(null);
    setStartDate("");
    setEndDate("");
    setSlots([]);
    setErrors({});
    setFormError("");
  };

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label || "Not specified";

  return (
    <DashboardLayout
      activePage="/campaigns"
      title="Create Campaign"
      subtitle="Launch a new local ad campaign in minutes"
    >
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link to="/campaigns" className="flex items-center gap-1 text-gray-500 hover:text-admax-green">
          <ChevronLeft className="h-4 w-4" />
          Campaigns
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-dark">New Campaign</span>
      </div>

      <div className="mx-auto max-w-3xl">
        {!success && <StepIndicator step={step} />}

        {formError && !success && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {formError}
          </div>
        )}

        {step === 1 && !success && (
          <Card>
            <h2 className="mb-1 font-display text-lg font-bold text-dark">Campaign Details</h2>
            <p className="mb-6 text-sm text-gray-500">Name your campaign and define its scope</p>

            <form onSubmit={handleNext} className="space-y-5">
              <Input
                label="Campaign Name *"
                name="name"
                placeholder='e.g. "Summer Lunch Offer"'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                error={errors.name}
              />

              <Input
                label="City *"
                name="city"
                placeholder="Pune"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                }}
                error={errors.city}
              />

              <div>
                <p className="mb-3 text-sm font-medium text-gray-700">Business Category</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`overflow-hidden rounded-xl border-2 text-left transition ${
                        category === cat.id
                          ? "border-admax-green ring-2 ring-admax-green/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={cat.image} alt="" className="h-20 w-full object-cover" />
                      <p
                        className={`px-2 py-2 text-xs font-semibold ${
                          category === cat.id ? "bg-admax-green text-white" : "text-dark"
                        }`}
                      >
                        {cat.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        )}

        {step === 2 && !success && (
          <Card>
            <h2 className="mb-1 font-display text-lg font-bold text-dark">Hyperlocal Targeting</h2>
            <p className="mb-6 text-sm text-gray-500">Choose how far your ads should reach</p>

            <p className="mb-3 text-sm font-medium text-gray-700">Select Radius *</p>
            {errors.radius && (
              <p className="mb-3 text-xs text-red-600" role="alert">
                {errors.radius}
              </p>
            )}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRadius(opt.value);
                    if (errors.radius) setErrors((prev) => ({ ...prev, radius: "" }));
                  }}
                  className={`rounded-xl border-2 p-6 text-center transition ${
                    radius === opt.value
                      ? "border-admax-green bg-admax-green-light"
                      : "border-gray-200 bg-surface hover:border-gray-300"
                  }`}
                >
                  <p
                    className={`mb-1 text-2xl font-bold ${
                      radius === opt.value ? "text-admax-green" : "text-dark"
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-sm text-gray-500">{opt.sub}</p>
                </button>
              ))}
            </div>

            {radius && (
              <div className="mb-6 flex items-start gap-2 rounded-lg border border-admax-green bg-admax-green-light p-4 text-sm text-dark">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-admax-green" />
                <span>
                  Your ads will appear on screens within <strong>{radius}km</strong> of your business
                  in {city || "your city"}
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setStep(1);
                  setFormError("");
                }}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && !success && (
          <Card>
            <h2 className="mb-1 font-display text-lg font-bold text-dark">Campaign Schedule</h2>
            <p className="mb-6 text-sm text-gray-500">Set your campaign duration and time slots</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date *"
                type="date"
                name="startDate"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: "" }));
                }}
                error={errors.startDate}
              />
              <Input
                label="End Date *"
                type="date"
                name="endDate"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: "" }));
                }}
                error={errors.endDate}
              />
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-medium text-gray-700">Time Slots (optional)</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {TIME_SLOTS.map((slot) => {
                  const selected = slots.includes(slot.id);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleSlot(slot.id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected
                          ? "border-admax-green bg-admax-green-light"
                          : "border-gray-200 bg-surface hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-semibold ${selected ? "text-admax-green" : "text-dark"}`}
                        >
                          {slot.label}
                        </span>
                        {selected && <Check className="h-4 w-4 text-admax-green" />}
                      </div>
                      <span className="text-xs text-gray-500">{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setStep(2);
                  setFormError("");
                }}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} className="gap-2">
                Review
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {step === 4 && !success && (
          <Card>
            <h2 className="mb-1 font-display text-lg font-bold text-dark">Review & Launch</h2>
            <p className="mb-6 text-sm text-gray-500">Confirm your campaign details before going live</p>

            <div className="mb-6 space-y-3">
              {[
                { label: "Campaign Name", value: name },
                { label: "City", value: city },
                { label: "Category", value: categoryLabel },
                { label: "Radius", value: `${radius} km` },
                { label: "Start Date", value: startDate },
                { label: "End Date", value: endDate },
                {
                  label: "Time Slots",
                  value:
                    slots.length > 0
                      ? slots.map((s) => TIME_SLOTS.find((t) => t.id === s)?.label).join(", ")
                      : "All day",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-surface px-4 py-3"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-dark">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setStep(3);
                  setFormError("");
                }}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} loading={loading} className="flex-1 gap-2">
                <Rocket className="h-4 w-4" />
                Launch Campaign
              </Button>
            </div>
          </Card>
        )}

        {success && (
          <Card className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-admax-green-light">
              <PartyPopper className="h-10 w-10 text-admax-green" />
            </div>
            <h2 className="mb-3 font-display text-2xl font-bold text-dark">Campaign launched!</h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-600">
              <strong>{name}</strong> has been submitted for review. You will receive confirmation once
              it goes live — usually within 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/campaigns">
                <Button className="gap-2">
                  View Campaigns
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="secondary" onClick={resetForm}>
                Create another
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
