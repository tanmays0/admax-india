import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Pause, Play, SkipForward, SkipBack } from "lucide-react";
import API from "../services/api";
import { PageLoader } from "../components/ui/Loading";
import { images } from "../constants/images";

const DEFAULT_DURATION_MS = 12000;

function normalizeAd(ad, index) {
  if (ad.title) return ad;
  return {
    id: ad.id || index,
    title: ad.title || `Ad ${index + 1}`,
    subtitle: ad.subtitle || "",
    media_url: ad.media_url,
    media_type: ad.media_type || "image",
    duration: (ad.duration || 15) * 1000,
    image: ad.media_url || images.placeholder.ad,
  };
}

const FALLBACK_ADS = [
  {
    id: 1,
    title: "Pizza Palace",
    subtitle: "50% off today! Visit us now.",
    image: images.categories.restaurant,
    media_type: "image",
    duration: 12000,
  },
  {
    id: 2,
    title: "IronFit Gym",
    subtitle: "Join this month. First week FREE.",
    image: images.categories.gym,
    media_type: "image",
    duration: 12000,
  },
  {
    id: 3,
    title: "Glow Salon",
    subtitle: "Haircut + styling from ₹299 only.",
    image: images.categories.salon,
    media_type: "image",
    duration: 12000,
  },
];

export default function Player() {
  const { screen_id } = useParams();
  const [ads, setAds] = useState([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const controlsTimerRef = useRef(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await API.get(`/player/${screen_id}`);
        const list = Array.isArray(res.data) ? res.data : [];
        if (list.length > 0) {
          setAds(list.map(normalizeAd));
        } else {
          setAds(FALLBACK_ADS);
        }
      } catch {
        setAds(FALLBACK_ADS);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [screen_id]);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const adDuration = ads[current]?.duration || DEFAULT_DURATION_MS;

  const advance = useCallback(() => {
    setCurrent((prev) => (ads.length ? (prev + 1) % ads.length : 0));
    setProgress(0);
  }, [ads.length]);

  useEffect(() => {
    const ad = ads[current];
    if (loading || !ad || !screen_id) return;
    // Only record plays for real API ads (numeric ids), not fallback creatives
    if (!ad.id || Number(ad.id) < 1) return;
    API.post(`/player/${screen_id}/play`, { ad_id: ad.id }).catch(() => {});
  }, [current, ads, loading, screen_id]);

  useEffect(() => {
    if (loading || paused || ads.length === 0) return;
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (adDuration / 100), 100));
    }, 100);

    intervalRef.current = setTimeout(advance, adDuration);

    return () => {
      clearInterval(progressIntervalRef.current);
      clearTimeout(intervalRef.current);
    };
  }, [current, loading, paused, ads.length, adDuration, advance]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <PageLoader label="Loading playlist..." />
      </div>
    );
  }

  const ad = ads[current];
  if (!ad) return null;

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const formatDate = (d) =>
    d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Ad display */}
      <div className="absolute inset-0">
        {ad.media_type === "video" && ad.media_url ? (
          <video
            key={ad.id}
            src={ad.media_url}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            key={ad.id}
            src={ad.image || ad.media_url}
            alt={ad.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <p className="text-sm font-medium uppercase tracking-widest text-admax-green">
          AdMax India
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{ad.title}</h1>
        {ad.subtitle && <p className="mt-2 max-w-xl text-lg text-gray-300">{ad.subtitle}</p>}
      </div>

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-black/50 px-6 py-4 backdrop-blur-sm">
        <span className="text-sm text-gray-400">Screen #{screen_id}</span>
        <div className="text-right text-sm">
          <p className="font-mono font-semibold">{formatTime(time)}</p>
          <p className="text-xs text-gray-400">{formatDate(time)}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-admax-green transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setCurrent((p) => (p - 1 + ads.length) % ads.length)}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Previous"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={advance}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Next"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Ad counter */}
      <div className="absolute bottom-4 right-6 text-xs text-gray-500">
        {current + 1} / {ads.length}
      </div>
    </div>
  );
}
