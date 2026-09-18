import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using AdMax India's platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Service Description",
    content:
      "AdMax India provides a hyperlocal advertising network connecting businesses with digital screens in restaurants, gyms, hospitals, salons, and other establishments. Advertisers can create campaigns targeting specific geographic areas.",
  },
  {
    title: "3. User Accounts",
    content:
      "You must register for an account to use our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 18 years old to create an account.",
  },
  {
    title: "4. Advertiser Obligations",
    content:
      "Advertisers must ensure their ad content complies with all applicable laws and our content guidelines. We reserve the right to reject or remove any ad that violates our policies. You retain ownership of your ad content but grant us a license to display it on our network.",
  },
  {
    title: "5. Screen Partner Obligations",
    content:
      "Screen partners must maintain operational screens and provide accurate location information. Partners agree to display approved ads during agreed time slots. Payment terms are outlined in the Partner Agreement.",
  },
  {
    title: "6. Payment Terms",
    content:
      "All payments are processed through Razorpay. Advertisers are charged based on the selected campaign plan. Refunds are subject to our Refund Policy. Screen partners are paid monthly based on screen performance.",
  },
  {
    title: "7. Content Guidelines",
    content:
      "Prohibited content includes: illegal products/services, explicit material, misleading claims, hate speech, weapons, tobacco, and alcohol (subject to local regulations). We reserve the right to determine content appropriateness.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "AdMax India and all related trademarks are owned by AdMax India Private Limited. Users retain rights to their content but grant us a non-exclusive license to use, display, and distribute content through our network.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "AdMax India is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the last 3 months. We do not guarantee specific campaign results or screen uptime.",
  },
  {
    title: "10. Termination",
    content:
      "We may suspend or terminate accounts for violations of these terms. Users may cancel their accounts at any time. Upon termination, active campaigns may be paused and refunds processed according to our Refund Policy.",
  },
  {
    title: "11. Changes to Terms",
    content:
      "We may modify these terms at any time. Continued use after changes constitutes acceptance. Material changes will be communicated via email 30 days in advance.",
  },
  {
    title: "12. Governing Law",
    content:
      "These terms are governed by the laws of India. Disputes will be subject to the exclusive jurisdiction of courts in Pune, Maharashtra.",
  },
];

export default function Terms() {
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
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-admax-green">
              <FileText className="h-4 w-4" />
              Legal
            </div>
            <h1 className="font-display text-4xl font-extrabold text-dark lg:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: January 1, 2024</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Please read these terms carefully before using AdMax India&apos;s services. By using
              our platform, you agree to these terms.
            </p>
          </div>
        </div>

        <div className="container-page max-w-3xl py-12 lg:py-16">
          <div className="rounded-xl border border-gray-200 bg-white p-8 lg:p-12">
            {sections.map((section, idx) => (
              <div
                key={section.title}
                className={idx < sections.length - 1 ? "mb-10 border-b border-gray-100 pb-10" : ""}
              >
                <h2 className="mb-3 text-lg font-bold text-dark">{section.title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-admax-green-light p-8">
            <h3 className="text-base font-bold text-admax-green">Questions about these terms?</h3>
            <p className="mt-2 text-sm leading-relaxed text-green-800">
              If you have any questions about our Terms of Service, please contact us.
            </p>
            <Link to="/contact" className="mt-4 inline-block">
              <Button>Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
