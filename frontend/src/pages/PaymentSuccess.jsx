import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  List,
} from "lucide-react";
import Button from "../components/ui/Button";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import { images } from "../constants/images";
import API from "../services/api";
import { useAuth } from "../hooks/useAuth";

const nextSteps = [
  "Our team will review your campaign within 2 hours",
  "You'll receive an email confirmation once approved",
  "Your ads will go live on selected screens within 24 hours",
  "Track performance in real-time from your dashboard",
];

export default function PaymentSuccess() {
  const location = useLocation();
  const [params] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const sessionId = params.get("session_id");
  const [orderId, setOrderId] = useState(location.state?.orderId || sessionId || "ADM-2024-001");
  const [paymentMethod, setPaymentMethod] = useState(sessionId ? "Stripe" : "Card");

  useEffect(() => {
    if (!sessionId || !isAuthenticated) return;
    let cancelled = false;
    API.get(`/stripe/session/${sessionId}`)
      .then((res) => {
        if (cancelled) return;
        setOrderId(res.data.id);
        setPaymentMethod(res.data.mode === "subscription" ? "Stripe subscription" : "Stripe");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sessionId, isAuthenticated]);

  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ["#1F7A4D", "#FF6B35", "#3b82f6"];

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 3;
      const confetti = window.confetti;
      if (confetti) {
        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: colors,
        });
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={images.pages.paymentSuccess}
          alt="Campaign going live on screens"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-dark/20" />
        <div className="absolute bottom-12 left-10 right-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-admax-green">
            Going live soon
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">Your ads are on their way</h2>
          <p className="mt-3 text-sm text-gray-300">
            Selected screens will start showing your campaign within 24 hours.
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <BackButton variant="pill" />
            <Logo size="md" />
            <div>
              <div className="font-display text-lg font-extrabold text-dark">AdMax India</div>
              <div className="text-xs text-gray-500">Payment Successful</div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-lg text-center">
            <div className="relative mb-8 inline-block">
              <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-admax-green-light">
                <CheckCircle2 className="h-14 w-14 text-admax-green" />
              </div>
              <span className="absolute inset-0 -m-4 animate-ping rounded-full border-2 border-admax-green-light opacity-75" />
              <span className="absolute inset-0 -m-8 animate-ping rounded-full border-2 border-admax-green-light opacity-50 [animation-delay:500ms]" />
            </div>

            <h1 className="font-display text-3xl font-extrabold text-dark lg:text-4xl">
              Payment Successful
            </h1>
            <p className="mt-4 text-base leading-relaxed text-gray-500">
              Your campaign is now being set up. You&apos;ll receive a confirmation email shortly
              with all the details.
            </p>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-left">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Order Details
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order ID</span>
                  <span className="max-w-[60%] truncate font-mono font-bold text-dark">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="rounded bg-green-100 px-3 py-0.5 text-[11px] font-bold text-green-700">
                    CONFIRMED
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="flex items-center gap-1.5 font-semibold text-dark">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-admax-green-light p-6 text-left">
              <h3 className="mb-4 text-base font-bold text-admax-green">What happens next?</h3>
              <div className="space-y-3">
                {nextSteps.map((item, idx) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-admax-green text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-green-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/dashboard">
                <Button className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/billing">
                <Button variant="secondary" className="gap-2">
                  <List className="h-4 w-4" />
                  View Billing
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-gray-400">
              Need help?{" "}
              <Link to="/contact" className="font-semibold text-admax-green hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
