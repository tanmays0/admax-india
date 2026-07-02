import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
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
import { TrendingUp, MousePointer, Clock, IndianRupee } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import { Skeleton } from "../components/ui/Loading";
import { useFetch } from "../hooks/useFetch";

const impressionData = [
  { date: "Jan 1", views: 1200 },
  { date: "Jan 8", views: 1800 },
  { date: "Jan 15", views: 2400 },
  { date: "Jan 22", views: 2100 },
  { date: "Jan 29", views: 3200 },
  { date: "Feb 5", views: 2800 },
  { date: "Feb 12", views: 3600 },
];

const campaignPerformance = [
  { name: "Summer Sale", impressions: 12400, clicks: 340 },
  { name: "Weekend Deal", impressions: 8200, clicks: 210 },
  { name: "Grand Opening", impressions: 15800, clicks: 420 },
];

const deviceData = [
  { name: "Restaurants", value: 35 },
  { name: "Gyms", value: 25 },
  { name: "Salons", value: 20 },
  { name: "Hospitals", value: 15 },
  { name: "Others", value: 5 },
];

const COLORS = ["#1F7A4D", "#2563eb", "#7c3aed", "#d97706", "#dc2626"];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-sm font-semibold text-white">
      {payload[0].value.toLocaleString()}
    </div>
  );
}

function ChartSkeleton({ height = "h-60" }) {
  return (
    <div className={`${height} w-full space-y-3`}>
      <Skeleton className="h-full w-full" />
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const { data, loading } = useFetch("/campaigns", { fallback: [] });

  const campaigns = Array.isArray(data) ? data : [];
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  const stats = useMemo(
    () => [
      {
        label: "Active Campaigns",
        value: loading ? "—" : activeCount,
        change: "+18%",
        color: "text-admax-green",
        icon: TrendingUp,
        positive: true,
      },
      {
        label: "Total Campaigns",
        value: loading ? "—" : campaigns.length,
        change: `+${campaigns.length}`,
        color: "text-blue-600",
        icon: MousePointer,
        positive: true,
      },
      {
        label: "Avg. View Time",
        value: "8.4s",
        change: "+1.2s",
        color: "text-purple-600",
        icon: Clock,
        positive: true,
      },
      {
        label: "Cost per View",
        value: "₹0.42",
        change: "-₹0.08",
        color: "text-green-600",
        icon: IndianRupee,
        positive: true,
      },
    ],
    [campaigns, activeCount, loading]
  );

  return (
    <DashboardLayout
      activePage="/analytics"
      title="Analytics"
      subtitle="Track your campaign performance and insights"
    >
      <div className="mb-6 flex flex-wrap justify-end gap-2">
        {["7d", "30d", "90d"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              period === p
                ? "bg-admax-green text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-dark"
            }`}
          >
            Last {p}
          </button>
        ))}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-14 w-14 bg-admax-green/5 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {stat.label}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admax-green-light">
                <stat.icon className="h-5 w-5 text-admax-green" />
              </div>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className={`font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-display font-bold text-dark">Impressions Over Time</h3>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={impressionData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F7A4D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1F7A4D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis
                  dataKey="date"
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
                  dataKey="views"
                  stroke="#1F7A4D"
                  strokeWidth={2.5}
                  fill="url(#analyticsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-display font-bold text-dark">Views by Category</h3>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-display font-bold text-dark">Campaign Performance</h3>
        {loading ? (
          <ChartSkeleton height="h-64" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={campaignPerformance}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="impressions" fill="#1F7A4D" radius={[6, 6, 0, 0]} />
              <Bar dataKey="clicks" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </DashboardLayout>
  );
}
