import { useMemo, useState } from "react";
import {
  Download,
  CreditCard,
  Receipt,
  IndianRupee,
  Calendar,
  MapPin,
  HelpCircle,
  FileText,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SearchInput, { Pagination } from "../components/ui/SearchPagination";
import { paginate } from "../utils/pagination";

const PER_PAGE = 5;

const invoices = [
  {
    id: "INV-2024-001",
    date: "Feb 15, 2024",
    campaign: "Summer Sale",
    amount: 4200,
    status: "paid",
  },
  {
    id: "INV-2024-002",
    date: "Feb 8, 2024",
    campaign: "Weekend Deal",
    amount: 2800,
    status: "paid",
  },
  {
    id: "INV-2024-003",
    date: "Feb 1, 2024",
    campaign: "Grand Opening",
    amount: 6500,
    status: "paid",
  },
  {
    id: "INV-2024-004",
    date: "Jan 25, 2024",
    campaign: "Health Week",
    amount: 3100,
    status: "paid",
  },
  {
    id: "INV-2024-005",
    date: "Jan 18, 2024",
    campaign: "New Year Promo",
    amount: 5400,
    status: "paid",
  },
  {
    id: "INV-2024-006",
    date: "Jan 10, 2024",
    campaign: "Lunch Special",
    amount: 1900,
    status: "pending",
  },
];

const statusConfig = {
  paid: { className: "bg-green-100 text-green-700", label: "Paid" },
  pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
  overdue: { className: "bg-red-100 text-red-700", label: "Overdue" },
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Billing() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const totalSpent = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const thisMonth = invoices
    .filter((i) => i.date.includes("Feb"))
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
  }, [search]);

  const { items, totalPages, page: safePage } = paginate(filtered, page, PER_PAGE);

  return (
    <DashboardLayout
      activePage="/billing"
      title="Billing & Payments"
      subtitle="Manage your invoices and payment methods"
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchInput
                  value={search}
                  onChange={(v) => {
                    setSearch(v);
                    setPage(1);
                  }}
                  placeholder="Search invoices..."
                  className="w-full sm:w-56"
                />
                <Button variant="secondary" size="sm" className="gap-2 shrink-0">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No invoices match your search.
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Invoice ID", "Date", "Campaign", "Amount", "Status", ""].map((h) => (
                          <th
                            key={h || "action"}
                            className="pb-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((inv) => {
                        const config = statusConfig[inv.status] || statusConfig.paid;
                        return (
                          <tr key={inv.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                            <td className="py-3.5 pr-4 text-sm font-semibold text-admax-green">
                              {inv.id}
                            </td>
                            <td className="px-4 py-3.5 text-sm text-gray-500">{inv.date}</td>
                            <td className="px-4 py-3.5 text-sm text-gray-700">{inv.campaign}</td>
                            <td className="px-4 py-3.5 font-mono text-sm font-bold text-dark">
                              {formatCurrency(inv.amount)}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
                              >
                                {config.label}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 text-right">
                              <button
                                type="button"
                                className="text-sm font-semibold text-admax-green hover:underline"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {items.map((inv) => {
                    const config = statusConfig[inv.status] || statusConfig.paid;
                    return (
                      <div
                        key={inv.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <span className="text-sm font-semibold text-admax-green">{inv.id}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${config.className}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-dark">{inv.campaign}</p>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                          <span>{inv.date}</span>
                          <span className="font-mono font-bold text-dark">
                            {formatCurrency(inv.amount)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="mt-3 flex items-center gap-1 text-sm font-semibold text-admax-green"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                      </div>
                    );
                  })}
                </div>

                <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 font-display font-bold text-dark">Payment Method</h3>
            <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-dark to-gray-800 p-6 text-white">
              <div className="absolute -right-5 -top-5 h-24 w-24 bg-admax-green/10 [clip-path:polygon(100%_0,100%_100%,0_0)]" />
              <div className="mb-5 flex items-center gap-2 text-xs text-white/70">
                <CreditCard className="h-4 w-4" />
                Credit Card
              </div>
              <p className="mb-5 font-mono text-lg font-bold tracking-widest">
                •••• •••• •••• 4242
              </p>
              <div className="flex justify-between text-xs text-white/70">
                <span>Expires 12/25</span>
                <span className="font-bold tracking-wider">VISA</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              Update Payment Method
            </Button>
          </Card>

          <Card>
            <h3 className="mb-4 font-display font-bold text-dark">Billing Address</h3>
            <div className="space-y-1 text-sm text-gray-500">
              <p className="font-semibold text-dark">My Business</p>
              <p>123 Business Street</p>
              <p>Baner, Pune 411045</p>
              <p>Maharashtra, India</p>
            </div>
            <Button variant="secondary" className="mt-5 w-full gap-2">
              <MapPin className="h-4 w-4" />
              Edit Address
            </Button>
          </Card>
        </div>
      </div>

      <Card className="mt-6 flex flex-col items-start gap-4 border-admax-green/20 bg-admax-green-light sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
          <HelpCircle className="h-6 w-6 text-admax-green" />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-admax-green">Need help with billing?</p>
          <p className="mt-1 text-sm text-gray-600">
            Contact our support team for any billing-related queries
          </p>
        </div>
        <Button>Contact Support</Button>
      </Card>
    </DashboardLayout>
  );
}
