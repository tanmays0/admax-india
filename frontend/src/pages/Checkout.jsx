import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Building2,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import API from "../services/api";
import { images } from "../constants/images";
import Button from "../components/ui/Button";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { startStripeCheckout } from "../services/stripe";

const paymentMethods = [
  {
    id: "card",
    label: "Credit / Debit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard, RuPay",
  },
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, desc: "All major banks" },
  { id: "wallet", label: "Wallets", icon: Wallet, desc: "Paytm, PhonePe, Amazon Pay" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const campaignData = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [stripeEnabled, setStripeEnabled] = useState(false);

  const orderSummary = {
    campaignName: campaignData.campaignName || "Summer Campaign",
    screens: campaignData.screens || 8,
    duration: campaignData.duration || 7,
    basePrice: 400,
  };

  const subtotal = orderSummary.basePrice * orderSummary.screens * (orderSummary.duration / 7);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  useEffect(() => {
    let cancelled = false;
    API.get("/stripe/config")
      .then((res) => {
        if (!cancelled) setStripeEnabled(Boolean(res.data?.configured));
      })
      .catch(() => {
        if (!cancelled) setStripeEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePayment = async () => {
    if (!agreeTerms) {
      setTermsError("Please accept the terms and conditions");
      toast.error("Please accept the terms and conditions");
      return;
    }
    setTermsError("");

    if (!isAuthenticated) {
      toast.error("Please sign in to complete payment");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    setLoading(true);

    try {
      // Prefer Stripe Checkout when configured
      if (stripeEnabled) {
        await startStripeCheckout({
          amount: Math.round(total),
          campaignId: campaignData.campaignId,
          successPath: "/payment-success",
          cancelPath: "/checkout",
        });
        return;
      }

      const { data } = await API.post("/payments/create-order", {
        amount: total,
        campaignId: campaignData.campaignId,
      });

      // Dev / no Razorpay key — complete payment through backend mock
      if (data.mock || !import.meta.env.VITE_RAZORPAY_KEY || !window.Razorpay) {
        await API.post("/payments/verify", {
          order_id: data.orderId,
          payment_id: `pay_mock_${Date.now()}`,
        });
        toast.success("Payment recorded (dev mode)");
        navigate("/payment-success", { state: { orderId: data.orderId } });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || data.key,
        amount: data.amount,
        currency: "INR",
        name: "AdMax India",
        description: `Payment for ${orderSummary.campaignName}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate("/payment-success", { state: { orderId: response.razorpay_order_id } });
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: campaignData.userName || "",
          email: campaignData.userEmail || "",
          contact: campaignData.userPhone || "",
        },
        theme: {
          color: "#1F7A4D",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src={images.pages.checkout}
          alt="Your campaign on local screens"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-admax-green">
            Campaign checkout
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">{orderSummary.campaignName}</h2>
          <p className="mt-2 text-sm text-gray-300">
            {orderSummary.screens} screens · {orderSummary.duration} days
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton variant="pill" />
            <Logo size="md" />
            <div>
              <div className="font-display text-lg font-extrabold text-dark">AdMax India</div>
              <div className="text-xs text-gray-500">Secure Checkout</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            SSL Secured Payment
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-dark lg:text-3xl">
              Complete your purchase
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Choose your payment method and confirm
            </p>

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
              <h3 className="mb-5 text-base font-bold text-dark">Payment Method</h3>
              <div className="mb-6 space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition ${
                        active
                          ? "border-admax-green bg-admax-green-light"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            active ? "bg-admax-green text-white" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-sm font-bold ${
                              active ? "text-admax-green" : "text-dark"
                            }`}
                          >
                            {method.label}
                          </div>
                          <div className="text-xs text-gray-500">{method.desc}</div>
                        </div>
                        {active && <CheckIcon />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <div className="text-sm font-semibold text-amber-900">Secure Payment</div>
                  <div className="mt-1 text-xs leading-relaxed text-amber-800">
                    Your payment information is encrypted and secure. We never store your card
                    details.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (e.target.checked) setTermsError("");
                  }}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-admax-green focus:ring-admax-green"
                />
                <span className="text-sm leading-relaxed text-gray-500">
                  I agree to AdMax India&apos;s{" "}
                  <Link to="/terms" className="font-semibold text-admax-green hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link to="/privacy" className="font-semibold text-admax-green hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/refund-policy" className="font-semibold text-admax-green hover:underline">
                    Refund Policy
                  </Link>
                </span>
              </label>
              {termsError && (
                <p className="mt-2 text-xs text-red-600" role="alert">
                  {termsError}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 lg:p-8">
              <h3 className="mb-5 text-lg font-bold text-dark">Order Summary</h3>

              <div className="mb-6 rounded-lg bg-surface p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-dark">
                  <Building2 className="h-4 w-4 text-admax-green" />
                  {orderSummary.campaignName}
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Screens:</span>
                    <span className="font-mono font-semibold text-dark">
                      {orderSummary.screens}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-mono font-semibold text-dark">
                      {orderSummary.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate per screen:</span>
                    <span className="font-mono font-semibold text-dark">
                      ₹{orderSummary.basePrice}/week
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-mono font-semibold text-dark">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-mono font-semibold text-dark">
                    ₹{Math.round(tax).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-admax-green-light p-5">
                <div className="text-sm text-green-800">Total Amount</div>
                <div className="font-display text-3xl font-extrabold text-admax-green">
                  ₹{Math.round(total).toLocaleString()}
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                loading={loading}
                className="mt-6 w-full gap-2"
              >
                <Lock className="h-4 w-4" />
                Proceed to Payment
              </Button>

              <p className="mt-4 text-center text-xs text-gray-400">
                Powered by {stripeEnabled ? "Stripe" : "Razorpay"} · 100% Secure
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-admax-green" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
