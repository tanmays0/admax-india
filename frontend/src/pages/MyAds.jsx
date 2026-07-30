import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Film, ImageIcon, Eye, Megaphone, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchInput, { Pagination } from "../components/ui/SearchPagination";
import { paginate } from "../utils/pagination";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import API from "../services/api";
import { images } from "../constants/images";

const PER_PAGE = 9;

const statusConfig = {
  approved: { className: "bg-green-100 text-green-700", label: "Approved", border: "border-green-500" },
  pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending", border: "border-yellow-500" },
  rejected: { className: "bg-red-100 text-red-700", label: "Rejected", border: "border-red-500" },
};

function getAdImage(ad) {
  if (ad.media_url) return ad.media_url;
  return images.placeholder.ad;
}

function getAdName(ad) {
  if (ad.title) return ad.title;
  if (ad.name) return ad.name;
  if (ad.media_url) {
    const parts = ad.media_url.split("/");
    return parts[parts.length - 1] || `Ad #${ad.id}`;
  }
  return `Ad #${ad.id}`;
}

export default function MyAds() {
  const { data, loading, refetch } = useFetch("/ads", { fallback: [] });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ads = Array.isArray(data) ? data : [];
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (ad) => {
    if (!window.confirm(`Delete “${getAdName(ad)}”?`)) return;
    setDeletingId(ad.id);
    try {
      await API.delete(`/ads/${ad.id}`);
      toast.success("Ad deleted");
      refetch();
    } catch {
      toast.error("Failed to delete ad");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(
    () => [
      { label: "Total Ads", value: ads.length, color: "text-admax-green" },
      {
        label: "Approved",
        value: ads.filter((a) => a.status === "approved").length,
        color: "text-green-600",
      },
      {
        label: "Pending",
        value: ads.filter((a) => !a.status || a.status === "pending").length,
        color: "text-yellow-600",
      },
      {
        label: "Videos",
        value: ads.filter((a) => a.media_type === "video").length,
        color: "text-blue-600",
      },
    ],
    [ads]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ads.filter((ad) => {
      const status = ad.status || "pending";
      const matchesFilter = filter === "all" || status === filter;
      const name = getAdName(ad).toLowerCase();
      const matchesSearch = !q || name.includes(q) || ad.media_type?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [ads, filter, search]);

  const { items, totalPages, page: safePage } = paginate(filtered, page, PER_PAGE);

  return (
    <DashboardLayout
      activePage="/ads"
      title="My Ads"
      subtitle="Manage your ad creatives and upload new content"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/ads/upload">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Upload Ad
          </Button>
        </Link>
      </div>

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
          <div className="flex flex-wrap gap-2">
            {["all", "approved", "pending", "rejected"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                  filter === f
                    ? "bg-admax-green text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-dark"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search ads..."
            className="w-full max-w-xs"
          />
        </div>

        <QueryBoundary loading={loading} error={null} onRetry={refetch} label="Loading ads...">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <img
                src={images.placeholder.ad}
                alt=""
                className="mx-auto mb-4 h-40 w-64 rounded-xl object-cover"
              />
              <p className="text-gray-500">
                {search || filter !== "all"
                  ? "No ads match your filters."
                  : "No ads uploaded yet."}
              </p>
              {!search && filter === "all" && (
                <Link to="/ads/upload" className="mt-4 inline-block">
                  <Button>Upload your first ad</Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((ad) => {
                  const status = ad.status || "pending";
                  const config = statusConfig[status] || statusConfig.pending;
                  const isVideo = ad.media_type === "video";

                  return (
                    <div
                      key={ad.id}
                      className={`group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 transition hover:-translate-y-1 hover:shadow-md border-l-4 ${config.border}`}
                    >
                      <div className="relative h-40 overflow-hidden bg-admax-green-light">
                        <img
                          src={getAdImage(ad)}
                          alt={getAdName(ad)}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-dark/70 px-2 py-1 text-xs font-medium text-white">
                          {isVideo ? (
                            <Film className="h-3 w-3" />
                          ) : (
                            <ImageIcon className="h-3 w-3" />
                          )}
                          {ad.media_type || "image"}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-dark">{getAdName(ad)}</h3>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
                          >
                            {config.label}
                          </span>
                        </div>

                        {ad.duration && (
                          <p className="mb-2 text-sm text-gray-500">{ad.duration}s duration</p>
                        )}

                        <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Megaphone className="h-3.5 w-3.5" />
                            {ad.duration ? `${ad.duration}s` : "—"}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <Eye className="h-3.5 w-3.5" />
                            #{ad.id}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-3 w-full gap-2 text-red-600"
                          loading={deletingId === ad.id}
                          onClick={() => handleDelete(ad)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
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
