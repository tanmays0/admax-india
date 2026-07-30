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
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";

const COLORS = ["#1F7A4D", "#2563eb", "#7c3aed", "#d97706", "#dc2626"];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-dark px-3 py-2 text-sm font-semibold text-white">
      {Number(payload[0].value).toLocaleString()}
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useFetch(`/analytics/summary?period=${period}`, {
    fallback: null,
  });

  const summary = data || {};
  const impressionsSeries = summary.impressionsSeries || [];
  const byCategory = summary.byCategory || [];
  const campaignPerformance = summary.campaignPerformance || [];

  const stats = useMemo(
    () => [
      {
        label: "Active Campaigns",
        value: loading ? "—" : (summary.activeCampaigns ?? 0),
        color: "text-admax-green",
        icon: TrendingUp,
      },
      {
        label: "Est. Weekly Views",
        value: loading ? "—" : (summary.estimatedWeeklyViews ?? 0).toLocaleString(),
        color: "text-blue-600",
        icon: MousePointer,
      },
      {
        label: "Total Ads",
        value: loading ? "—" : (summary.totalAds ?? 0),
        color: "text-violet-600",
        icon: Clock,
      },
      {
        label: "Total Spent",
        value: loading ? "—" : formatCurrency(summary.totalSpent),
        color: "text-amber-600",
        icon: IndianRupee,
      },
    ],
    [loading, summary]
  );

  return (
    <DashboardLayout
      activePage="/analytics"
      title="Analytics"
      subtitle="Track campaign performance across your screen network"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: "7d", label: "7 days" },
          { id: "30d", label: "30 days" },
          { id: "90d", label: "90 days" },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              period === p.id
                ? "bg-admax-green text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-dark"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {summary.estimated && (
        <p className="mb-4 text-xs text-gray-500">
          Views are estimated from your live campaigns, ads, and screen inventory until play logs
          are enabled.
        </p>
      )}

      <QueryBoundary
        loading={loading && !data}
        error={error}
        onRetry={refetch}
        label="Loading analytics..."
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-admax-green-light">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-display font-bold">Impressions over time</h3>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={impressionsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#1F7A4D"
                    fill="#EAF7EF"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <h3 className="mb-4 font-display font-bold">Campaigns by category</h3>
            {loading ? (
              <ChartSkeleton />
            ) : byCategory.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-500">No category data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name }) => name}
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        <Card className="mt-6">
          <h3 className="mb-4 font-display font-bold">Campaign performance (est.)</h3>
          {loading ? (
            <ChartSkeleton height="h-72" />
          ) : campaignPerformance.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              Create a campaign to see performance
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="impressions" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </QueryBoundary>
    </DashboardLayout>
  );
}
