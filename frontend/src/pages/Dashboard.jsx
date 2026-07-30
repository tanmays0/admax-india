import { Link } from "react-router-dom";
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
} from "recharts";
import { Plus, Megaphone, Monitor, Eye } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import { images } from "../constants/images";

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch("/analytics/summary?period=7d", {
    fallback: null,
  });

  const summary = data || {};
  const list = summary.recentCampaigns || [];
  const impressionData = (summary.impressionsSeries || []).map((p) => ({
    day: p.date?.slice(5) || p.date,
    views: p.views,
  }));
  const topScreens = summary.topScreens || [];

  const stats = [
    { label: "Active campaigns", value: summary.activeCampaigns ?? 0, icon: Megaphone },
    { label: "Total campaigns", value: summary.totalCampaigns ?? 0, icon: Monitor },
    {
      label: "Est. weekly views",
      value: (summary.estimatedWeeklyViews ?? 0).toLocaleString(),
      icon: Eye,
    },
  ];

  return (
    <DashboardLayout
      activePage="/dashboard"
      title="Dashboard"
      subtitle="Overview of your advertising performance"
    >
      <QueryBoundary
        loading={loading && !data}
        error={error}
        onRetry={refetch}
        label="Loading dashboard..."
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-admax-green-light">
                <s.icon className="h-6 w-6 text-admax-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold">Quick actions</h2>
          <div className="flex gap-3">
            <Link to="/campaigns/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New campaign
              </Button>
            </Link>
            <Link to="/ads/upload">
              <Button variant="secondary">Upload ad</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-display font-bold">Weekly impressions (est.)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={impressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#1F7A4D"
                  fill="#EAF7EF"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="mb-4 font-display font-bold">Recent campaigns</h3>
            {list.length === 0 ? (
              <div className="py-8 text-center">
                <img
                  src={images.placeholder.ad}
                  alt=""
                  className="mx-auto mb-4 h-24 w-24 rounded-xl object-cover opacity-60"
                />
                <p className="text-sm text-gray-500">No campaigns yet</p>
                <Link to="/campaigns/new" className="mt-4 inline-block">
                  <Button size="sm">Create your first campaign</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {list.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-dark">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {c.city || "—"} · {c.category || "General"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.status || "active"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="mt-6">
          <h3 className="mb-4 font-display font-bold">Top screens (est.)</h3>
          {topScreens.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No screens in the network yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topScreens}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </QueryBoundary>
    </DashboardLayout>
  );
}
