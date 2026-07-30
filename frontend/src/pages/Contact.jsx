import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const contactInfo = [
  {
    icon: MapPin,
    label: "Our Office",
    value: "Sterling Towers, Amanora Park Town, Hadapsar, Pune, Maharashtra - 411028",
  },
  { icon: Mail, label: "Email Us", value: "sales@admaxindia.com" },
  { icon: Phone, label: "Call Us", value: "+91 9923191542" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat, 9am – 7pm IST" },
];

const faqs = [
  {
    q: "How quickly can my ad go live?",
    a: "Once your campaign is approved by our team, ads typically go live within 24 hours.",
  },
  {
    q: "What ad formats do you support?",
    a: "We support JPG, PNG images and MP4 videos. Our system auto-optimises for TV screen resolution.",
  },
  {
    q: "Can I choose which screens to advertise on?",
    a: "Yes — our interactive map lets you hand-pick screens or target by radius from your location.",
  },
  {
    q: "Is there a minimum campaign budget?",
    a: "No minimum. Our Starter plan lets you run campaigns from as little as ₹999.",
  },
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-dark outline-none transition focus:border-admax-green focus:bg-admax-green-light/30 focus:ring-4 focus:ring-admax-green/10";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    city: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", business: "", city: "", message: "" });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-admax-green-light via-white to-white py-20 sm:py-24">
        <img
          src={images.about.office}
          alt="AdMax India office"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
        />
        <div className="container-page relative text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-admax-green/20 bg-admax-green-light px-4 py-1.5">
            <MessageSquare className="h-4 w-4 text-admax-green" />
            <span className="text-sm font-semibold text-admax-green">
              We reply within 4 business hours
            </span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-dark sm:text-5xl lg:text-6xl">
            Let's <span className="text-admax-green">talk business</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
            Whether you want to advertise, join our screen network, or just have a question — we're
            all ears.
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="border-b border-gray-200 bg-white py-12">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-surface p-5 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admax-green-light">
                <item.icon className="h-5 w-5 text-admax-green" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8 lg:col-span-3">
            {!submitted ? (
              <>
                <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the details below and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Rajan Mehta"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="rajan@example.com"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Pune"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="business" className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Business Name
                    </label>
                    <input
                      id="business"
                      name="business"
                      value={form.business}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what you're looking for..."
                      required
                      rows={4}
                      className={`${inputClass} resize-y leading-relaxed`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-admax-green py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-admax-green-dark hover:shadow-lg"
                  >
                    Send Message <Send className="h-4 w-4" />
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
                    <Lock className="h-3.5 w-3.5" />
                    Your data is safe with us. We never share your details.
                  </p>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-admax-green-light">
                  <CheckCircle className="h-8 w-8 text-admax-green" />
                </div>
                <h3 className="font-display text-xl font-extrabold text-dark sm:text-2xl">
                  Message sent!
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Thanks for reaching out, <strong>{form.name || "there"}</strong>.
                  <br />
                  Our team will get back to you within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-6 rounded-lg border border-admax-green px-6 py-2.5 text-sm font-semibold text-admax-green transition hover:bg-admax-green-light"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>

          {/* FAQ + demo */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-extrabold text-dark sm:text-2xl">
              Common questions
            </h2>
            <p className="mt-1 text-sm text-gray-500">Quick answers to things people usually ask us.</p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
              {faqs.map((faq, i) => (
                <div key={faq.q} className="border-b border-gray-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-surface"
                  >
                    <span
                      className={`text-sm font-semibold leading-snug ${
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
                    <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-admax-green to-admax-green-dark p-6 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10" />
              <Calendar className="mb-3 h-7 w-7" />
              <h3 className="font-display text-lg font-extrabold">Book a live demo</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                See AdMax in action. We'll walk you through the platform and answer all your
                questions live.
              </p>
              <Link to="/book-demo" className="mt-5 inline-block">
                <Button size="sm" variant="inverse">
                  Schedule Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
