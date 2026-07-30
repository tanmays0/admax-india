import { Link } from "react-router-dom";
import { MapPin, Monitor, TrendingUp, Users, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const stats = [
  { value: "2,400+", label: "Active screens" },
  { value: "18", label: "Cities" },
  { value: "12M+", label: "Monthly impressions" },
  { value: "94%", label: "Advertiser retention" },
];

const features = [
  {
    icon: MapPin,
    title: "Hyperlocal targeting",
    desc: "Reach customers within 1–5 km of your business with radius-based campaigns.",
    image: images.home.featureTargeting,
  },
  {
    icon: Monitor,
    title: "Premium screen network",
    desc: "Ads run on TVs in cafes, gyms, salons, and clinics where dwell time is high.",
    image: images.home.featureScreens,
  },
  {
    icon: TrendingUp,
    title: "Measurable results",
    desc: "Track impressions, screen coverage, and campaign performance in real time.",
    image: images.home.featureAnalytics,
  },
];

const categories = [
  { name: "Restaurants", image: images.categories.restaurant },
  { name: "Gyms", image: images.categories.gym },
  { name: "Salons", image: images.categories.salon },
  { name: "Clinics", image: images.categories.hospital },
  { name: "Cafes", image: images.categories.cafe },
  { name: "Retail", image: images.categories.retail },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-admax-green-dark/30" />
        <div className="container-page relative py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 lg:order-1">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-admax-green">
                AdMax India Advertising
              </p>
              <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Put your brand on screens where India shops &amp; dines
              </h1>
              <p className="mt-6 max-w-lg text-lg text-gray-300">
                AdMax India Advertising connects local businesses with premium in-venue screens. Launch
                campaigns in minutes, target by neighbourhood, and pay only for real impressions.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Start advertising <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/screen-map">
                  <Button size="lg" variant="outlineLight">
                    View screen map
                  </Button>
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                {["No agency fees", "Launch in 24 hours", "Cancel anytime"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-admax-green" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/15">
                <img
                  src={images.home.hero}
                  alt="Hyperlocal TV advertising across India — local presence, powerful impact"
                  className="aspect-[4/3] w-full object-cover lg:aspect-[16/11]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-surface py-12">
        <div className="container-page grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-admax-green">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container-page">
          <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">
            Why local brands choose AdMax India 
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
                <img src={f.image} alt={f.title} className="h-48 w-full object-cover" />
                <div className="p-6">
                  <f.icon className="mb-3 h-8 w-8 text-admax-green" />
                  <h3 className="font-display text-xl font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-dark py-20 text-white">
        <div className="container-page">
          <h2 className="font-display text-center text-3xl font-bold">Built for every local vertical</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-400">
            From chai tapris to premium gyms — reach the right audience in the right context.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <div key={c.name} className="group overflow-hidden rounded-xl">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-32 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <p className="bg-gray-900 py-3 text-center text-sm font-semibold">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-20">
        <div className="container-page">
          <div className="grid items-center gap-10 overflow-hidden rounded-2xl bg-admax-green-light lg:grid-cols-2">
            <img
              src={images.home.partner}
              alt="In-venue digital screen displaying a local ad"
              className="h-full min-h-[280px] w-full object-cover lg:min-h-[360px]"
            />
            <div className="p-8 lg:p-12">
              <Users className="mb-4 h-10 w-10 text-admax-green" />
              <h2 className="font-display text-3xl font-bold">Own a shop with a TV?</h2>
              <p className="mt-3 text-gray-600">
                Join as a screen partner and earn passive income from ad plays on your display.
              </p>
              <Link to="/partner/apply" className="mt-6 inline-block">
                <Button>Apply as partner</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-dark py-20 text-center text-white">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to grow locally?</h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-400">
            Join hundreds of Pune businesses already advertising on the AdMax network.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg">Get started free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
