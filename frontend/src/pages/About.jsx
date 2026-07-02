import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CreditCard,
  Dumbbell,
  Eye,
  MapPin,
  Scissors,
  ShoppingBag,
  Sliders,
  Sparkles,
  Sprout,
  Stethoscope,
  Target,
  UtensilsCrossed,
  UserCircle,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const network = [
  {
    icon: UtensilsCrossed,
    image: images.categories.restaurant,
    title: "Restaurants",
    desc: "Display ads while customers dine and relax — high dwell time, full attention.",
  },
  {
    icon: Dumbbell,
    image: images.categories.gym,
    title: "Gyms",
    desc: "Reach health-conscious, motivated audiences in fitness centers daily.",
  },
  {
    icon: Building2,
    image: images.categories.hospital,
    title: "Hospitals",
    desc: "Promote services calmly while visitors wait in reception areas.",
  },
  {
    icon: Scissors,
    image: images.categories.salon,
    title: "Salons",
    desc: "Engage customers during long waiting and service sessions.",
  },
  {
    icon: Stethoscope,
    image: images.categories.pharmacy,
    title: "Clinics",
    desc: "Connect local brands with neighbourhood communities.",
  },
  {
    icon: ShoppingBag,
    image: images.categories.retail,
    title: "Retail Stores",
    desc: "Deliver ad messages at the exact moment people are in shopping mode.",
  },
];

const whyUs = [
  {
    icon: MapPin,
    title: "Target Local Audience",
    desc: "Ads appear within 1–5km of your business, so every view is from a potential walk-in customer.",
  },
  {
    icon: Eye,
    title: "High Visibility",
    desc: "Large-screen TV placements in high-dwell locations mean your brand is impossible to ignore.",
  },
  {
    icon: Sliders,
    title: "Smart Campaigns",
    desc: "Schedule, target, and manage your ads in minutes from the AdMax dashboard.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Track impressions and screen views in real time. Know exactly what's working.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    desc: "Our AI recommends the best time slots and screen locations for your business type.",
  },
  {
    icon: CreditCard,
    title: "Affordable & Transparent",
    desc: "No contracts, no hidden fees. Pay per campaign with full Razorpay billing history.",
  },
];

const team = [
  { name: "Sudhir Shinde", role: "Co-founder & CEO" },
  { name: "Dilip Satre", role: "Co-founder & CTO" },
  { name: "Rahul Sinha", role: "Head of Growth" },
];

const stats = [
  { value: "2026", label: "Founded" },
  { value: "₹0", label: "Hidden fees" },
  { value: "24hr", label: "Go-live time" },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-admax-green-light via-white to-white py-20 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-admax-green/5" />
        <div className="container-page relative text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5">
            <Sprout className="h-4 w-4 text-admax-green" />
            <span className="text-sm font-semibold text-admax-green">Built in India, for India</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-dark sm:text-5xl lg:text-6xl">
            The story behind <span className="text-admax-green">AdMax India</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            AdMax India is building the country's most powerful hyperlocal advertising network —
            connecting local businesses through smart digital screens placed in the locations their
            customers already visit every day.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={images.about.office}
                alt="AdMax India office"
                className="h-72 w-full object-cover sm:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-admax-green-dark/90 via-admax-green/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <Target className="mb-4 h-10 w-10" />
                <h3 className="font-display text-2xl font-extrabold">Our Mission</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Help every local business grow by giving them access to affordable, highly visible
                  advertising — right in the neighbourhoods they serve.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-admax-green">Our Story</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
                We noticed a gap.
                <br />
                Local ads weren't local enough.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                Small businesses in Pune were spending thousands on Facebook and Google ads, reaching
                people miles away — while the customer they needed was sitting 500 meters away at a
                coffee shop or gym.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                AdMax India was built to solve that. We install smart TV screens inside local
                businesses and let them advertise to each other's customers — the people who already
                live, work, and spend time in the same neighbourhood.
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <p className="font-display text-2xl font-extrabold text-admax-green sm:text-3xl">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">The Network</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Where your ads appear
            </h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Our screens are installed in 6 business categories across Pune and expanding fast.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {network.map((item) => (
              <div
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-admax-green-light">
                    <item.icon className="h-5 w-5 text-admax-green" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-dark">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why AdMax */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">Why Choose Us</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              Built different. Built local.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-surface p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                  <item.icon className="h-5 w-5 text-admax-green" />
                </div>
                <h3 className="font-display text-base font-bold text-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies preview */}
      <section className="bg-dark py-16 text-white sm:py-20">
        <div className="container-page">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">Success Stories</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Real results from local brands
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {images.caseStudies.map((study) => (
              <div key={study.id} className="group overflow-hidden rounded-2xl">
                <img
                  src={study.image}
                  alt={study.title}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <p className="bg-gray-900 py-3 text-center text-sm font-semibold">{study.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/case-studies" className="inline-flex items-center gap-2 text-sm font-semibold text-admax-green hover:underline">
              View all case studies <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-admax-green">The Team</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-dark sm:text-4xl">
              People behind the platform
            </h2>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-2xl">
            <img
              src={images.about.team}
              alt="AdMax India team"
              className="h-48 w-full object-cover sm:h-64"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-admax-green-light">
                  <UserCircle className="h-8 w-8 text-admax-green" />
                </div>
                <p className="font-display font-bold text-dark">{member.name}</p>
                <p className="mt-1 text-sm font-medium text-admax-green">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admax-green to-admax-green-dark px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              Want to be part of the network?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Register your business today and start advertising on AdMax India's growing local screen
              network.
            </p>
            <Link to="/register" className="mt-8 inline-block">
              <Button size="lg" className="bg-white text-admax-green hover:bg-gray-100">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
