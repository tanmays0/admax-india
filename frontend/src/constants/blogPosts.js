import { images } from "./images";

export const blogPosts = [
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
    image: images.blog[0],
    body: [
      "Out-of-home advertising is seeing record engagement rates as consumers grow increasingly blind to online banners and social feed ads.",
      "New research across 14 Indian cities shows DOOH delivers 34% higher unaided brand recall compared to equivalent digital spends.",
      "Hyperlocal screens in cafes, clinics, and gyms put brands in high-intent moments — when people are already deciding what to buy nearby.",
      "AdMax advertisers who geo-target within 2 km of their storefront consistently see stronger footfall attribution than city-wide buys.",
    ],
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
    image: images.blog[1],
    body: [
      "Pick screens where your customer already spends time — gyms for fitness brands, cafes for QSR, clinics for wellness.",
      "Match dayparts to footfall: lunch rush for restaurants, evenings for retail, weekends for family destinations.",
      "Start with a tight radius around your store, measure lift, then expand to lookalike neighborhoods.",
    ],
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
    image: images.blog[2],
    body: [
      "Every player heartbeat can now record a play event against the active creative and screen.",
      "Dashboards fall back to estimated views only when no play logs exist yet — once players report, analytics switch to measured data.",
      "Use the new period filters (7d / 30d / 90d) to spot creative fatigue early.",
    ],
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
    image: images.blog[3],
    body: [
      "Keep your screen online during peak hours — uptime directly drives fill rate and payout.",
      "Approve category-friendly creatives quickly so inventory does not sit empty.",
      "Share accurate footfall notes during partner onboarding so advertisers bid with confidence.",
    ],
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
    image: images.blog[0],
    body: [
      "Programmatic and venue-based DOOH are the fastest-growing segments inside India's OOH market.",
      "Tier-2 cities are adding premium venue inventory as national brands chase less-saturated attention.",
      "Measurement — not just reach — is becoming the buying criterion for performance marketers.",
    ],
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
    image: images.blog[1],
    body: [
      "Lead with one offer and one CTA. Screens are not landing pages.",
      "Use high-contrast type and avoid fine print — viewing distance is typically 2–6 meters.",
      "Keep videos loop-friendly under 15 seconds with a still end-card that works as an image fallback.",
    ],
  },
];

export function getBlogPost(id) {
  return blogPosts.find((p) => String(p.id) === String(id));
}
