import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Download,
  CreditCard,
  Receipt,
  IndianRupee,
  Calendar,
  MapPin,
  HelpCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchInput, { Pagination } from "../components/ui/SearchPagination";
import QueryBoundary from "../components/QueryBoundary";
import { paginate } from "../utils/pagination";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { openStripePortal } from "../services/stripe";

const PER_PAGE = 5;

const statusConfig = {
  paid: { className: "bg-green-100 text-green-700", label: "Paid" },
  created: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
  pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
  failed: { className: "bg-red-100 text-red-700", label: "Failed" },
  refunded: { className: "bg-gray-100 text-gray-600", label: "Refunded" },
  active: { className: "bg-green-100 text-green-700", label: "Active" },
  trialing: { className: "bg-blue-100 text-blue-700", label: "Trialing" },
  past_due: { className: "bg-red-100 text-red-700", label: "Past due" },
  canceled: { className: "bg-gray-100 text-gray-600", label: "Canceled" },
};

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

export default function Billing() {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch("/payments", { fallback: [] });
  const {
    data: subData,
    loading: subLoading,
    refetch: refetchSub,
  } = useFetch("/stripe/subscription", { fallback: null });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [portalLoading, setPortalLoading] = useState(false);

  const subscription = subData?.subscription || null;
  const stripeConfigured = Boolean(subData?.stripeConfigured);

  const invoices = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.map((p) => ({
      id: p.order_id,
      date: formatDate(p.created_at),
      rawDate: p.created_at,
      campaign: p.campaign_name || (p.provider === "stripe" ? "Stripe payment" : "Campaign payment"),
      amount: Number(p.amount) || 0,
      status: p.status === "created" ? "pending" : p.status,
      provider: p.provider || "mock",
    }));
  }, [data]);

  const totalSpent = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.amount, 0);
  const now = new Date();
  const thisMonth = invoices
    .filter((i) => {
      const d = new Date(i.rawDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, i) => s + i.amount, 0);

  const stats = [
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: IndianRupee, color: "text-admax-green" },
    { label: "This Month", value: formatCurrency(thisMonth), icon: Calendar, color: "text-blue-600" },
    { label: "Pending", value: formatCurrency(pending), icon: Receipt, color: "text-yellow-600" },
    { label: "Invoices", value: invoices.length, icon: FileText, color: "text-purple-600" },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter(
      (inv) =>
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.campaign.toLowerCase().includes(q) ||
        inv.date.toLowerCase().includes(q)
    );
  }, [search, invoices]);

  const { items, totalPages, page: safePage } = paginate(filtered, page, PER_PAGE);

  const billingAddress = [user?.business_name, user?.location, user?.city, user?.pincode]
    .filter(Boolean)
    .join(", ");

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      await openStripePortal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not open Stripe portal");
      setPortalLoading(false);
    }
  };

  const subStatus = subscription?.status || "none";
  const subStatusUi = statusConfig[subStatus] || statusConfig.pending;

  return (
    <DashboardLayout
      activePage="/billing"
      title="Billing & Payments"
      subtitle="Manage your invoices, subscription, and payment methods"
    >
      <QueryBoundary
        loading={loading || subLoading}
        error={error}
        onRetry={() => {
          refetch();
          refetchSub();
        }}
        label="Loading billing..."
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-admax-green-light">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className={`font-mono text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display font-bold text-dark">Recent Invoices</h3>
                <SearchInput
                  value={search}
                  onChange={(v) => {
                    setSearch(v);
                    setPage(1);
                  }}
                  placeholder="Search invoices..."
                  className="w-full sm:w-56"
                />
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  No payments yet. Launch a campaign or subscribe from Pricing to see invoices here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                        <th className="pb-3 font-semibold">Invoice</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Campaign</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {items.map((inv) => {
                        const config = statusConfig[inv.status] || statusConfig.pending;
                        return (
                          <tr key={inv.id}>
                            <td className="py-3 font-mono text-xs font-semibold text-dark">
                              {inv.id}
                            </td>
                            <td className="py-3 text-gray-600">{inv.date}</td>
                            <td className="py-3 text-gray-700">{inv.campaign}</td>
                            <td className="py-3 font-semibold text-dark">
                              {formatCurrency(inv.amount)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
                              >
                                {config.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-admax-green" />
                <h3 className="font-display font-bold text-dark">Subscription</h3>
              </div>
              {subscription ? (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Plan</span>
                    <span className="font-semibold capitalize text-dark">{subscription.plan_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${subStatusUi.className}`}>
                      {subStatusUi.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Renews</span>
                    <span className="font-semibold text-dark">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  No active Stripe subscription. Choose a plan on Pricing to get started.
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {stripeConfigured && (
                  <Button size="sm" loading={portalLoading} onClick={handlePortal}>
                    Manage subscription <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Link to="/pricing">
                  <Button size="sm" variant="secondary">
                    View plans
                  </Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-admax-green" />
                <h3 className="font-display font-bold text-dark">Payment method</h3>
              </div>
              <p className="text-sm text-gray-600">
                {stripeConfigured
                  ? "Cards are managed securely in the Stripe customer portal. Campaign checkout also supports Razorpay when configured."
                  : "Payments are processed via Razorpay or mock checkout until Stripe keys are configured."}
              </p>
              <Link to="/checkout" className="mt-4 inline-block">
                <Button size="sm" variant="secondary">
                  Go to checkout
                </Button>
              </Link>
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-admax-green" />
                <h3 className="font-display font-bold text-dark">Billing address</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {billingAddress || "Add your business address in Settings."}
              </p>
              <Link to="/settings" className="mt-4 inline-block">
                <Button size="sm" variant="secondary">
                  Edit in Settings
                </Button>
              </Link>
            </Card>

            <Card className="bg-admax-green-light">
              <div className="mb-2 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-admax-green" />
                <h3 className="font-display font-bold text-dark">Need help?</h3>
              </div>
              <p className="text-sm text-gray-600">Questions about invoices or refunds?</p>
              <Link to="/help" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-admax-green">
                Visit Help Center <Download className="h-3.5 w-3.5 rotate-[-90deg]" />
              </Link>
            </Card>
          </div>
        </div>
      </QueryBoundary>
    </DashboardLayout>
  );
}
