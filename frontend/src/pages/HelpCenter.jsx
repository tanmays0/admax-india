import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  CreditCard,
  Mail,
  Megaphone,
  MessageCircle,
  Monitor,
  Phone,
  Plus,
  Rocket,
  Search,
  Settings,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const categoryImages = images.helpCategories;

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: Rocket,
    articles: [
      { title: "How to create your first campaign", views: "2.4k" },
      { title: "Understanding screen targeting", views: "1.8k" },
      { title: "Uploading your first ad", views: "1.5k" },
      { title: "Setting up your payment method", views: "1.2k" },
    ],
  },
  {
    id: "campaigns",
    name: "Campaigns",
    icon: Megaphone,
    articles: [
      { title: "How to pause or stop a campaign", views: "980" },
      { title: "Editing campaign settings", views: "756" },
      { title: "Best practices for ad targeting", views: "654" },
      { title: "Campaign duration and scheduling", views: "542" },
    ],
  },
  {
    id: "billing",
    name: "Billing & Payments",
    icon: CreditCard,
    articles: [
      { title: "Understanding your invoice", views: "1.1k" },
      { title: "Payment methods accepted", views: "890" },
      { title: "How refunds work", views: "765" },
      { title: "Upgrading or downgrading plans", views: "623" },
    ],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    articles: [
      { title: "Reading your campaign analytics", views: "842" },
      { title: "Impression metrics explained", views: "712" },
      { title: "Exporting performance reports", views: "598" },
      { title: "Tracking ROI", views: "487" },
    ],
  },
  {
    id: "technical",
    name: "Technical",
    icon: Settings,
    articles: [
      { title: "Ad format specifications", views: "1.3k" },
      { title: "Troubleshooting upload issues", views: "645" },
      { title: "Browser compatibility", views: "432" },
      { title: "API documentation", views: "298" },
    ],
  },
  {
    id: "partners",
    name: "Screen Partners",
    icon: Monitor,
    articles: [
      { title: "Becoming a screen partner", views: "1.6k" },
      { title: "Screen installation process", views: "876" },
      { title: "Partner earnings explained", views: "734" },
      { title: "Managing your screens", views: "512" },
    ],
  },
];

const faqs = [
  {
    q: "How quickly can my ad go live?",
    a: "Once approved, ads typically go live within 24 hours on your selected screens.",
  },
  {
    q: "What ad formats do you support?",
    a: "We support JPG, PNG images and MP4 videos. Our system auto-optimizes for TV screen resolution (1920x1080px recommended).",
  },
  {
    q: "Can I target specific areas?",
    a: "Yes! You can target by radius (1km, 3km, 5km) from your business or hand-pick individual screens on our interactive map.",
  },
  {
    q: "Is there a minimum budget?",
    a: "No minimum. Our Starter plan begins at ₹999 per campaign.",
  },
  {
    q: "How do I track performance?",
    a: "Your dashboard provides real-time analytics including impressions, screen views, and engagement metrics.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, there are no contracts. Cancel your subscription anytime from your dashboard settings.",
  },
];

const supportMethods = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Chat with our team",
    action: "Start Chat",
    time: "Response in ~2 min",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "support@admaxindia.com",
    action: "Send Email",
    time: "Response in ~4 hours",
  },
  {
    icon: Phone,
    title: "Phone Support",
    desc: "+91 9923191542",
    action: "Call Us",
    time: "Mon-Sat, 9am-7pm IST",
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-b from-admax-green-light to-white py-20 text-center lg:py-28">
        <img
          src={images.pages.help}
          alt="AdMax support team"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="container-page relative max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5 text-xs font-semibold text-admax-green">
            <BookOpen className="h-3.5 w-3.5" />
            How can we help you today?
          </span>
          <h1 className="font-display text-4xl font-extrabold text-dark lg:text-5xl">
            AdMax Help Center
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Search our knowledge base or browse categories below
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-admax-green focus:ring-2 focus:ring-admax-green/20"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark">Browse by category</h2>
            <p className="mt-3 text-sm text-gray-500">Find guides and answers organized by topic</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative overflow-hidden rounded-xl border p-7 text-left transition hover:-translate-y-1 hover:shadow-card ${
                    active
                      ? "border-admax-green bg-admax-green-light"
                      : "border-gray-200 bg-white hover:border-admax-green"
                  }`}
                >
                  <img
                    src={categoryImages[cat.id]}
                    alt=""
                    className="mb-4 h-24 w-full rounded-lg object-cover"
                  />
                  {active && (
                    <div className="absolute right-0 top-0 h-12 w-12 bg-admax-green opacity-5 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
                  )}
                  <Icon
                    className={`mb-4 h-8 w-8 ${active ? "text-admax-green" : "text-gray-400"}`}
                  />
                  <h3
                    className={`mb-4 text-base font-bold ${active ? "text-admax-green" : "text-dark"}`}
                  >
                    {cat.name}
                  </h3>
                  <div className="space-y-2.5">
                    {cat.articles.slice(0, 3).map((article) => (
                      <div
                        key={article.title}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-500">{article.title}</span>
                        <span className="font-mono text-[11px] text-gray-400">{article.views}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs font-semibold text-admax-green">
                    View all {cat.articles.length} articles
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-gray-500">Quick answers to common questions</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {faqs.map((faq, i) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full border-b border-gray-100 px-7 py-6 text-left transition last:border-b-0 hover:bg-surface ${
                  openFaq === i ? "bg-surface" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-sm font-semibold leading-relaxed ${
                      openFaq === i ? "text-admax-green" : "text-dark"
                    }`}
                  >
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronDown className="h-5 w-5 shrink-0 rotate-180 text-gray-400 transition" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-gray-400 transition" />
                  )}
                </div>
                {openFaq === i && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-extrabold text-dark">Still need help?</h2>
            <p className="mt-3 text-sm text-gray-500">Our support team is here to assist you</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {supportMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="rounded-xl border border-gray-200 bg-surface p-8 text-center transition hover:-translate-y-1 hover:border-admax-green"
                >
                  <Icon className="mx-auto mb-4 h-10 w-10 text-admax-green" />
                  <h3 className="text-base font-bold text-dark">{method.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{method.desc}</p>
                  <Link to="/contact" className="mt-4 inline-block">
                    <Button size="sm">{method.action}</Button>
                  </Link>
                  <p className="mt-3 text-xs text-gray-400">{method.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
