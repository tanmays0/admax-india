import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Calendar, MapPin } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchInput, { Pagination } from "../components/ui/SearchPagination";
import { paginate } from "../utils/pagination";
import QueryBoundary from "../components/QueryBoundary";
import { useFetch } from "../hooks/useFetch";
import API from "../services/api";
import { images } from "../constants/images";

const categoryImages = {
  restaurant: images.categories.restaurant,
  gym: images.categories.gym,
  salon: images.categories.salon,
  hospital: images.categories.hospital,
  pharmacy: images.categories.pharmacy,
  cafe: images.categories.cafe,
  dental: images.categories.dental,
  retail: images.categories.retail,
};

const PER_PAGE = 8;

function getCategoryImage(category) {
  const key = category?.toLowerCase?.();
  return categoryImages[key] || images.placeholder.ad;
}

export default function Campaigns() {
  const { data, loading, error, refetch } = useFetch("/campaigns", { fallback: [] });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const campaigns = Array.isArray(data) ? data : [];
  const [busyId, setBusyId] = useState(null);

  const toggleStatus = async (campaign) => {
    const next = campaign.status === "active" ? "paused" : "active";
    setBusyId(campaign.id);
    try {
      await API.patch(`/campaigns/${campaign.id}/status`, { status: next });
      toast.success(next === "paused" ? "Campaign paused" : "Campaign resumed");
      refetch();
    } catch {
      toast.error("Failed to update campaign");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return campaigns.filter(
      (c) =>
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
    );
  }, [campaigns, search]);

  const { items, totalPages, page: safePage } = paginate(filtered, page, PER_PAGE);

  return (
    <DashboardLayout
      activePage="/campaigns"
      title="Campaigns"
      subtitle="Manage and monitor your ad campaigns"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search campaigns..."
          className="max-w-sm"
        />
        <Link to="/campaigns/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New campaign
          </Button>
        </Link>
      </div>

      <QueryBoundary loading={loading} error={error} onRetry={refetch} label="Loading campaigns...">
        {items.length === 0 ? (
          <Card className="py-16 text-center">
            <img
              src={images.hero.screens}
              alt=""
              className="mx-auto mb-4 h-40 w-64 rounded-xl object-cover"
            />
            <p className="text-gray-500">
              {search ? "No campaigns match your search." : "No campaigns yet."}
            </p>
            {!search && (
              <Link to="/campaigns/new" className="mt-4 inline-block">
                <Button>Create campaign</Button>
              </Link>
            )}
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => (
                <Card key={c.id} className="flex flex-col">
                  <img
                    src={getCategoryImage(c.category)}
                    alt=""
                    className="-mx-6 -mt-6 mb-4 h-36 w-[calc(100%+3rem)] rounded-t-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-dark">{c.name}</h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                          c.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.status || "active"}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {c.city || "—"} · {c.radius || "—"} km radius
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {c.start_date || "—"} → {c.end_date || "—"}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to={`/campaigns/${c.id}/assign`}
                        className="text-sm font-semibold text-admax-green hover:underline"
                      >
                        Assign to screens →
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={busyId === c.id}
                        onClick={() => toggleStatus(c)}
                      >
                        {c.status === "active" ? "Pause" : "Resume"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </QueryBoundary>
    </DashboardLayout>
  );
}
