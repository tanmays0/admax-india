import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { User, Building2, Bell, Lock, Upload, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import API from "../services/api";
import { images } from "../constants/images";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
];

const notificationItems = [
  {
    id: "campaign",
    label: "Campaign Updates",
    desc: "Get notified when your campaigns start, pause, or end",
  },
  {
    id: "reports",
    label: "Performance Reports",
    desc: "Weekly summary of your campaign performance",
  },
  {
    id: "billing",
    label: "Billing Alerts",
    desc: "Payment confirmations and invoice notifications",
  },
  { id: "marketing", label: "Marketing Emails", desc: "Tips, updates, and promotional offers" },
  { id: "screens", label: "Screen Network Updates", desc: "New screens added in your target area" },
];

const defaultPrefs = {
  campaign: true,
  reports: true,
  billing: true,
  marketing: false,
  screens: true,
};

function splitName(user) {
  if (user?.first_name || user?.last_name) {
    return {
      firstName: user.first_name || "",
      lastName: user.last_name || "",
    };
  }
  const parts = (user?.name || "").trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function parsePrefs(raw) {
  if (!raw) return { ...defaultPrefs };
  if (typeof raw === "object") return { ...defaultPrefs, ...raw };
  try {
    return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {
    return { ...defaultPrefs };
  }
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const fileRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [business, setBusiness] = useState({
    businessName: "",
    category: "Restaurant",
    address: "",
    city: "",
    pincode: "",
  });
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [profileErrors, setProfileErrors] = useState({});
  const [businessErrors, setBusinessErrors] = useState({});
  const [securityErrors, setSecurityErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!user) return;
    const names = splitName(user);
    setProfile({
      firstName: names.firstName,
      lastName: names.lastName,
      email: user.email || "",
      phone: user.phone || "",
    });
    setBusiness({
      businessName: user.business_name || "",
      category: user.category || "Restaurant",
      address: user.location || "",
      city: user.city || "",
      pincode: user.pincode || "",
    });
    setPrefs(parsePrefs(user.notification_prefs));
  }, [user]);

  const flash = (msg) => {
    setSaved(msg);
    toast.success(msg);
    setTimeout(() => setSaved(""), 3000);
  };

  const validateProfile = () => {
    const errors = {};
    if (!profile.firstName.trim()) errors.firstName = "First name is required";
    if (!profile.lastName.trim()) errors.lastName = "Last name is required";
    if (!profile.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      errors.email = "Enter a valid email address";
    return errors;
  };

  const validateBusiness = () => {
    const errors = {};
    if (!business.businessName.trim()) errors.businessName = "Business name is required";
    if (!business.city.trim()) errors.city = "City is required";
    if (business.pincode && !/^\d{6}$/.test(business.pincode))
      errors.pincode = "Enter a valid 6-digit pincode";
    return errors;
  };

  const validateSecurity = () => {
    const errors = {};
    if (!security.currentPassword) errors.currentPassword = "Current password is required";
    if (!security.newPassword) errors.newPassword = "New password is required";
    else if (security.newPassword.length < 8)
      errors.newPassword = "Password must be at least 8 characters";
    if (!security.confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (security.newPassword !== security.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    return errors;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    setProfileErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const res = await API.put("/auth/profile", {
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
      });
      updateUser(res.data.user);
      flash("Profile updated successfully.");
    } catch (err) {
      setProfileErrors({ form: err?.response?.data?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBusiness = async (e) => {
    e.preventDefault();
    const errors = validateBusiness();
    setBusinessErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const res = await API.put("/auth/profile", {
        business_name: business.businessName.trim(),
        category: business.category,
        location: business.address.trim(),
        city: business.city.trim(),
        pincode: business.pincode.trim(),
      });
      updateUser(res.data.user);
      flash("Business details updated.");
    } catch (err) {
      setBusinessErrors({ form: err?.response?.data?.message || "Failed to save business" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const res = await API.put("/auth/profile", { notification_prefs: prefs });
      updateUser(res.data.user);
      flash("Notification preferences saved.");
    } catch {
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    const errors = validateSecurity();
    setSecurityErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      await API.put("/auth/password", {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      flash("Password updated successfully.");
    } catch (err) {
      setSecurityErrors({
        form: err?.response?.data?.message || "Failed to update password",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const res = await API.post("/auth/avatar", formData);
      updateUser(res.data.user);
      flash("Profile photo updated.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const res = await API.delete("/auth/avatar");
      updateUser(res.data.user);
      flash("Profile photo removed.");
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Enter your password to confirm");
      return;
    }
    if (!window.confirm("Delete your account permanently? This cannot be undone.")) return;

    try {
      await API.delete("/auth/account", { data: { password: deletePassword } });
      toast.success("Account deleted");
      logout();
      window.location.href = "/";
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete account");
    }
  };

  const avatarSrc = user?.avatar_url || images.placeholder.avatar;

  return (
    <DashboardLayout
      activePage="/settings"
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      {saved && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {saved}
        </div>
      )}

      <div className="mb-8 flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-admax-green text-admax-green"
                : "border-transparent text-gray-500 hover:text-dark"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === "profile" && (
          <Card>
            <h3 className="mb-6 font-display text-lg font-bold text-dark">Profile Information</h3>

            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200"
              />
              <div className="flex gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Button
                  size="sm"
                  className="gap-2"
                  loading={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Button>
                {user?.avatar_url && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {profileErrors.form && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {profileErrors.form}
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  error={profileErrors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  error={profileErrors.lastName}
                />
              </div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                error={profileErrors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                error={profileErrors.phone}
                hint="Include country code, e.g. +91"
              />
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "business" && (
          <Card>
            <h3 className="mb-6 font-display text-lg font-bold text-dark">Business Details</h3>
            <form onSubmit={handleSaveBusiness} className="space-y-5">
              {businessErrors.form && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {businessErrors.form}
                </p>
              )}
              <Input
                label="Business Name"
                name="businessName"
                value={business.businessName}
                onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                error={businessErrors.businessName}
              />
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={business.category}
                  onChange={(e) => setBusiness({ ...business, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-dark outline-none transition focus:border-admax-green focus:ring-2 focus:ring-admax-green/20"
                >
                  {["Restaurant", "Gym", "Salon", "Hospital", "Pharmacy", "Cafe", "Retail"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    )
                  )}
                </select>
              </div>
              <Input
                label="Address"
                name="address"
                value={business.address}
                onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                error={businessErrors.address}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="City"
                  name="city"
                  value={business.city}
                  onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                  error={businessErrors.city}
                />
                <Input
                  label="Pincode"
                  name="pincode"
                  value={business.pincode}
                  onChange={(e) => setBusiness({ ...business, pincode: e.target.value })}
                  error={businessErrors.pincode}
                />
              </div>
              <Button type="submit" loading={saving}>
                Update Business
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card>
            <h3 className="mb-6 font-display text-lg font-bold text-dark">
              Notification Preferences
            </h3>
            <div className="divide-y divide-gray-100">
              {notificationItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-dark">{item.label}</p>
                    <p className="mt-0.5 text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(prefs[item.id])}
                      onChange={(e) => setPrefs((p) => ({ ...p, [item.id]: e.target.checked }))}
                      className="peer sr-only"
                    />
                    <div className="relative h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-admax-green peer-focus:ring-2 peer-focus:ring-admax-green/20 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
            <Button className="mt-6" loading={saving} onClick={handleSaveNotifications}>
              Save Preferences
            </Button>
          </Card>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <Card>
              <h3 className="mb-6 font-display text-lg font-bold text-dark">Change Password</h3>
              <form onSubmit={handleSaveSecurity} className="space-y-5">
                {securityErrors.form && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {securityErrors.form}
                  </p>
                )}
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                  error={securityErrors.currentPassword}
                />
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={security.newPassword}
                  onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                  error={securityErrors.newPassword}
                  hint="Minimum 8 characters"
                />
                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                  error={securityErrors.confirmPassword}
                />
                <Button type="submit" loading={saving}>
                  Update Password
                </Button>
              </form>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <h3 className="mb-2 font-display text-lg font-bold text-red-600">Danger Zone</h3>
              <p className="mb-4 text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Input
                label="Confirm with password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
