import { BadgeCheck, Phone } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import { images } from "../constants/images";

const sections = [
  {
    title: "1. Refund Eligibility",
    content:
      "Refunds are available for campaigns that have not yet started or within the first 7 days of campaign launch if you're not satisfied with the service. Active campaigns that have been running for more than 7 days are not eligible for refunds.",
  },
  {
    title: "2. How to Request a Refund",
    content:
      "To request a refund, contact our support team at support@admaxindia.com with your campaign ID and reason for refund. Include your registered email address and payment transaction ID for faster processing.",
  },
  {
    title: "3. Refund Processing Time",
    content:
      "Approved refunds are processed within 5-7 business days. The amount will be credited to your original payment method. Bank transfer refunds may take an additional 3-5 business days depending on your bank.",
  },
  {
    title: "4. Partial Refunds",
    content:
      "If you cancel a campaign mid-way, you may be eligible for a partial refund based on unused campaign days. The refund amount is calculated proportionally, minus any service fees and used campaign portion.",
  },
  {
    title: "5. Non-Refundable Items",
    content:
      "The following are non-refundable: setup fees (if applicable), ad production costs, completed campaigns, subscription fees after the trial period, and custom integration work.",
  },
  {
    title: "6. Campaign Cancellation",
    content:
      "You can cancel active campaigns anytime from your dashboard. Cancellation takes effect within 24 hours. Refunds for cancelled campaigns follow the partial refund policy outlined above.",
  },
  {
    title: "7. Technical Issues",
    content:
      "If your campaign experiences technical issues or screens go offline for extended periods, you're entitled to pro-rated credits or refunds. Report issues within 48 hours for faster resolution.",
  },
  {
    title: "8. Disputed Charges",
    content:
      "If you notice unauthorized charges, contact us immediately at billing@admaxindia.com. We will investigate and resolve disputes within 10 business days. Chargeback disputes may result in account suspension.",
  },
  {
    title: "9. Subscription Plans",
    content:
      "Monthly and annual subscriptions can be cancelled anytime. Refunds for subscriptions are prorated based on unused time, minus the current billing cycle. No refunds for promotional discounts or special offers.",
  },
  {
    title: "10. Quality Guarantee",
    content:
      "We stand behind the quality of our service. If you're not satisfied with your campaign performance in the first 7 days, we offer a full refund—no questions asked.",
  },
  {
    title: "11. Modifications to Policy",
    content:
      "We reserve the right to modify this refund policy at any time. Changes will be communicated via email to all active users. Continued use after changes constitutes acceptance of the new policy.",
  },
  {
    title: "12. Contact Information",
    content:
      "For refund requests or questions about this policy, contact our billing team at billing@admaxindia.com or call +91 9923191542 (Mon-Sat, 9am-7pm IST).",
  },
];

export default function RefundPolicy() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-surface">
        <div className="relative border-b border-gray-200 bg-white py-16 lg:py-20">
          <img
            src={images.pages.legal}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-10"
          />
          <div className="container-page relative max-w-3xl">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-admax-green">
              Legal
            </div>
            <h1 className="font-display text-4xl font-extrabold text-dark lg:text-5xl">
              Refund Policy
            </h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: January 1, 2024</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              We want you to be completely satisfied with our service. This policy outlines our
              refund and cancellation terms.
            </p>
          </div>
        </div>

        <div className="container-page max-w-3xl py-12 lg:py-16">
          <div className="rounded-xl border border-gray-200 bg-white p-8 lg:p-12">
            {sections.map((section, idx) => (
              <div
                key={section.title}
                className={
                  idx < sections.length - 1
                    ? "mb-10 border-b border-gray-100 pb-10"
                    : ""
                }
              >
                <h2 className="mb-3 text-lg font-bold text-dark">{section.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-admax-green-light p-6">
              <BadgeCheck className="mb-3 h-8 w-8 text-admax-green" />
              <h3 className="text-base font-bold text-admax-green">7-Day Guarantee</h3>
              <p className="mt-2 text-sm leading-relaxed text-green-800">
                Not satisfied? Get a full refund within the first 7 days of your campaign.
              </p>
            </div>
            <div className="rounded-xl bg-gray-100 p-6">
              <Phone className="mb-3 h-8 w-8 text-dark" />
              <h3 className="text-base font-bold text-dark">Need Help?</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Contact our billing team for refund assistance.
              </p>
              <a
                href="mailto:billing@admaxindia.com"
                className="mt-3 inline-block text-sm font-semibold text-admax-green hover:underline"
              >
                billing@admaxindia.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
