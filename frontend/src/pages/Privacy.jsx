import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { images } from "../constants/images";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly (name, email, phone, business details), automatically (IP address, browser type, device information, usage data), and from third parties (payment processors, analytics providers).",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your information to: provide and improve our services, process payments, communicate with you, personalize your experience, analyze platform usage, prevent fraud and abuse, and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    content:
      "We do not sell your personal information. We share data with: service providers (payment processors, hosting), screen partners (for ad display), analytics providers, and law enforcement (when legally required).",
  },
  {
    title: "4. Data Security",
    content:
      "We implement industry-standard security measures including encryption, secure servers, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "5. Cookies and Tracking",
    content:
      "We use cookies and similar technologies to: maintain your session, remember preferences, analyze usage patterns, and deliver targeted advertising. You can control cookies through your browser settings.",
  },
  {
    title: "6. Your Rights",
    content:
      "You have the right to: access your personal data, correct inaccurate data, delete your account, opt-out of marketing communications, and export your data. Contact us to exercise these rights.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance and fraud prevention.",
  },
  {
    title: "8. Children's Privacy",
    content:
      "Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we learn we have collected such information, we will delete it immediately.",
  },
  {
    title: "9. International Data Transfers",
    content:
      "Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place for such transfers in compliance with applicable laws.",
  },
  {
    title: "10. Third-Party Links",
    content:
      "Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these sites. Please review their privacy policies before providing any information.",
  },
  {
    title: "11. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Material changes will be notified via email or prominent notice on our platform. Continued use after changes constitutes acceptance.",
  },
  {
    title: "12. Contact Us",
    content:
      "For privacy-related questions or to exercise your rights, contact us at privacy@admaxindia.com or Sterling Towers, Amanora Park Town, Hadapsar, Pune, Maharashtra - 411028.",
  },
];

export default function Privacy() {
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
              <Shield className="h-4 w-4" />
              Legal
            </div>
            <h1 className="font-display text-4xl font-extrabold text-dark lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: January 1, 2024</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your personal information.
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
            <h3 className="text-base font-bold text-admax-green">Questions about your privacy?</h3>
            <p className="mt-2 text-sm leading-relaxed text-green-800">
              If you have concerns about how we handle your data, we&apos;re here to help.
            </p>
            <a href="mailto:privacy@admaxindia.com" className="mt-4 inline-block">
              <Button>Email Privacy Team</Button>
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
