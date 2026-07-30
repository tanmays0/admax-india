import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  Check,
  Clapperboard,
  Handshake,
  Monitor,
  Network,
  Palette,
  Radio,
  Rocket,
  Settings,
  Target,
  TrendingUp,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const mainServices = [
  {
    icon: Monitor,
    tag: "Core",
    tagClass: "bg-admax-green-light text-admax-green",
    title: "Digital Screen Advertising",
    desc: "Get your brand on high-visibility TV screens inside busy restaurants, gyms, clinics, and salons — where your customers spend real time every day.",
    image: images.services.screens,
    features: [
      "HD display support",
      "Auto-optimised layouts",
      "Real-time ad delivery",
      "Screen health monitoring",
    ],
  },
  {
    icon: Target,
    tag: "Smart",
    tagClass: "bg-blue-50 text-blue-600",
    title: "Hyperlocal Campaign Management",
    desc: "Create and manage ad campaigns with precision radius targeting. Choose 1km, 3km, or 5km and control exactly where and when your ads appear.",
    image: images.categories.restaurant,
    features: [
      "Radius-based targeting",
      "Time slot scheduling",
      "Multi-screen campaigns",
      "One-click pause / resume",
    ],
  },
  {
    icon: Clapperboard,
    tag: "Premium",
    tagClass: "bg-violet-50 text-violet-600",
    title: "Creative Ad Production",
    desc: "Don't have an ad ready? Our in-house team creates professional video ads and static creatives tailored for local TV display formats.",
    image: images.services.creative,
    features: [
      "Script & storyboard",
      "Motion graphics",
      "Voice-over production",
      "TV-optimised output",
    ],
  },
  {
    icon: BarChart3,
    tag: "Insights",
    tagClass: "bg-cyan-50 text-cyan-600",
    title: "Real-Time Analytics",
    desc: "Track impressions, screen views, and campaign ROI with a live analytics dashboard. Know exactly what's working and where.",
    image: images.services.analytics,
    features: [
      "Live impression tracking",
      "Screen-level breakdown",
      "Campaign comparison",
      "Exportable reports",
    ],
  },
  {
    icon: Bot,
    tag: "AI-Powered",
    tagClass: "bg-amber-50 text-amber-600",
    title: "AI Ad Suggestions",
    desc: "Our AI engine analyses your business type, location, and time patterns to suggest the best-performing screens, time slots, and ad formats.",
    image: images.services.ai,
    features: [
      "Best time slot suggestions",
      "Screen ranking by fit",
      "Budget optimisation",
      "Audience behaviour insights",
    ],
  },
  {
    icon: Network,
    tag: "Network",
    tagClass: "bg-admax-green-light text-admax-green",
    title: "Screen Network Access",
    desc: "Tap into AdMax's growing network of partner screens across Pune and beyond. New locations are added weekly — your reach grows with the network.",
    image: images.hero.overlay,
    features: [
      "150+ partner screens",
      "Interactive map view",
      "New screens weekly",
      "Screen status tracking",
    ],
  },
];

const process = [
  { num: "01", title: "Consult", desc: "We learn about your business, goals, and target audience.", icon: Handshake },
  { num: "02", title: "Create", desc: "You upload your ad or we produce one for you.", icon: Palette },
  { num: "03", title: "Configure", desc: "Set your radius, time slots, and campaign duration.", icon: Settings },
  { num: "04", title: "Go Live", desc: "Your ads appear on nearby screens within 24 hours.", icon: Rocket },
  { num: "05", title: "Analyse", desc: "Track performance and optimise from your dashboard.", icon: TrendingUp },
];

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/ campaign",
    desc: "Perfect for trying out AdMax.",
    features: [
      "1 active campaign",
      "Up to 5 screens",
      "Basic analytics",
      "Image ads only",
      "Email support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Business",
    price: "₹3,499",
    period: "/ month",
    desc: "For businesses serious about local growth.",
    features: [
      "5 active campaigns",
      "Unlimited screens",
      "Full analytics + exports",
      "Image & video ads",
      "AI suggestions",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For chains, franchises & agencies.",
    features: [
      "Unlimited campaigns",
      "Multi-city targeting",
      "Dedicated account manager",
      "Custom integrations",
      "White-label option",
      "SLA support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-admax-green-light via-white to-white py-20 sm:py-24">
        <img
          src={images.hero.main}
          alt="Local business venue"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="container-page relative text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5">
            <Radio className="h-4 w-4 text-admax-green" />
            <span className="text-sm font-semibold text-admax-green">
              Everything local businesses need to grow
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-dark sm:text-5xl lg:text-6xl">
            Services built for <span className="text-admax-green">hyperlocal reach</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            From ad creation to live screen distribution — AdMax India handles every step of your
            local advertising journey with smart, affordable tools.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">What We Offer</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Six ways AdMax grows your business
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainServices.map((svc) => (
              <div
                key={svc.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-start justify-between">
                    <svc.icon className="h-8 w-8 text-admax-green" />
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${svc.tagClass}`}>
                      {svc.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-dark">{svc.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{svc.desc}</p>
                  </div>
                  <ul className="mt-auto space-y-2">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-admax-green-light">
                          <Check className="h-2.5 w-2.5 text-admax-green" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">The Process</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              How it works, start to finish
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {process.map((step) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="absolute right-4 top-4 font-display text-3xl font-extrabold text-gray-100">
                  {step.num}
                </span>
                <step.icon className="mx-auto mb-3 h-8 w-8 text-admax-green" />
                <h3 className="font-display text-sm font-bold text-dark">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 text-gray-600">No contracts. No hidden fees. Cancel anytime.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl p-8 transition hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-admax-green to-admax-green-dark text-white shadow-xl"
                    : "border border-gray-200 bg-white shadow-card"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                )}
                <h3 className={`font-display text-lg font-extrabold ${plan.highlight ? "text-white" : "text-dark"}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`font-display text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-dark"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
                      {plan.period}
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
                        <Check className={`h-3 w-3 ${plan.highlight ? "text-white" : "text-admax-green"}`} />
                      </span>
                      <span className={plan.highlight ? "text-white/90" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-bold transition hover:-translate-y-0.5 ${
                    plan.highlight
                      ? "bg-white text-admax-green hover:bg-gray-100"
                      : "bg-admax-green text-white hover:bg-admax-green-dark"
                  }`}
                >
                  {plan.cta} <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Need more detail?{" "}
            <Link to="/pricing" className="font-semibold text-admax-green hover:underline">
              View full pricing page
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admax-green to-admax-green-dark px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Ready to Advertise?</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Start reaching local customers today
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Join AdMax India's hyperlocal TV network and put your brand in front of the right people.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="inverse">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outlineLight">
                  <Calendar className="h-4 w-4" /> Book Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
