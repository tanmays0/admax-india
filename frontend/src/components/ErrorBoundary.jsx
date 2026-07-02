import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface px-4">
          <div className="max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
            <h1 className="font-display text-2xl font-bold text-dark">Something went wrong</h1>
            <p className="mt-2 text-gray-600">
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-admax-green px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-admax-green-dark"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
