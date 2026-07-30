import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, GraduationCap, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";
import { useAuth } from "../hooks/useAuth";
import { startStripeCheckout } from "../services/stripe";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 999,
    period: "/ campaign",
    desc: "Perfect for trying out AdMax",
    features: [
      "1 active campaign",
      "Up to 5 screens",
      "Basic analytics",
      "Image ads only",
      "Email support",
      "7-day campaign duration",
    ],
    cta: "Start Free Trial",
    highlight: false,
    badge: null,
  },
  {
    id: "business",
    name: "Business",
    price: 3499,
    period: "/ month",
    desc: "For businesses serious about growth",
    features: [
      "5 active campaigns",
      "Unlimited screens",
      "Advanced analytics + exports",
      "Image & video ads",
      "AI-powered suggestions",
      "Priority support",
      "Custom targeting",
      "Performance reports",
    ],
    cta: "Get Started",
    highlight: true,
    badge: "MOST POPULAR",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "",
    desc: "For chains, franchises & agencies",
    features: [
      "Unlimited campaigns",
      "Multi-city targeting",
      "Dedicated account manager",
      "Custom integrations",
      "White-label option",
      "SLA support",
      "API access",
      "Volume discounts",
    ],
    cta: "Contact Sales",
    highlight: false,
    badge: null,
  },
];

const faqs = [
  {
    q: "How does pricing work?",
    a: "You only pay for active campaigns. Pause anytime and resume later without losing credits.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there are no contracts. Cancel your subscription anytime from Billing → Manage subscription.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit/debit cards via Stripe. Razorpay (UPI, net banking) remains available for campaign checkout when configured.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, if you're not satisfied within the first 7 days, we offer a full refund.",
  },
  { q: "Is there a setup fee?", a: "No setup fees. What you see is what you pay." },
  {
    q: "Can I upgrade or downgrade?",
    a: "Yes, you can change your plan anytime from the Stripe customer portal in Billing.",
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [screenCount, setScreenCount] = useState(10);
  const [duration, setDuration] = useState(7);
  const [openFaq, setOpenFaq] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const calculatePrice = () => {
    const basePrice = 50;
    const total = basePrice * screenCount * (duration / 7);
    return Math.round(total);
  };

  const estimated = calculatePrice();

  const handlePlanClick = async (plan) => {
    if (plan.id === "enterprise") {
      navigate("/contact");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing", plan: plan.id } });
      toast("Sign in to continue to checkout");
      return;
    }

    setCheckoutPlan(plan.id);
    try {
      await startStripeCheckout({
        plan: plan.id,
        successPath: "/payment-success",
        cancelPath: "/pricing",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not start Stripe checkout");
      setCheckoutPlan(null);
    }
  };

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-admax-green-light via-white to-white py-20 sm:py-24 lg:py-28">
        <img
          src={images.hero.overlay}
          alt="Digital advertising screens"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="container-page relative text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5">
            <IndianRupee className="h-4 w-4 text-admax-green" />
            <span className="text-sm font-semibold text-admax-green">
              Simple, transparent pricing
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-dark sm:text-5xl lg:text-6xl">
            Plans that scale with your business
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            No contracts. No hidden fees. Pay only for what you use.
            <br className="hidden sm:block" />
            Start with a free trial and scale as you grow.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl p-8 transition hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-admax-green to-admax-green-dark text-white shadow-xl"
                    : "border border-gray-200 bg-white shadow-card"
                }`}
              >
                {plan.badge && (
                  <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {plan.badge}
                  </span>
                )}
                {plan.highlight && (
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full border border-white/10" />
                )}

                <h3
                  className={`font-display text-xl font-extrabold ${plan.highlight ? "text-white" : "text-dark"}`}
                >
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
                  {plan.desc}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  {plan.price ? (
                    <>
                      <span
                        className={`font-display text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-dark"}`}
                      >
                        ₹{plan.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm ${plan.highlight ? "text-white/60" : "text-gray-400"}`}
                      >
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span
                      className={`font-display text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-dark"}`}
                    >
                      Custom
                    </span>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          plan.highlight ? "bg-white/15" : "bg-admax-green-light"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${plan.highlight ? "text-white" : "text-admax-green"}`}
                        />
                      </span>
                      <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={checkoutPlan === plan.id}
                  onClick={() => handlePlanClick(plan)}
                  className={`mt-8 block w-full rounded-lg py-3.5 text-center text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 ${
                    plan.highlight
                      ? "bg-white text-admax-green hover:bg-gray-100"
                      : "bg-admax-green text-white hover:bg-admax-green-dark"
                  }`}
                >
                  {checkoutPlan === plan.id ? "Redirecting…" : plan.cta}{" "}
                  <ArrowRight className="inline h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-surface px-6 py-5 text-center">
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
              <GraduationCap className="h-5 w-5 text-admax-green" />
              <span>
                <strong>Special offer for startups:</strong> Get 25% off for the first 3 months
              </span>
            </p>
            <Link
              to="/contact"
              className="mt-2 inline-block text-sm font-semibold text-admax-green hover:underline"
            >
              Contact us to claim <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12 sm:py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Calculate your campaign cost
            </h2>
            <p className="mt-3 text-gray-600">Estimate pricing based on your needs</p>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8">
            <div className="mb-8">
              <label htmlFor="screens" className="mb-3 block text-sm font-semibold text-gray-700">
                Number of Screens:{" "}
                <span className="font-display text-base text-admax-green">{screenCount}</span>
              </label>
              <input
                id="screens"
                type="range"
                min="1"
                max="50"
                value={screenCount}
                onChange={(e) => setScreenCount(parseInt(e.target.value, 10))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-admax-green"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>50</span>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="duration" className="mb-3 block text-sm font-semibold text-gray-700">
                Campaign Duration:{" "}
                <span className="font-display text-base text-admax-green">{duration} days</span>
              </label>
              <input
                id="duration"
                type="range"
                min="7"
                max="30"
                step="7"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-admax-green"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>7 days</span>
                <span>30 days</span>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-admax-green-light p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-admax-green-dark">Estimated Campaign Cost</p>
                <p className="font-display text-4xl font-extrabold text-admax-green">
                  ₹{estimated.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-admax-green-dark">
                  ≈ ₹{Math.round(estimated / duration)} per day
                </p>
              </div>
              <Link to="/register">
                <Button>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-gray-600">Everything you need to know about pricing</p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
            {faqs.map((faq, i) => (
              <div key={faq.q} className="border-b border-gray-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-surface"
                >
                  <span
                    className={`text-sm font-semibold sm:text-base ${
                      openFaq === i ? "text-admax-green" : "text-dark"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-surface px-6 py-5 text-center">
            <p className="text-sm text-gray-600">Still have questions?</p>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-admax-green hover:underline"
            >
              Contact our sales team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
