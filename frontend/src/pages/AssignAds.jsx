import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, ImageIcon, Monitor, Link2 } from "lucide-react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { PageLoader } from "../components/ui/Loading";
import { images } from "../constants/images";

export default function AssignAds() {
  const { id: campaignId } = useParams();
  const [ads, setAds] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adsRes, screensRes] = await Promise.all([API.get("/ads"), API.get("/screens")]);
      setAds(adsRes.data);
      setScreens(screensRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load ads and screens");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (id) => {
    setSelectedScreens((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (!selectedAd || selectedScreens.length === 0) {
      toast.error("Please select an ad and at least one screen");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/assign/assign", {
        ad_id: Number(selectedAd),
        screen_ids: selectedScreens.map(Number),
        campaign_id: campaignId ? Number(campaignId) : null,
      });
      toast.success("Ads assigned successfully");
      setSelectedAd("");
      setSelectedScreens([]);
    } catch (err) {
      toast.error("Assignment failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      activePage="/ads"
      title="Assign Ads to Screens"
      subtitle="Connect your ads with specific screen locations"
    >
      {loading ? (
        <PageLoader label="Loading ads and screens..." />
      ) : (
        <>
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-dark">
                <ImageIcon className="h-5 w-5 text-admax-green" />
                Select Ad
              </h2>

              {ads.length === 0 ? (
                <div className="py-10 text-center">
                  <img
                    src={images.placeholder.ad}
                    alt=""
                    className="mx-auto mb-4 h-24 w-24 rounded-xl object-cover opacity-60"
                  />
                  <p className="text-sm text-gray-500">No ads available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ads.map((ad) => {
                    const selected = selectedAd === ad.id;
                    return (
                      <button
                        key={ad.id}
                        type="button"
                        onClick={() => setSelectedAd(ad.id)}
                        className={`w-full rounded-xl border-2 p-4 text-left transition ${
                          selected
                            ? "border-admax-green bg-admax-green-light"
                            : "border-gray-200 bg-surface hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                selected ? "text-admax-green" : "text-dark"
                              }`}
                            >
                              Ad #{ad.id}
                            </p>
                            {ad.name && (
                              <p className="text-xs text-gray-500">{ad.name}</p>
                            )}
                            {ad.title && !ad.name && (
                              <p className="text-xs text-gray-500">{ad.title}</p>
                            )}
                          </div>
                          {selected && <Check className="h-5 w-5 text-admax-green" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-dark">
                <Monitor className="h-5 w-5 text-admax-green" />
                Select Screens
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {selectedScreens.length} selected
                </span>
              </h2>

              {screens.length === 0 ? (
                <div className="py-10 text-center">
                  <img
                    src={images.hero.screens}
                    alt=""
                    className="mx-auto mb-4 h-24 w-40 rounded-xl object-cover opacity-60"
                  />
                  <p className="text-sm text-gray-500">No screens available</p>
                </div>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
                  {screens.map((screen) => {
                    const checked = selectedScreens.includes(screen.id);
                    return (
                      <button
                        key={screen.id}
                        type="button"
                        onClick={() => handleCheckbox(screen.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                          checked
                            ? "border-admax-green bg-admax-green-light"
                            : "border-gray-200 bg-surface hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                            checked
                              ? "border-admax-green bg-admax-green"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-semibold ${
                              checked ? "text-admax-green" : "text-dark"
                            }`}
                          >
                            {screen.shop_name}
                          </p>
                          <p className="text-xs text-gray-500">{screen.city}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link2 className="h-4 w-4 shrink-0 text-gray-400" />
              {selectedAd && selectedScreens.length > 0 ? (
                <span>
                  Assigning Ad #{selectedAd} to {selectedScreens.length} screen
                  {selectedScreens.length !== 1 ? "s" : ""}
                </span>
              ) : (
                <span>Select an ad and at least one screen to continue</span>
              )}
            </div>
            <Button
              onClick={handleAssign}
              disabled={!selectedAd || selectedScreens.length === 0}
              loading={submitting}
              className="shrink-0"
            >
              Assign
            </Button>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
