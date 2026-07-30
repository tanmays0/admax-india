import { useMemo, useState } from "react";
import toast from "react-hot-toast";
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
import API from "../services/api";
import { images } from "../constants/images";

const CATEGORY_COLORS = ["#FF6B35", "#1F7A4D", "#3b82f6", "#8b5cf6", "#d97706", "#dc2626"];
const CATEGORY_SWATCHES = [
  "bg-[#FF6B35]",
  "bg-admax-green",
  "bg-blue-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-red-500",
];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-xs font-semibold text-white">
      {payload[0].name}: {Number(payload[0].value).toLocaleString()}
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatRelativeDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function userDisplayName(user) {
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || user.email || `User #${user.id}`;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch("/analytics/summary?period=30d", { fallback: null });

  const {
    data: adsData,
    loading: adsLoading,
    error: adsError,
    refetch: refetchAds,
  } = useFetch("/ads", { fallback: [] });

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useFetch("/auth/users", { fallback: [] });

  const summary = analyticsData || {};
  const ads = Array.isArray(adsData) ? adsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

  const usersById = useMemo(() => {
    const map = {};
    for (const u of users) map[u.id] = u;
    return map;
  }, [users]);

  const pendingAds = useMemo(
    () =>
      ads
        .filter((ad) => ad.status === "pending")
        .map((ad) => {
          const owner = usersById[ad.user_id];
          return {
            id: ad.id,
            title: ad.title || `Ad #${ad.id}`,
            advertiser: owner
              ? owner.business_name || userDisplayName(owner)
              : `User #${ad.user_id}`,
            uploaded: formatRelativeDate(ad.created_at),
            type: ad.media_type || "image",
            image: ad.media_url || images.placeholder.ad,
          };
        }),
    [ads, usersById]
  );

  const categoryData = useMemo(() => {
    const raw = summary.byCategory || [];
    const total = raw.reduce((s, c) => s + Number(c.value || 0), 0) || 1;
    return raw.map((c, i) => ({
      name: c.name,
      value: Math.round((Number(c.value) / total) * 100),
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      swatch: CATEGORY_SWATCHES[i % CATEGORY_SWATCHES.length],
    }));
  }, [summary.byCategory]);

  const platformData = useMemo(
    () =>
      (summary.impressionsSeries || []).slice(-7).map((p) => ({
        name: p.date?.slice(5) || p.date,
        revenue: p.views,
      })),
    [summary.impressionsSeries]
  );

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    return users.filter((u) => {
      if (!q) return true;
      return (
        userDisplayName(u).toLowerCase().includes(q) ||
        (u.business_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  const loading = analyticsLoading || adsLoading || usersLoading;
  const error = analyticsError || adsError || usersError;

  const refetch = () => {
    refetchAnalytics();
    refetchAds();
    refetchUsers();
  };

  const handleAdStatus = async (adId, status) => {
    setUpdatingId(adId);
    try {
      await API.patch(`/ads/${adId}/status`, { status });
      toast.success(status === "approved" ? "Ad approved" : "Ad rejected");
      await refetchAds();
      refetchAnalytics();
    } catch {
      // Error toast handled by API interceptor
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    {
      id: "approvals",
      label: "Ad Approvals",
      icon: CheckCircle,
      badge: pendingAds.length > 0 ? pendingAds.length : null,
    },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <DashboardLayout
      activePage="/admin"
      title="Platform Overview"
      subtitle="Monitor and manage the entire AdMax network"
    >
      <QueryBoundary
        loading={loading && !analyticsData}
        error={error}
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
            value={formatCurrency(summary.totalSpent)}
            subtext="Last 30 days"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={String(users.length)}
            subtext="Advertisers + Partners"
          />
          <StatCard
            icon={Monitor}
            label="Active Screens"
            value={String(summary.totalScreens ?? 0)}
            subtext="Network wide"
          />
          <StatCard
            icon={Megaphone}
            label="Live Campaigns"
            value={String(summary.totalCampaigns ?? 0)}
            subtext={`${summary.activeCampaigns ?? 0} active`}
          />
          <StatCard
            icon={Clock}
            label="Pending Approvals"
            value={String(pendingAds.length)}
            subtext="Ads awaiting review"
          />
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
            {tabs.map((tab) => (
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
                    <h3 className="font-display text-base font-bold text-dark">Weekly Views</h3>
                    <p className="mb-4 text-xs text-gray-400">
                      Estimated platform impressions over the last 7 days
                    </p>
                    {platformData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart
                          data={platformData}
                          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="revenue" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="py-16 text-center text-sm text-gray-400">
                        No analytics data yet
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-dark">Campaign Mix</h3>
                    <p className="mb-4 text-xs text-gray-400">By business category</p>
                    {categoryData.length > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <p className="py-16 text-center text-sm text-gray-400">
                        No category data yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl bg-surface p-6">
                    <h4 className="mb-4 text-sm font-bold text-dark">Quick Actions</h4>
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          label: "Review Pending Ads",
                          count: pendingAds.length,
                          color: "bg-red-500",
                          action: () => setActiveTab("approvals"),
                        },
                        {
                          label: "Manage Users",
                          count: users.length,
                          color: "bg-amber-500",
                          action: () => setActiveTab("users"),
                        },
                        {
                          label: "Approved Ads",
                          count: summary.approvedAds ?? 0,
                          color: "bg-gray-500",
                          action: () => setActiveTab("approvals"),
                        },
                      ].map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={action.action}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:border-admax-green hover:shadow-sm"
                        >
                          <span className="text-sm font-semibold text-dark">{action.label}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${action.color}`}
                          >
                            {action.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-surface p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-dark">
                      <Activity className="h-4 w-4 text-admax-green" />
                      Platform Snapshot
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "Total Campaigns", value: String(summary.totalCampaigns ?? 0) },
                        { label: "Approved Ads", value: String(summary.approvedAds ?? 0) },
                        { label: "Total Screens", value: String(summary.totalScreens ?? 0) },
                        {
                          label: "Est. Weekly Views",
                          value: (summary.estimatedWeeklyViews ?? 0).toLocaleString(),
                        },
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
                  <h3 className="font-display text-base font-bold text-dark">
                    Pending Ad Approvals
                  </h3>
                  <p className="text-xs text-gray-400">
                    Review and approve ads before they go live
                  </p>
                </div>
                {pendingAds.length === 0 ? (
                  <div className="rounded-xl bg-surface px-6 py-12 text-center">
                    <CheckCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-semibold text-dark">No pending ads</p>
                    <p className="mt-1 text-xs text-gray-400">All submissions have been reviewed</p>
                  </div>
                ) : (
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
                              By <strong className="text-dark">{ad.advertiser}</strong> · Uploaded{" "}
                              {ad.uploaded}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ad.image && (
                            <a href={ad.image} target="_blank" rel="noreferrer">
                              <Button variant="secondary" size="sm" className="gap-1.5">
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-1.5 text-red-600 hover:border-red-300 hover:text-red-600"
                            disabled={updatingId === ad.id}
                            onClick={() => handleAdStatus(ad.id, "rejected")}
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5"
                            disabled={updatingId === ad.id}
                            onClick={() => handleAdStatus(ad.id, "approved")}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-dark">Users</h3>
                    <p className="text-xs text-gray-400">Advertisers, partners, and admins</p>
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
                {filteredUsers.length === 0 ? (
                  <div className="rounded-xl bg-surface px-6 py-12 text-center">
                    <Users className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-semibold text-dark">No users found</p>
                    <p className="mt-1 text-xs text-gray-400">Try a different search</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b-2 border-gray-100">
                          {["Name", "Business", "Role", "Email", "Joined"].map((h) => (
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
                          <tr
                            key={user.id}
                            className="border-b border-gray-50 transition hover:bg-surface"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar_url || images.placeholder.avatar}
                                  alt=""
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                                <span className="text-sm font-semibold text-dark">
                                  {userDisplayName(user)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-gray-500">
                              {user.business_name || "—"}
                            </td>
                            <td className="py-4">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                  user.role === "advertiser"
                                    ? "bg-blue-100 text-blue-800"
                                    : user.role === "partner"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="py-4 text-sm text-gray-500">{user.email || "—"}</td>
                            <td className="py-4 text-sm text-gray-500">
                              {formatRelativeDate(user.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </QueryBoundary>
    </DashboardLayout>
  );
}
