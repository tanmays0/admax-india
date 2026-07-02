import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  IndianRupee,
  Monitor,
  Play,
  Clock,
  BarChart3,
  CreditCard,
  TrendingUp,
  Download,
  Plus,
  MapPin,
  Wifi,
  WifiOff,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const earningsData = [
  { month: "Jan", amount: 12400 },
  { month: "Feb", amount: 15800 },
  { month: "Mar", amount: 18200 },
  { month: "Apr", amount: 21500 },
  { month: "May", amount: 24800 },
  { month: "Jun", amount: 28300 },
];

const screens = [
  {
    id: 1,
    name: "Main Hall Screen",
    location: "IronFit Gym, Koregaon Park",
    status: "online",
    uptime: "99.8%",
    adsPlayed: 1247,
    earnings: 8450,
    lastPayout: "Jun 1, 2024",
    image: images.categories.gym,
  },
  {
    id: 2,
    name: "Reception Display",
    location: "IronFit Gym, Koregaon Park",
    status: "online",
    uptime: "98.5%",
    adsPlayed: 892,
    earnings: 6240,
    lastPayout: "Jun 1, 2024",
    image: images.categories.gym,
  },
  {
    id: 3,
    name: "Waiting Area TV",
    location: "CityClinic, Shivajinagar",
    status: "offline",
    uptime: "95.2%",
    adsPlayed: 1456,
    earnings: 9870,
    lastPayout: "Jun 1, 2024",
    image: images.categories.hospital,
  },
];

const payouts = [
  { id: 1, date: "Jun 1, 2024", amount: 24560, status: "completed", method: "Bank Transfer", ref: "PAY-2024-001" },
  { id: 2, date: "May 1, 2024", amount: 21500, status: "completed", method: "Bank Transfer", ref: "PAY-2024-002" },
  { id: 3, date: "Apr 1, 2024", amount: 18200, status: "completed", method: "Bank Transfer", ref: "PAY-2024-003" },
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-xs font-semibold text-white">
      ₹{payload[0].value.toLocaleString()}
    </div>
  );
}

function StatCard({ icon, label, value, subtext, trend }) {
  const StatIcon = icon;
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-20 w-20 bg-admax-green opacity-5" />
      <div className="relative">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-admax-green-light">
          <StatIcon className="h-5 w-5 text-admax-green" />
        </div>
        <p className="font-display text-3xl font-bold text-dark">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        {subtext && <p className="mt-0.5 text-xs text-gray-400">{subtext}</p>}
        {trend != null && (
          <div className="absolute right-0 top-0 flex items-center gap-0.5 text-xs font-bold text-green-600">
            <TrendingUp className="h-3.5 w-3.5" />
            {trend}%
          </div>
        )}
      </div>
    </Card>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "screens", label: "My Screens", icon: Monitor },
  { id: "payouts", label: "Payouts", icon: CreditCard },
];

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      activePage="/partner"
      title="Screen Network"
      subtitle="Manage your screens and track earnings"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Link to="/partner/add-screen">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Screen
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
        <img
          src={images.partner.dashboard}
          alt="Partner dashboard"
          className="h-36 w-full object-cover"
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Total Earnings" value="₹28,300" subtext="This month" trend={14} />
        <StatCard icon={Monitor} label="Active Screens" value="3" subtext="All online" />
        <StatCard icon={Play} label="Ads Played" value="3,595" subtext="Last 30 days" trend={8} />
        <StatCard icon={Clock} label="Avg Uptime" value="98.2%" subtext="Network health" />
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-admax-green text-admax-green"
                  : "border-transparent text-gray-500 hover:text-dark"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-base font-bold text-dark">Earnings Trend</h3>
                <p className="mb-4 text-xs text-gray-400">Monthly revenue from all screens</p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={earningsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F7A4D" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#1F7A4D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#1F7A4D"
                      strokeWidth={3}
                      fill="url(#earningsGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl bg-admax-green-light p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-admax-green">Next Payout</p>
                    <p className="font-display text-3xl font-bold text-admax-green">₹28,300</p>
                    <p className="text-sm text-admax-green">Scheduled for July 1, 2024</p>
                  </div>
                  <Button>Request Early Payout</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "screens" && (
            <div className="space-y-4">
              {screens.map((screen) => (
                <div
                  key={screen.id}
                  className={`rounded-xl border-l-4 bg-surface p-5 sm:p-6 ${
                    screen.status === "online" ? "border-l-admax-green" : "border-l-gray-400"
                  }`}
                >
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <img
                        src={screen.image}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold text-dark">{screen.name}</h4>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              screen.status === "online"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {screen.status === "online" ? (
                              <Wifi className="h-3 w-3" />
                            ) : (
                              <WifiOff className="h-3 w-3" />
                            )}
                            {screen.status}
                          </span>
                        </div>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {screen.location}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Manage
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-gray-400">Uptime</p>
                      <p className="text-base font-bold text-dark">{screen.uptime}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-gray-400">Ads Played</p>
                      <p className="text-base font-bold text-dark">{screen.adsPlayed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-gray-400">Earnings</p>
                      <p className="text-base font-bold text-admax-green">₹{screen.earnings.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase text-gray-400">Last Payout</p>
                      <p className="text-sm text-gray-500">{screen.lastPayout}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {["Date", "Amount", "Method", "Reference", "Status"].map((h) => (
                      <th
                        key={h}
                        className="pb-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-gray-50 transition hover:bg-surface">
                      <td className="py-4 text-sm text-gray-500">{payout.date}</td>
                      <td className="py-4 text-base font-bold text-admax-green">
                        ₹{payout.amount.toLocaleString()}
                      </td>
                      <td className="py-4 text-sm text-gray-500">{payout.method}</td>
                      <td className="py-4 font-mono text-xs text-gray-400">{payout.ref}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-700">
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
