import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  List,
} from "lucide-react";
import { images } from "../constants/images";
import Button from "../components/ui/Button";

const nextSteps = [
  "Our team will review your campaign within 2 hours",
  "You'll receive an email confirmation once approved",
  "Your ads will go live on selected screens within 24 hours",
  "Track performance in real-time from your dashboard",
];

export default function PaymentSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || "ADM-2024-001";

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
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <img src={images.logo} alt="AdMax" className="h-10 w-10 rounded-lg" />
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
                <span className="font-mono font-bold text-dark">{orderId}</span>
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
                  Card
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
            <Link to="/campaigns">
              <Button variant="secondary" className="gap-2">
                <List className="h-4 w-4" />
                View Campaigns
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
  );
}
