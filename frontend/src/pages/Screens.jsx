import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { List, Map, MapPin, Wifi, WifiOff } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchInput, { Pagination } from "../components/ui/SearchPagination";
import { paginate } from "../utils/pagination";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import { images } from "../constants/images";

const PER_PAGE = 8;

function getScreenImage(screen, index) {
  const match = images.screens.find(
    (s) =>
      screen.shop_name &&
      s.name.toLowerCase().includes(screen.shop_name.toLowerCase().split(" ")[0])
  );
  if (match) return match.image;
  if (screen.category && images.categories[screen.category.toLowerCase()]) {
    return images.categories[screen.category.toLowerCase()];
  }
  const categoryKeys = Object.keys(images.categories);
  return images.categories[categoryKeys[index % categoryKeys.length]];
}

export default function Screens() {
  const { data, loading, error, refetch } = useFetch("/screens", { fallback: [] });
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const screens = Array.isArray(data) ? data : [];

  const stats = useMemo(
    () => [
      { label: "Total Screens", value: screens.length, color: "text-admax-green" },
      {
        label: "Online",
        value: screens.filter((s) => s.status !== "offline").length,
        color: "text-green-600",
      },
      {
        label: "Cities",
        value: new Set(screens.map((s) => s.city).filter(Boolean)).size,
        color: "text-blue-600",
      },
      {
        label: "With Location",
        value: screens.filter((s) => s.latitude && s.longitude).length,
        color: "text-purple-600",
      },
    ],
    [screens]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return screens.filter(
      (s) =>
        !q ||
        s.shop_name?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
    );
  }, [screens, search]);

  const { items, totalPages, page: safePage } = paginate(filtered, page, PER_PAGE);

  return (
    <DashboardLayout
      activePage="/screens"
      title="Screen Network"
      subtitle="Browse available screens in your target area"
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="absolute right-0 top-0 h-14 w-14 bg-admax-green/5 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {stat.label}
            </p>
            <p className={`mt-2 font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "list"
                  ? "bg-admax-green text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-dark"
              }`}
            >
              <List className="h-4 w-4" />
              List View
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === "map"
                  ? "bg-admax-green text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-dark"
              }`}
            >
              <Map className="h-4 w-4" />
              Map View
            </button>
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search screens..."
            className="w-full max-w-xs"
          />
        </div>

        <QueryBoundary loading={loading} error={error} onRetry={refetch} label="Loading screens...">
          {view === "map" ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-admax-green-light py-20">
              <Map className="h-16 w-16 text-admax-green" />
              <h3 className="font-display text-lg font-bold text-admax-green">Map View</h3>
              <p className="text-sm text-gray-500">Explore screens on the interactive map</p>
              <Link to="/screen-map">
                <Button variant="secondary">Open screen map</Button>
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <img
                src={images.hero.screens}
                alt=""
                className="mx-auto mb-4 h-40 w-64 rounded-xl object-cover"
              />
              <p className="text-gray-500">
                {search ? "No screens match your search." : "No screens available yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((screen, idx) => {
                  const isOnline = screen.status !== "offline";
                  const globalIndex = (safePage - 1) * PER_PAGE + idx;

                  return (
                    <div
                      key={screen.id ?? globalIndex}
                      className={`group flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:translate-x-1 hover:shadow-sm sm:flex-row sm:items-center border-l-4 ${
                        isOnline ? "border-l-green-500" : "border-l-gray-300"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={getScreenImage(screen, globalIndex)}
                          alt={screen.shop_name}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ${
                            isOnline ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-dark">{screen.shop_name}</h3>
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {screen.city || "—"}
                          {screen.category && ` · ${screen.category}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right">
                        <div>
                          <p className="font-mono text-sm font-semibold text-admax-green">
                            {screen.views ?? "—"}/week
                          </p>
                          {screen.latitude && screen.longitude && (
                            <p className="text-xs text-gray-400">
                              {Number(screen.latitude).toFixed(2)},{" "}
                              {Number(screen.longitude).toFixed(2)}
                            </p>
                          )}
                        </div>

                        <div
                          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                            isOnline
                              ? "bg-admax-green-light text-admax-green"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isOnline ? (
                            <Wifi className="h-3.5 w-3.5" />
                          ) : (
                            <WifiOff className="h-3.5 w-3.5" />
                          )}
                          {screen.campaigns > 0
                            ? `${screen.campaigns} campaigns`
                            : isOnline
                              ? "Available"
                              : "Offline"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </QueryBoundary>
      </Card>
    </DashboardLayout>
  );
}
