import { useState } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "auth", label: "Authentication" },
  { id: "campaigns", label: "Campaigns" },
  { id: "ads", label: "Ads" },
  { id: "screens", label: "Screens" },
  { id: "analytics", label: "Analytics" },
  { id: "webhooks", label: "Webhooks" },
];

const methodStyles = {
  GET: "bg-sky-500/10 text-sky-500",
  POST: "bg-admax-green/10 text-admax-green",
  PUT: "bg-amber-500/10 text-amber-600",
  DELETE: "bg-red-500/10 text-red-600",
  PATCH: "bg-violet-500/10 text-violet-600",
};

function Endpoint({ method, path, desc, params = [], response }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3 overflow-hidden rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-4 px-5 py-4 text-left transition ${
          open ? "bg-gray-50" : "bg-white hover:bg-gray-50"
        }`}
      >
        <span
          className={`min-w-[54px] rounded px-2.5 py-1 text-center font-mono text-[11px] font-bold tracking-wide ${methodStyles[method]}`}
        >
          {method}
        </span>
        <code className="font-mono text-sm font-semibold text-dark">{path}</code>
        <span className="ml-2 hidden text-sm text-gray-500 sm:inline">{desc}</span>
        <span className="ml-auto text-gray-400">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-200 bg-white px-5 pb-5">
          {params.length > 0 && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Parameters
              </p>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {params.map((p, i) => (
                  <div
                    key={p.name}
                    className={`grid gap-3 px-4 py-3 sm:grid-cols-[160px_80px_1fr] ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${i < params.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    <code className="font-mono text-sm font-semibold text-admax-green">
                      {p.name}
                    </code>
                    <span className="font-mono text-xs text-gray-400">{p.type}</span>
                    <span className="text-sm text-gray-700">
                      {p.desc}
                      {p.required && <span className="ml-1 text-red-600">*</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {response && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                Response
              </p>
              <pre className="overflow-x-auto bg-dark p-5 font-mono text-sm leading-relaxed text-lime-400">
                {response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-4 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            copied ? "text-admax-green" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-b-lg bg-dark p-5 font-mono text-sm leading-relaxed text-gray-200">
        {code}
      </pre>
    </div>
  );
}

export default function APIDocumentation() {
  const [active, setActive] = useState("overview");

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-dark py-14 lg:py-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-2/5 bg-admax-green opacity-[0.04] [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" />
        <div className="container-page relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-admax-green">
            Developer Docs
          </p>
          <h1 className="font-display text-3xl font-bold text-white lg:text-5xl">
            AdMax API Reference
          </h1>
          <p className="mt-4 max-w-xl text-base text-gray-400">
            REST API for programmatic campaign management, screen discovery, ad scheduling, and
            analytics retrieval.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ["Base URL", "https://api.admax.in/v1"],
              ["Version", "v1.4"],
              ["Format", "JSON"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-900 px-4 py-2.5">
                <span className="text-[11px] font-semibold text-gray-500">{k}: </span>
                <code className="font-mono text-sm text-admax-green">{v}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page flex flex-col gap-10 py-10 lg:flex-row lg:gap-12 lg:py-14">
        <nav className="lg:sticky lg:top-6 lg:w-44 lg:shrink-0">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`mb-0.5 block w-full border-l-[3px] py-2.5 pl-4 text-left text-sm transition ${
                active === s.id
                  ? "border-admax-green font-bold text-dark"
                  : "border-transparent font-medium text-gray-500 hover:text-dark"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 pb-16">
          {active === "overview" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Overview</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                The AdMax REST API gives developers programmatic access to all platform
                capabilities. Use it to automate campaign creation, schedule ads on specific
                screens, pull performance analytics, and manage your account from any environment.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Rate Limit", value: "1,000 req/hour (Standard)", mono: true },
                  { label: "Timeout", value: "30 seconds", mono: false },
                  { label: "Pagination", value: "Cursor-based", mono: false },
                  { label: "Encoding", value: "UTF-8 / JSON", mono: true },
                ].map(({ label, value, mono }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-200 bg-white p-5"
                  >
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {label}
                    </div>
                    <div
                      className={`text-base font-bold text-dark ${mono ? "font-mono" : ""}`}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="mb-3 mt-8 text-base font-bold text-dark">Error Format</h3>
              <CodeBlock
                lang="JSON"
                code={`{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The API key provided is invalid or expired.",
    "status": 401
  }
}`}
              />
            </div>
          )}

          {active === "auth" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Authentication</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                AdMax uses Bearer token authentication. Include your API key in the Authorization
                header on every request.
              </p>
              <CodeBlock
                lang="HTTP"
                code={`GET /v1/campaigns HTTP/1.1
Host: api.admax.in
Authorization: Bearer <your_api_key>
Content-Type: application/json`}
              />
              <CodeBlock
                lang="cURL"
                code={`curl -X GET https://api.admax.in/v1/campaigns \\
  -H "Authorization: Bearer <your_api_key>" \\
  -H "Content-Type: application/json"`}
              />
              <div className="border-l-[3px] border-admax-orange bg-amber-50 px-5 py-4">
                <p className="text-sm text-amber-900">
                  API keys are available from <strong>Settings → API Access</strong> in your
                  dashboard. Never expose your key in frontend code.
                </p>
              </div>
            </div>
          )}

          {active === "campaigns" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Campaigns</h2>
              <div className="mt-6">
                <Endpoint
                  method="GET"
                  path="/v1/campaigns"
                  desc="List all campaigns"
                  params={[
                    {
                      name: "status",
                      type: "string",
                      desc: "Filter by status: active, paused, completed",
                    },
                    { name: "limit", type: "number", desc: "Results per page (max 100, default 20)" },
                    {
                      name: "cursor",
                      type: "string",
                      desc: "Pagination cursor from previous response",
                    },
                  ]}
                  response={`{
  "data": [
    {
      "id": "cmp_01HXYZ",
      "name": "Summer Promo 2025",
      "status": "active",
      "budget": 15000,
      "spent": 4320,
      "impressions": 28400,
      "start_date": "2025-06-01",
      "end_date": "2025-06-30"
    }
  ],
  "next_cursor": "cmp_01HABC",
  "total": 12
}`}
                />
                <Endpoint
                  method="POST"
                  path="/v1/campaigns"
                  desc="Create a new campaign"
                  params={[
                    { name: "name", type: "string", desc: "Campaign name", required: true },
                    { name: "budget", type: "number", desc: "Total budget in INR", required: true },
                    {
                      name: "start_date",
                      type: "string",
                      desc: "ISO 8601 date (YYYY-MM-DD)",
                      required: true,
                    },
                    {
                      name: "end_date",
                      type: "string",
                      desc: "ISO 8601 date (YYYY-MM-DD)",
                      required: true,
                    },
                    { name: "target_cities", type: "array", desc: "Array of city names to target" },
                  ]}
                  response={`{
  "data": {
    "id": "cmp_01HNEW",
    "name": "Grand Opening",
    "status": "pending",
    "budget": 25000,
    "created_at": "2025-06-15T10:30:00Z"
  }
}`}
                />
                <Endpoint
                  method="PATCH"
                  path="/v1/campaigns/:id"
                  desc="Update campaign status or budget"
                  params={[
                    { name: "status", type: "string", desc: "New status: active, paused" },
                    { name: "budget", type: "number", desc: "Updated total budget in INR" },
                  ]}
                  response={`{ "data": { "id": "cmp_01HXYZ", "status": "paused" } }`}
                />
                <Endpoint
                  method="DELETE"
                  path="/v1/campaigns/:id"
                  desc="Delete a campaign (only if not active)"
                  response={`{ "message": "Campaign deleted successfully" }`}
                />
              </div>
            </div>
          )}

          {active === "ads" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Ads</h2>
              <div className="mt-6">
                <Endpoint
                  method="GET"
                  path="/v1/ads"
                  desc="List uploaded ad creatives"
                  params={[
                    { name: "status", type: "string", desc: "Filter: approved, pending, rejected" },
                    { name: "type", type: "string", desc: "Filter: image, video" },
                  ]}
                  response={`{
  "data": [
    {
      "id": "ad_01HABC",
      "title": "Summer Sale Banner",
      "type": "image",
      "status": "approved",
      "duration": 15,
      "file_url": "https://cdn.admax.in/ads/ad_01HABC.jpg",
      "views": 12400
    }
  ]
}`}
                />
                <Endpoint
                  method="POST"
                  path="/v1/ads/upload"
                  desc="Upload an ad creative (multipart)"
                  params={[
                    {
                      name: "media",
                      type: "file",
                      desc: "JPG, PNG, or MP4 file (max 50MB)",
                      required: true,
                    },
                    { name: "title", type: "string", desc: "Ad display title", required: true },
                    {
                      name: "duration",
                      type: "number",
                      desc: "Slot duration in seconds: 15, 30, 45, 60",
                    },
                  ]}
                  response={`{
  "data": {
    "id": "ad_01HNEW",
    "status": "pending",
    "message": "Under review. Approval within 4-6 hours."
  }
}`}
                />
              </div>
            </div>
          )}

          {active === "screens" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Screens</h2>
              <div className="mt-6">
                <Endpoint
                  method="GET"
                  path="/v1/screens"
                  desc="Discover available screens"
                  params={[
                    { name: "city", type: "string", desc: "Filter by city name" },
                    {
                      name: "category",
                      type: "string",
                      desc: "mall, transit, restaurant, gym, office",
                    },
                    { name: "lat", type: "number", desc: "Latitude for proximity search" },
                    { name: "lng", type: "number", desc: "Longitude for proximity search" },
                    {
                      name: "radius_km",
                      type: "number",
                      desc: "Search radius in km (used with lat/lng)",
                    },
                  ]}
                  response={`{
  "data": [
    {
      "id": "scr_01HXYZ",
      "name": "Phoenix Mall Atrium — Screen 2",
      "city": "Mumbai",
      "category": "mall",
      "status": "online",
      "daily_impressions": 8500,
      "price_per_slot": 120,
      "coordinates": { "lat": 19.1136, "lng": 72.8697 }
    }
  ]
}`}
                />
              </div>
            </div>
          )}

          {active === "analytics" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Analytics</h2>
              <div className="mt-6">
                <Endpoint
                  method="GET"
                  path="/v1/analytics/campaigns/:id"
                  desc="Campaign performance metrics"
                  params={[
                    { name: "from", type: "string", desc: "Start date YYYY-MM-DD", required: true },
                    { name: "to", type: "string", desc: "End date YYYY-MM-DD", required: true },
                    { name: "granularity", type: "string", desc: "hourly, daily, weekly" },
                  ]}
                  response={`{
  "campaign_id": "cmp_01HXYZ",
  "period": { "from": "2025-06-01", "to": "2025-06-15" },
  "summary": {
    "impressions": 142000,
    "slots_played": 1840,
    "screens_reached": 24,
    "budget_spent": 8640,
    "cpm": 60.84
  },
  "timeseries": [
    { "date": "2025-06-01", "impressions": 9400, "slots": 120 }
  ]
}`}
                />
              </div>
            </div>
          )}

          {active === "webhooks" && (
            <div>
              <h2 className="font-display text-2xl font-bold text-dark">Webhooks</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-700">
                Register a URL to receive real-time notifications for platform events. Configure
                webhooks from <strong>Settings → Webhooks</strong>.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                {[
                  ["ad.approved", "An ad creative passes review"],
                  ["ad.rejected", "An ad creative fails review"],
                  ["campaign.started", "A campaign becomes active"],
                  ["campaign.completed", "Campaign end date reached or budget exhausted"],
                  ["payment.success", "A payment is confirmed"],
                  ["screen.offline", "A booked screen goes offline"],
                ].map(([event, desc], i, arr) => (
                  <div
                    key={event}
                    className={`grid gap-4 px-5 py-3.5 sm:grid-cols-[220px_1fr] ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${i < arr.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    <code className="font-mono text-sm font-semibold text-admax-green">
                      {event}
                    </code>
                    <span className="text-sm text-gray-700">{desc}</span>
                  </div>
                ))}
              </div>
              <h3 className="mb-3 mt-8 text-base font-bold text-dark">Webhook Payload</h3>
              <CodeBlock
                lang="JSON"
                code={`{
  "event": "ad.approved",
  "timestamp": "2025-06-15T10:30:00Z",
  "data": {
    "ad_id": "ad_01HABC",
    "title": "Summer Sale Banner",
    "status": "approved"
  }
}`}
              />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
