import { useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  X,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import API from "../services/api";
import { images } from "../constants/images";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-xs font-semibold text-white">
      {Number(payload[0].value).toLocaleString()} views
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getScreenImage(screen, index) {
  const categoryKeys = Object.keys(images.categories);
  if (screen.category && images.categories[screen.category.toLowerCase()]) {
    return images.categories[screen.category.toLowerCase()];
  }
  return images.categories[categoryKeys[index % categoryKeys.length]];
}

const EMPTY_FORM = { shop_name: "", city: "", latitude: "", longitude: "" };

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "screens", label: "My Screens", icon: Monitor },
  { id: "payouts", label: "Payouts", icon: CreditCard },
];

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const {
    data: screensData,
    loading: screensLoading,
    error: screensError,
    refetch: refetchScreens,
  } = useFetch("/screens", { fallback: [] });

  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFetch("/analytics/summary?period=30d", { fallback: null });

  const {
    data: paymentsData,
    loading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useFetch("/payments", { fallback: [] });

  const screens = useMemo(() => {
    const list = Array.isArray(screensData) ? screensData : [];
    return list.map((s, index) => ({
      id: s.id,
      name: s.shop_name || `Screen #${s.id}`,
      location: [s.shop_name, s.city].filter(Boolean).join(", ") || "—",
      city: s.city,
      status: s.status === "active" ? "online" : "offline",
      image: getScreenImage(s, index),
      latitude: s.latitude,
      longitude: s.longitude,
    }));
  }, [screensData]);

  const summary = analyticsData || {};
  const onlineCount = screens.filter((s) => s.status === "online").length;
  const uptimePct =
    screens.length > 0 ? Math.round((onlineCount / screens.length) * 1000) / 10 : 0;

  const chartData = (summary.impressionsSeries || []).map((p) => ({
    month: p.date?.slice(5) || p.date,
    amount: p.views,
  }));

  const payments = Array.isArray(paymentsData) ? paymentsData : [];

  const loading = screensLoading || analyticsLoading || paymentsLoading;
  const error = screensError || analyticsError || paymentsError;

  const refetch = () => {
    refetchScreens();
    refetchAnalytics();
    refetchPayments();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    if (!form.shop_name.trim() || !form.city.trim()) {
      toast.error("Shop name and city are required");
      return;
    }
    setSaving(true);
    try {
      await API.post("/screens/add", {
        shop_name: form.shop_name.trim(),
        city: form.city.trim(),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      });
      toast.success("Screen added successfully");
      setForm(EMPTY_FORM);
      setShowAddScreen(false);
      await refetchScreens();
      refetchAnalytics();
    } catch {
      // Error toast handled by API interceptor
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      activePage="/partner"
      title="Screen Network"
      subtitle="Manage your screens and track earnings"
    >
      <QueryBoundary
        loading={loading && !analyticsData && screens.length === 0}
        error={error}
        onRetry={refetch}
        label="Loading partner dashboard..."
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button className="gap-2" onClick={() => setShowAddScreen(true)}>
              <Plus className="h-4 w-4" />
              Add Screen
            </Button>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
          <img
            src={images.partner.earnings}
            alt="Partner dashboard"
            className="h-36 w-full object-cover"
          />
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={IndianRupee}
            label="Total Earnings"
            value={formatCurrency(summary.totalSpent)}
            subtext="Last 30 days"
          />
          <StatCard
            icon={Monitor}
            label="Active Screens"
            value={String(screens.length)}
            subtext={
              screens.length === 0
                ? "No screens yet"
                : `${onlineCount} online`
            }
          />
          <StatCard
            icon={Play}
            label="Est. Views"
            value={(summary.estimatedWeeklyViews ?? 0).toLocaleString()}
            subtext="Last 7 days"
          />
          <StatCard
            icon={Clock}
            label="Avg Uptime"
            value={screens.length ? `${uptimePct}%` : "—"}
            subtext="Network health"
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
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-base font-bold text-dark">Views Trend</h3>
                  <p className="mb-4 text-xs text-gray-400">
                    Estimated impressions across your screens (30 days)
                  </p>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1F7A4D" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#1F7A4D" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis
                          dataKey="month"
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
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#1F7A4D"
                          strokeWidth={3}
                          fill="url(#earningsGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="py-12 text-center text-sm text-gray-400">
                      No analytics data yet. Add screens to start tracking.
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-admax-green-light p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-admax-green">Partner Earnings</p>
                      <p className="font-display text-3xl font-bold text-admax-green">
                        {formatCurrency(summary.totalSpent)}
                      </p>
                      <p className="text-sm text-admax-green">
                        Payouts sync when Razorpay partner payouts are enabled
                      </p>
                    </div>
                    <Button variant="secondary" disabled>
                      Request Early Payout
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "screens" && (
              <div className="space-y-4">
                {screens.length === 0 ? (
                  <div className="rounded-xl bg-surface px-6 py-12 text-center">
                    <Monitor className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-semibold text-dark">No screens yet</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Add your first screen to start earning from ads
                    </p>
                    <Button className="mt-4 gap-2" onClick={() => setShowAddScreen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Screen
                    </Button>
                  </div>
                ) : (
                  screens.map((screen) => (
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
                          <p className="text-[11px] font-semibold uppercase text-gray-400">Status</p>
                          <p className="text-base font-bold text-dark capitalize">{screen.status}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-400">City</p>
                          <p className="text-base font-bold text-dark">{screen.city || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-400">Latitude</p>
                          <p className="text-base font-bold text-dark">
                            {screen.latitude != null ? screen.latitude : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase text-gray-400">Longitude</p>
                          <p className="text-sm text-gray-500">
                            {screen.longitude != null ? screen.longitude : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "payouts" && (
              <div>
                {payments.length === 0 ? (
                  <div className="rounded-xl bg-surface px-6 py-12 text-center">
                    <CreditCard className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                    <p className="text-sm font-semibold text-dark">No payouts yet</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Payouts sync when Razorpay partner payouts are enabled
                    </p>
                  </div>
                ) : (
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
                        {payments.map((payout) => (
                          <tr
                            key={payout.id || payout.order_id}
                            className="border-b border-gray-50 transition hover:bg-surface"
                          >
                            <td className="py-4 text-sm text-gray-500">
                              {formatDate(payout.created_at)}
                            </td>
                            <td className="py-4 text-base font-bold text-admax-green">
                              {formatCurrency(payout.amount)}
                            </td>
                            <td className="py-4 text-sm text-gray-500">Razorpay</td>
                            <td className="py-4 font-mono text-xs text-gray-400">
                              {payout.order_id || payout.payment_id || "—"}
                            </td>
                            <td className="py-4">
                              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-700">
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-4 text-xs text-gray-400">
                      Partner payouts sync when Razorpay partner payouts are enabled
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {showAddScreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="font-display text-lg font-bold text-dark">Add Screen</h3>
                <button
                  type="button"
                  onClick={() => setShowAddScreen(false)}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-dark"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddScreen} className="space-y-4 px-6 py-5">
                <Input
                  label="Shop name"
                  name="shop_name"
                  value={form.shop_name}
                  onChange={handleFormChange}
                  placeholder="e.g. IronFit Gym"
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  placeholder="e.g. Pune"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={handleFormChange}
                    placeholder="18.5204"
                  />
                  <Input
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={handleFormChange}
                    placeholder="73.8567"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddScreen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Adding…" : "Add Screen"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </QueryBoundary>
    </DashboardLayout>
  );
}
