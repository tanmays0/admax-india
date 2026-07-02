import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Quote,
  Star,
  TrendingUp,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const imageById = Object.fromEntries(images.caseStudies.map((cs) => [cs.id, cs]));

const caseStudies = [
  {
    id: 1,
    company: "Pizza Palace",
    industry: "Restaurant",
    accent: "border-admax-orange bg-admax-orange",
    textAccent: "text-admax-orange",
    challenge:
      "Low footfall during weekday afternoons, competing with 5 other pizzerias within 2km radius",
    solution:
      "Launched hyperlocal campaigns targeting 1km radius during lunch hours (12pm-3pm) with 50% off deals",
    results: [
      { metric: "Footfall Increase", value: "68%" },
      { metric: "Lunch Revenue", value: "+₹2.4L" },
      { metric: "ROI", value: "4.2x" },
      { metric: "New Customers", value: "340+" },
    ],
    quote:
      "AdMax helped us reach exactly the people we needed—office workers within walking distance. Our lunch rush has never been better.",
    author: "Rajesh Mehta",
    role: "Owner, Pizza Palace",
    duration: "3-month campaign",
    investment: "₹45,000",
  },
  {
    id: 2,
    company: "IronFit Gym",
    industry: "Fitness",
    accent: "border-admax-green bg-admax-green",
    textAccent: "text-admax-green",
    challenge:
      "Struggled to attract members in competitive fitness market with low brand awareness",
    solution:
      "Screen ads in nearby restaurants, cafes, and salons showing transformation stories and free trial offers",
    results: [
      { metric: "New Memberships", value: "156" },
      { metric: "Trial Signups", value: "280+" },
      { metric: "Brand Awareness", value: "+92%" },
      { metric: "Campaign Cost", value: "₹18/member" },
    ],
    quote:
      "We've tried Facebook ads, Instagram, everything. Nothing worked like AdMax. We're now the most recognized gym in Koregaon Park.",
    author: "Priya Sharma",
    role: "Co-founder, IronFit Gym",
    duration: "2-month campaign",
    investment: "₹28,000",
  },
  {
    id: 3,
    company: "Glow Beauty Salon",
    industry: "Beauty & Wellness",
    accent: "border-violet-500 bg-violet-500",
    textAccent: "text-violet-600",
    challenge:
      "New salon opening with zero brand recognition, needed to build customer base quickly",
    solution:
      "Grand opening campaign with exclusive discounts on screens in gyms and clinics targeting female audience",
    results: [
      { metric: "First Month Bookings", value: "240" },
      { metric: "Repeat Customers", value: "62%" },
      { metric: "Social Media Followers", value: "+1,200" },
      { metric: "Revenue (Month 1)", value: "₹3.8L" },
    ],
    quote:
      "We were fully booked for the first 3 weeks after launching on AdMax. The hyperlocal targeting was perfect for our opening.",
    author: "Sneha Patel",
    role: "Owner, Glow Beauty Salon",
    duration: "1-month campaign",
    investment: "₹15,000",
  },
];

const testimonials = [
  {
    name: "Amit Kumar",
    business: "CityClinic Hospital",
    quote: "AdMax brought us 180+ new patients in the first month. The ROI is incredible.",
  },
  {
    name: "Neha Desai",
    business: "StyleStreet Boutique",
    quote: "Finally, advertising that actually works for small businesses like ours.",
  },
  {
    name: "Rahul Joshi",
    business: "Bean & Brew Cafe",
    quote: "Our morning crowd doubled after running AdMax ads in nearby gyms.",
  },
];

export default function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(caseStudies[0]);
  const photo = imageById[selectedCase.id];

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-admax-green-light to-white py-20 text-center lg:py-28">
        <div className="container-page max-w-3xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5 text-xs font-semibold text-admax-green">
            <TrendingUp className="h-3.5 w-3.5" />
            Real businesses, real results
          </span>
          <h1 className="font-display text-4xl font-extrabold text-dark lg:text-5xl">
            Success Stories
          </h1>
          <p className="mt-5 text-base leading-relaxed text-gray-600">
            See how local businesses are growing with AdMax India&apos;s hyperlocal advertising
            network
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="mb-12 flex gap-4 overflow-x-auto pb-2">
            {caseStudies.map((cs) => {
              const img = imageById[cs.id];
              const active = selectedCase.id === cs.id;
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setSelectedCase(cs)}
                  className={`flex min-w-[220px] items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                    active
                      ? "border-admax-green bg-admax-green text-white"
                      : "border-gray-200 bg-white hover:border-admax-green"
                  }`}
                >
                  <img
                    src={img?.image}
                    alt={img?.title || cs.company}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div>
                    <div className={`text-sm font-bold ${active ? "text-white" : "text-dark"}`}>
                      {cs.company}
                    </div>
                    <div className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
                      {cs.industry}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={photo?.image}
                  alt={photo?.title || selectedCase.company}
                  className="aspect-video w-full object-cover"
                />
              </div>

              <div className="mb-8 rounded-xl bg-surface p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-admax-green-light">
                    <Building2 className="h-8 w-8 text-admax-green" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-dark">{selectedCase.company}</h2>
                    <p className="text-sm text-gray-500">{selectedCase.industry}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark">
                    The Challenge
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{selectedCase.challenge}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dark">
                    The Solution
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{selectedCase.solution}</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-admax-green p-8">
                <Quote className="absolute left-4 top-4 h-16 w-16 text-white opacity-10" />
                <p className="relative z-10 text-base italic leading-relaxed text-white">
                  {selectedCase.quote}
                </p>
                <div className="relative z-10 mt-5">
                  <div className="text-sm font-bold text-white">{selectedCase.author}</div>
                  <div className="text-xs text-white/80">{selectedCase.role}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-6 font-display text-xl font-bold text-dark">The Results</h3>
              <div className="mb-8 grid grid-cols-2 gap-4">
                {selectedCase.results.map((result) => (
                  <div
                    key={result.metric}
                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6"
                  >
                    <div className="absolute right-0 top-0 h-10 w-10 bg-admax-green opacity-5 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
                    <div className="mb-2 text-[11px] uppercase tracking-wider text-gray-400">
                      {result.metric}
                    </div>
                    <div className={`font-display text-3xl font-extrabold ${selectedCase.textAccent}`}>
                      {result.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-admax-green-light p-6">
                <h4 className="mb-4 text-sm font-bold text-admax-green">Campaign Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Duration:</span>
                    <span className="font-bold text-admax-green">{selectedCase.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-800">Total Investment:</span>
                    <span className="font-mono font-bold text-admax-green">
                      {selectedCase.investment}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark lg:text-4xl">
              What our customers say
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Trusted by 300+ local businesses across Pune
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((test) => (
              <div
                key={test.name}
                className="rounded-xl border border-gray-200 bg-white p-7"
              >
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-gray-600">
                  &ldquo;{test.quote}&rdquo;
                </p>
                <div className="text-sm font-bold text-dark">{test.name}</div>
                <div className="text-xs text-gray-500">{test.business}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-admax-green to-admax-green-dark px-8 py-16 text-center lg:px-12">
          <h2 className="font-display text-3xl font-extrabold text-white lg:text-4xl">
            Ready to write your success story?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-white/80">
            Join hundreds of businesses growing with AdMax India
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-white text-admax-green hover:bg-gray-100"
            >
              Get Started Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
