import { PageLoader } from "./ui/Loading";

export default function QueryBoundary({ loading, error, onRetry, children, label }) {
  if (loading) return <PageLoader label={label} />;
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm text-red-700">Failed to load data.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 text-sm font-semibold text-admax-green hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }
  return children;
}
