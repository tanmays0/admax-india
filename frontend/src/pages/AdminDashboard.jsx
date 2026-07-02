import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  IndianRupee,
  Users,
  Monitor,
  Megaphone,
  Clock,
  BarChart3,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  X,
  Check,
  Search,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import { images } from "../constants/images";

const platformData = [
  { name: "Mon", revenue: 45000, users: 12 },
  { name: "Tue", revenue: 52000, users: 18 },
  { name: "Wed", revenue: 48000, users: 15 },
  { name: "Thu", revenue: 61000, users: 22 },
  { name: "Fri", revenue: 58000, users: 19 },
  { name: "Sat", revenue: 67000, users: 25 },
  { name: "Sun", revenue: 54000, users: 16 },
];

const categoryData = [
  { name: "Restaurant", value: 35, color: "#FF6B35", swatch: "bg-[#FF6B35]" },
  { name: "Gym", value: 28, color: "#1F7A4D", swatch: "bg-admax-green" },
  { name: "Hospital", value: 22, color: "#3b82f6", swatch: "bg-blue-500" },
  { name: "Salon", value: 15, color: "#8b5cf6", swatch: "bg-violet-500" },
];

const pendingAds = [
  {
    id: 1,
    title: "Summer Pizza Deal",
    advertiser: "Pizza Palace",
    uploaded: "2 hours ago",
    type: "image",
    image: images.categories.restaurant,
  },
  {
    id: 2,
    title: "Gym Membership Offer",
    advertiser: "IronFit Gym",
    uploaded: "5 hours ago",
    type: "video",
    image: images.categories.gym,
  },
  {
    id: 3,
    title: "Health Checkup Campaign",
    advertiser: "CityClinic",
    uploaded: "1 day ago",
    type: "image",
    image: images.categories.hospital,
  },
];

const recentUsers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    business: "Spice Route Restaurant",
    type: "advertiser",
    joined: "Today",
    status: "active",
    avatar: images.placeholder.avatar,
  },
  {
    id: 2,
    name: "Priya Sharma",
    business: "FitZone Gym",
    type: "partner",
    joined: "Yesterday",
    status: "active",
    avatar: images.placeholder.avatar,
  },
  {
    id: 3,
    name: "Amit Patel",
    business: "StyleStreet Boutique",
    type: "advertiser",
    joined: "2 days ago",
    status: "pending",
    avatar: images.placeholder.avatar,
  },
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-xs font-semibold text-white">
      {payload[0].name}: ₹{payload[0].value.toLocaleString()}
    </div>
  );
}

function StatCard({ icon, label, value, subtext, trend, accent = "bg-admax-green" }) {
  const StatIcon = icon;
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute right-0 top-0 h-20 w-20 opacity-5 ${accent}`} />
      <div className="relative">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-admax-green-light">
          <StatIcon className="h-5 w-5 text-admax-green" />
        </div>
        <p className="font-display text-3xl font-bold text-dark">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        {subtext && <p className="mt-0.5 text-xs text-gray-400">{subtext}</p>}
        {trend != null && (
          <div
            className={`absolute right-0 top-0 flex items-center gap-0.5 text-xs font-bold ${
              trend > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "approvals", label: "Ad Approvals", icon: CheckCircle, badge: 3 },
  { id: "users", label: "Users", icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");

  const { loading: campaignsLoading, error: campaignsError, refetch } = useFetch("/campaigns", {
    fallback: [],
  });

  const filteredUsers = recentUsers.filter(
    (u) =>
      !userSearch ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.business.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <DashboardLayout
      activePage="/admin"
      title="Platform Overview"
      subtitle="Monitor and manage the entire AdMax network"
    >
      <QueryBoundary
        loading={campaignsLoading}
        error={campaignsError}
        onRetry={refetch}
        label="Loading admin dashboard..."
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-green-700">
              System healthy
            </span>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            icon={IndianRupee}
            label="Revenue"
            value="₹3.8L"
            subtext="This month"
            trend={18}
          />
          <StatCard icon={Users} label="Total Users" value="847" subtext="Advertisers + Partners" trend={12} />
          <StatCard icon={Monitor} label="Active Screens" value="152" subtext="Network wide" trend={8} />
          <StatCard icon={Megaphone} label="Live Campaigns" value="234" subtext="Running now" />
          <StatCard icon={Clock} label="Pending Approvals" value="3" subtext="Ads awaiting review" />
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
          <img
            src={images.hero.screens}
            alt="AdMax screen network"
            className="h-32 w-full object-cover sm:h-40"
          />
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
                {tab.badge != null && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <h3 className="font-display text-base font-bold text-dark">Weekly Revenue</h3>
                    <p className="mb-4 text-xs text-gray-400">Platform earnings over the last 7 days</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={platformData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="revenue" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-dark">Screen Distribution</h3>
                    <p className="mb-4 text-xs text-gray-400">By business category</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={(entry) => `${entry.value}%`}
                        >
                          {categoryData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {categoryData.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-1.5">
                          <span className={`h-3 w-3 rounded-sm ${cat.swatch}`} />
                          <span className="text-xs text-gray-500">{cat.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-surface p-6">
                    <h4 className="mb-4 text-sm font-bold text-dark">Quick Actions</h4>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Review Pending Ads", count: 3, color: "bg-red-500" },
                        { label: "Approve New Users", count: 5, color: "bg-amber-500" },
                        { label: "Check Offline Screens", count: 2, color: "bg-gray-500" },
                      ].map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-admax-green hover:shadow-sm"
                        >
                          <span className="text-sm font-semibold text-dark">{action.label}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${action.color}`}>
                            {action.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-dark">
                      <Activity className="h-4 w-4 text-admax-green" />
                      System Health
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "API Response Time", value: "124ms" },
                        { label: "Database Load", value: "32%" },
                        { label: "Screen Network Uptime", value: "98.7%" },
                        { label: "Payment Gateway", value: "Online" },
                      ].map((metric) => (
                        <div key={metric.label} className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-dark">{metric.value}</span>
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "approvals" && (
              <div>
                <div className="mb-6">
                  <h3 className="font-display text-base font-bold text-dark">Pending Ad Approvals</h3>
                  <p className="text-xs text-gray-400">Review and approve ads before they go live</p>
                </div>
                <div className="space-y-4">
                  {pendingAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="flex flex-col gap-4 rounded-xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <img
                          src={ad.image}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-dark">{ad.title}</h4>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                              {ad.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            By <strong className="text-dark">{ad.advertiser}</strong> · Uploaded {ad.uploaded}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" className="gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-1.5 text-red-600 hover:border-red-300 hover:text-red-600">
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                        <Button size="sm" className="gap-1.5">
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-dark">Recent Users</h3>
                    <p className="text-xs text-gray-400">New advertisers and partners</p>
                  </div>
                  <div className="relative max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        {["Name", "Business", "Type", "Joined", "Status", "Actions"].map((h) => (
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-50 transition hover:bg-surface">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <span className="text-sm font-semibold text-dark">{user.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-500">{user.business}</td>
                          <td className="py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                user.type === "advertiser"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {user.type}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500">{user.joined}</td>
                          <td className="py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <Button variant="secondary" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      </QueryBoundary>
    </DashboardLayout>
  );
}
