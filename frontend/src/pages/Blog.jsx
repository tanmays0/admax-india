import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Mail } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { images } from "../constants/images";

const posts = [
  {
    id: 1,
    category: "Industry",
    tag: "Trends",
    title: "Why DOOH is Outperforming Digital Ads in 2025",
    excerpt:
      "Out-of-home advertising is seeing record engagement rates as consumers grow blind to online banners. Here's what the data says.",
    author: "Priya Sharma",
    date: "Jun 12, 2025",
    readTime: "5 min",
    featured: true,
    stat: "+34%",
    statLabel: "avg. recall vs. online",
  },
  {
    id: 2,
    category: "Guide",
    tag: "Campaigns",
    title: "How to Target the Right Screens for Your Business",
    excerpt:
      "Location, footfall timing, and demographic match — the three pillars of screen selection that most advertisers overlook.",
    author: "Arjun Mehta",
    date: "Jun 8, 2025",
    readTime: "7 min",
    featured: false,
    stat: "3×",
    statLabel: "better ROI with geo-targeting",
  },
  {
    id: 3,
    category: "Product",
    tag: "Feature",
    title: "Introducing Real-Time Analytics on AdMax",
    excerpt:
      "Track impressions, engagement windows, and audience density live — without waiting for end-of-day reports.",
    author: "Sneha Iyer",
    date: "Jun 3, 2025",
    readTime: "4 min",
    featured: false,
    stat: "Live",
    statLabel: "data, zero delay",
  },
  {
    id: 4,
    category: "Partner",
    tag: "Earnings",
    title: "Screen Owners: Maximize Revenue With Smart Scheduling",
    excerpt:
      "Prime-time slots, category exclusivity, and fill-rate optimization — turn idle screens into consistent income.",
    author: "Vikram Nair",
    date: "May 28, 2025",
    readTime: "6 min",
    featured: false,
    stat: "₹12k",
    statLabel: "avg. monthly per screen",
  },
  {
    id: 5,
    category: "Industry",
    tag: "Report",
    title: "India's Out-of-Home Ad Market: ₹4,200 Cr and Growing",
    excerpt:
      "A deep dive into regional growth, tier-2 city expansion, and why brands are doubling OOH budgets this year.",
    author: "Priya Sharma",
    date: "May 20, 2025",
    readTime: "9 min",
    featured: false,
    stat: "₹4,200Cr",
    statLabel: "market size 2025",
  },
  {
    id: 6,
    category: "Guide",
    tag: "Creative",
    title: "Ad Creative Best Practices for High-Traffic Screens",
    excerpt:
      "5-second attention windows demand ruthless design clarity. We break down what works — and what wastes your budget.",
    author: "Sneha Iyer",
    date: "May 15, 2025",
    readTime: "5 min",
    featured: false,
    stat: "5s",
    statLabel: "average viewer dwell time",
  },
];

const categories = ["All", "Industry", "Guide", "Product", "Partner"];

const tagColors = {
  Trends: "bg-admax-green/10 text-admax-green",
  Campaigns: "bg-admax-orange/10 text-admax-orange",
  Feature: "bg-indigo-100 text-indigo-600",
  Earnings: "bg-sky-100 text-sky-600",
  Report: "bg-amber-100 text-amber-700",
  Creative: "bg-pink-100 text-pink-600",
};

export default function Blog() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? posts : posts.filter((p) => p.category === active);
  const featured = posts.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured || active !== "All");

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-dark py-16 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-admax-green/10" />
        <div className="container-page relative">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-admax-green">
            AdMax Journal
          </p>
          <h1 className="max-w-xl font-display text-4xl font-bold text-white lg:text-6xl">
            Insights for Modern Advertisers
          </h1>
          <p className="mt-5 max-w-lg text-base text-gray-400">
            Strategy, product updates, and industry data for brands growing with digital
            out-of-home.
          </p>
        </div>
      </section>

      <div className="container-page py-12 lg:py-16">
        {active === "All" && featured && (
          <div className="mb-12 grid overflow-hidden rounded-xl border border-gray-200 bg-white lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <img
                src={images.blog[0]}
                alt={featured.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-dark/30" />
              <div className="relative flex h-full flex-col justify-end p-8 lg:p-10">
                <span className="mb-4 inline-block w-fit rounded bg-admax-green px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Featured
                </span>
                <h2 className="font-display text-2xl font-bold leading-snug text-white lg:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{featured.excerpt}</p>
                <div className="mt-6">
                  <div className="font-mono text-3xl font-bold text-admax-green">{featured.stat}</div>
                  <div className="mt-1 text-xs text-gray-400">{featured.statLabel}</div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-admax-green text-sm font-bold text-white">
                    {featured.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{featured.author}</div>
                    <div className="text-xs text-gray-400">
                      {featured.date} · {featured.readTime} read
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className={`mb-4 inline-block w-fit rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${tagColors[featured.tag]}`}>
                {featured.category} · {featured.tag}
              </span>
              <p className="mb-8 text-base leading-relaxed text-gray-600">
                Out-of-home advertising is seeing record engagement rates as consumers grow
                increasingly blind to online banners and social feed ads. New research across 14
                Indian cities shows DOOH delivers 34% higher unaided brand recall compared to
                equivalent digital spends.
              </p>
              <Link to={`/blog/${featured.id}`}>
                <Button className="gap-2">
                  Read Full Article <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-lg border px-5 py-2 text-sm font-semibold transition ${
                active === c
                  ? "border-dark bg-dark text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, idx) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={images.blog[(idx + 1) % images.blog.length]}
                  alt={post.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/80 to-transparent p-4">
                  <div className="font-mono text-2xl font-bold text-admax-green">{post.stat}</div>
                  <div className="text-xs text-gray-300">{post.statLabel}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${tagColors[post.tag]}`}>
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {post.readTime} read
                  </span>
                </div>
                <h3 className="mb-2 font-display text-base font-bold leading-snug text-dark">
                  {post.title}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-500">{post.excerpt}</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs font-medium text-gray-600">
                    {post.author} · {post.date}
                  </span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-xs font-bold text-admax-green hover:underline"
                  >
                    Read
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-16 overflow-hidden rounded-xl bg-dark p-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-admax-green opacity-[0.06] [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-admax-green">
              Stay Ahead
            </p>
            <h3 className="font-display text-2xl font-bold text-white">
              Get DOOH insights in your inbox
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Weekly strategy, data, and product updates. No spam.
            </p>
          </div>
          <div className="relative mt-6 flex flex-col gap-2 sm:flex-row lg:mt-0">
            <Input
              type="email"
              placeholder="your@email.com"
              className="sm:w-72"
            />
            <Button className="gap-2 shrink-0">
              <Mail className="h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
