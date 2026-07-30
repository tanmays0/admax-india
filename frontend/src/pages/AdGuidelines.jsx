import { useState } from "react";
import { ArrowRight, Ban, Check, Lightbulb, X } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import { images } from "../constants/images";

const sections = [
  { id: "formats", label: "File Formats" },
  { id: "specs", label: "Specifications" },
  { id: "design", label: "Design Rules" },
  { id: "content", label: "Content Policy" },
  { id: "tips", label: "Best Practices" },
];

const formats = [
  {
    format: "JPG / JPEG",
    use: "Static images",
    maxSize: "10 MB",
    notes: "RGB color mode, no transparency",
  },
  {
    format: "PNG",
    use: "Static images with transparency",
    maxSize: "10 MB",
    notes: "RGB or RGBA, lossless quality",
  },
  {
    format: "MP4 (H.264)",
    use: "Video ads",
    maxSize: "50 MB",
    notes: "AAC audio, no DRM encoding",
  },
];

const specs = [
  {
    spec: "Aspect Ratio",
    value: "16:9 (landscape) preferred",
    note: "Screens may crop portrait formats",
  },
  { spec: "Min Resolution", value: "1280 × 720 px (HD)", note: "Full HD (1920×1080) recommended" },
  { spec: "Max Duration", value: "60 seconds per slot", note: "15s, 30s, 45s, 60s standard slots" },
  { spec: "Frame Rate", value: "24–30 fps", note: "Higher rates increase file size" },
  { spec: "Color Space", value: "sRGB", note: "CMYK files will be rejected" },
  { spec: "Bitrate (Video)", value: "4–10 Mbps", note: "Higher bitrate = better quality" },
];

const designDos = [
  "Use high-contrast text — minimum 4.5:1 ratio against background",
  "Keep key message in the center 70% of the frame (safe zone)",
  "Use font size ≥ 48px for body text, ≥ 72px for headlines",
  "Include your brand logo in a consistent corner placement",
  "Design for 3–5 second comprehension — one idea per creative",
  "Use animation to draw attention, not distract (subtle motion preferred)",
];

const designDonts = [
  "Don't use small print or legal text as primary CTA — viewers can't read it",
  "Don't place critical content in the outer 15% border — may be cut off",
  "Don't rely on audio as the primary message — most screens play silent",
  "Don't use strobing, flashing at >3Hz, or rapid color cycling",
  "Don't include countdown timers that require real-time data",
  "Don't use copyrighted music or unlicensed fonts",
];

const prohibited = [
  "Tobacco, e-cigarettes, or nicotine products",
  "Alcohol advertising without age-gate and location compliance",
  "Political campaigning or election propaganda",
  "Misleading health or medical claims",
  "Adult content, nudity, or sexually suggestive imagery",
  "Content targeting children under 13 with unsafe products",
  "Fake discounts, false urgency, or fraudulent offers",
  "Competitor brand disparagement",
];

const tips = [
  {
    title: "Lead with your offer",
    desc: "Viewers have 3–5 seconds. Put the most compelling line first — not your brand name.",
  },
  {
    title: "Use the 40/60 rule",
    desc: "40% visual, 60% message hierarchy. Don't let images bury your call-to-action.",
  },
  {
    title: "Design for distance",
    desc: "Your ad may be viewed from 5–15 meters. Test readability at reduced zoom before uploading.",
  },
  {
    title: "Match screen environment",
    desc: "Outdoor screens need higher brightness and contrast. Indoor creatives can use subtler palettes.",
  },
  {
    title: "A/B test durations",
    desc: "15s drives frequency. 30s builds narrative. Use 15s for promotions, 30s for brand awareness.",
  },
  {
    title: "Include clear CTA",
    desc: "Use one action per ad: visit, scan, call, or remember the name. Multiple CTAs reduce action.",
  },
];

export default function AdGuidelines() {
  const [activeSection, setActiveSection] = useState("formats");

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-dark py-14 lg:py-16">
        <img
          src={images.pages.guidelines}
          alt="Digital screen ad example"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/70" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-admax-orange opacity-[0.03] [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" />
        <div className="container-page relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-admax-green">
            Creative Standards
          </p>
          <h1 className="font-display text-3xl font-bold text-white lg:text-5xl">
            Ad Creative Guidelines
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-400">
            Everything you need to create ads that get approved, display correctly, and drive
            results on AdMax screens.
          </p>
        </div>
      </section>

      <div className="container-page flex flex-col gap-10 py-10 lg:flex-row lg:gap-12 lg:py-14">
        <nav className="lg:sticky lg:top-6 lg:w-52 lg:shrink-0">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSection(s.id)}
              className={`mb-0.5 block w-full border-l-[3px] py-2.5 pl-4 text-left text-sm transition ${
                activeSection === s.id
                  ? "border-admax-green font-bold text-dark"
                  : "border-transparent font-medium text-gray-500 hover:text-dark"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 pb-16">
          {activeSection === "formats" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Accepted File Formats</h2>
              <p className="mt-2 text-sm text-gray-500">
                AdMax supports the following formats for ad creatives.
              </p>
              <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
                <div className="grid grid-cols-4 gap-4 bg-dark px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <span>Format</span>
                  <span>Best For</span>
                  <span>Max Size</span>
                  <span>Notes</span>
                </div>
                {formats.map((r, i) => (
                  <div
                    key={r.format}
                    className={`grid grid-cols-4 gap-4 border-t border-gray-200 px-5 py-4 text-sm ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-mono font-bold text-admax-green">{r.format}</span>
                    <span className="text-gray-700">{r.use}</span>
                    <span className="font-mono font-semibold text-dark">{r.maxSize}</span>
                    <span className="text-gray-500">{r.notes}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3 border-l-[3px] border-admax-green bg-admax-green-light px-5 py-4">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-admax-green" />
                <p className="text-sm text-green-800">
                  GIF and WebP formats are <strong>not supported</strong>. Convert GIFs to MP4 for
                  animated content.
                </p>
              </div>
            </div>
          )}

          {activeSection === "specs" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Technical Specifications</h2>
              <p className="mt-2 text-sm text-gray-500">
                These specs ensure your ad renders correctly across all AdMax screens.
              </p>
              <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
                {specs.map((s, i) => (
                  <div
                    key={s.spec}
                    className={`grid gap-4 border-b border-gray-200 px-5 py-4 last:border-b-0 sm:grid-cols-[200px_1fr_1fr] ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {s.spec}
                    </span>
                    <span className="font-mono text-sm font-semibold text-dark">{s.value}</span>
                    <span className="text-sm text-gray-500">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "design" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Design Rules</h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={images.guidelines.good}
                    alt="Example of a well-designed screen ad"
                    className="h-48 w-full object-cover"
                  />
                  <p className="bg-admax-green-light px-4 py-2 text-xs font-semibold text-admax-green">
                    Good example — clear headline, strong contrast, visible CTA
                  </p>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={images.guidelines.bad}
                    alt="Example of cluttered ad creative"
                    className="h-48 w-full object-cover opacity-80"
                  />
                  <p className="bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
                    Avoid — small text, low contrast, too much information
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-7">
                  <div className="mb-5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-admax-green-light">
                      <Check className="h-4 w-4 text-admax-green" />
                    </div>
                    <h3 className="font-bold text-dark">Do</h3>
                  </div>
                  {designDos.map((d, i) => (
                    <div
                      key={d}
                      className={`flex gap-2.5 py-2.5 ${
                        i < designDos.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-admax-green" />
                      <span className="text-sm leading-relaxed text-gray-700">{d}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-7">
                  <div className="mb-5 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-red-50">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <h3 className="font-bold text-dark">Don&apos;t</h3>
                  </div>
                  {designDonts.map((d, i) => (
                    <div
                      key={d}
                      className={`flex gap-2.5 py-2.5 ${
                        i < designDonts.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <span className="text-sm leading-relaxed text-gray-700">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "content" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Content Policy</h2>
              <p className="mt-2 text-sm text-gray-500">
                Ads violating these policies will be rejected during review. Repeated violations may
                result in account suspension.
              </p>
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
                <h3 className="mb-5 flex items-center gap-2 font-bold text-red-600">
                  <Ban className="h-5 w-5" />
                  Prohibited Content
                </h3>
                {prohibited.map((p, i) => (
                  <div
                    key={p}
                    className={`flex gap-3 py-3 ${
                      i < prohibited.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span className="text-sm text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l-[3px] border-admax-orange bg-amber-50 px-5 py-4">
                <p className="text-sm leading-relaxed text-amber-900">
                  <strong>Review SLA:</strong> All ads are reviewed within 4–6 business hours.
                  Rejected ads receive a specific rejection reason via email so you can resubmit
                  with corrections.
                </p>
              </div>
            </div>
          )}

          {activeSection === "tips" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Best Practices</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {tips.map((t, i) => (
                  <div
                    key={t.title}
                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6"
                  >
                    <div className="absolute right-0 top-0 h-0.5 w-3/5 bg-admax-green" />
                    <div className="mb-2 font-mono text-[11px] font-bold text-gray-400">
                      0{i + 1}
                    </div>
                    <h3 className="mb-2 font-bold text-dark">{t.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
