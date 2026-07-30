import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Upload,
  CloudUpload,
  X,
  CheckCircle,
  Lightbulb,
  ClipboardList,
  Rocket,
} from "lucide-react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useFetch } from "../hooks/useFetch";
import { images } from "../constants/images";

const ACCEPTED = { "image/jpeg": "JPG", "image/png": "PNG", "video/mp4": "MP4" };
const MAX_SIZE = 50 * 1024 * 1024;

export default function UploadAd() {
  const fileInputRef = useRef(null);
  const { data: adsData, refetch: refetchAds } = useFetch("/ads", { fallback: [] });
  const recentAds = (Array.isArray(adsData) ? adsData : []).slice(0, 5);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(15);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateFile = (f) => {
    if (!ACCEPTED[f.type]) {
      toast.error("Only JPG, PNG, and MP4 files are allowed.");
      return false;
    }
    if (f.size > MAX_SIZE) {
      toast.error("File size must be under 50MB.");
      return false;
    }
    return true;
  };

  const handleFile = (f) => {
    setErrors((prev) => ({ ...prev, file: "" }));
    if (!validateFile(f)) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview({ url, type: f.type.startsWith("video") ? "video" : "image" });
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
    toast.success("File selected");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const validateForm = () => {
    const next = {};
    if (!file) next.file = "Please select a file to upload";
    if (!title.trim()) next.title = "Ad title is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before uploading");
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("media", file);
    formData.append("title", title);
    formData.append("duration", duration);

    try {
      await API.post("/ads/upload", formData, {
        onUploadProgress: (ev) => {
          if (ev.total) setProgress(Math.round((ev.loaded * 100) / ev.total));
        },
      });
      setSuccess(true);
      toast.success("Ad uploaded successfully!");
      refetchAds();
    } catch (err) {
      const message = err?.response?.data?.message || "Upload failed. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setDuration(15);
    setProgress(0);
    setSuccess(false);
    setErrors({});
  };

  return (
    <DashboardLayout
      activePage="/ads"
      title="Upload Ad Creative"
      subtitle="Upload an image or video that will display on AdMax screens"
    >
      <Link
        to="/ads"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-dark"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to My Ads
      </Link>

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200">
        <img
          src={images.placeholder.ad}
          alt="Ad creative preview"
          className="h-28 w-full object-cover sm:h-32"
        />
      </div>

      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                className={`rounded-xl border-2 border-dashed p-10 text-center transition ${
                  dragging
                    ? "border-admax-green bg-admax-green-light"
                    : file
                      ? "border-admax-green bg-green-50/50"
                      : "cursor-pointer border-gray-300 bg-white hover:border-admax-green hover:bg-surface"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.mp4"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) handleFile(e.target.files[0]);
                  }}
                />

                {!file ? (
                  <>
                    <CloudUpload className="mx-auto mb-4 h-14 w-14 text-gray-300" />
                    <p className="mb-1 text-lg font-semibold text-dark">Drop your file here</p>
                    <p className="mb-5 text-sm text-gray-500">or click to browse</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["JPG", "PNG", "MP4"].map((fmt) => (
                        <span
                          key={fmt}
                          className="rounded-full bg-admax-green-light px-3 py-1 text-xs font-bold text-admax-green"
                        >
                          {fmt}
                        </span>
                      ))}
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                        Max 50MB
                      </span>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="mb-4">
                      {preview?.type === "image" ? (
                        <img
                          src={preview.url}
                          alt="Preview"
                          className="mx-auto max-h-60 max-w-full rounded-lg object-contain"
                        />
                      ) : (
                        <video
                          src={preview.url}
                          controls
                          className="mx-auto max-h-60 max-w-full rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <span className="text-sm font-semibold text-dark">{file.name}</span>
                      <span className="rounded-full bg-admax-green-light px-2.5 py-0.5 text-xs font-bold text-admax-green">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          reset();
                        }}
                        className="gap-1 text-red-600 hover:border-red-200 hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              {errors.file && (
                <p className="text-xs text-red-600" role="alert">
                  {errors.file}
                </p>
              )}

              <Card>
                <h3 className="mb-5 font-display font-bold text-dark">Ad Details</h3>
                <div className="space-y-5">
                  <Input
                    label="Ad Title *"
                    name="title"
                    placeholder='e.g. "Summer Pizza Offer"'
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    error={errors.title}
                  />

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-700">Display Duration</p>
                    <div className="grid grid-cols-4 gap-3">
                      {[10, 15, 20, 30].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setDuration(sec)}
                          className={`rounded-lg border py-3 text-sm font-semibold transition ${
                            duration === sec
                              ? "border-admax-green bg-admax-green-light text-admax-green"
                              : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      How long your ad displays before rotating to the next
                    </p>
                  </div>
                </div>
              </Card>

              {(uploading || progress > 0) && (
                <Card>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Uploading...</span>
                    <span className="text-sm font-bold text-admax-green">{progress}%</span>
                  </div>
                  <progress
                    value={progress}
                    max={100}
                    className="h-2 w-full overflow-hidden rounded-full [&::-moz-progress-bar]:bg-admax-green [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-admax-green"
                  />
                </Card>
              )}

              <Button
                type="submit"
                disabled={uploading || !file}
                loading={uploading}
                size="lg"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Ad
              </Button>
            </div>

            <div className="space-y-5">
              <Card>
                <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-dark">
                  <ClipboardList className="h-4 w-4 text-admax-green" />
                  Ad Specs
                </h3>
                <div className="space-y-4">
                  {[
                    { fmt: "JPG / PNG", spec: "1920×1080px recommended" },
                    { fmt: "MP4 Video", spec: "Max 30s · H.264 codec" },
                    { fmt: "Aspect Ratio", spec: "16:9 landscape only" },
                    { fmt: "File Size", spec: "Maximum 50MB" },
                  ].map((s, i, arr) => (
                    <div
                      key={s.fmt}
                      className={i < arr.length - 1 ? "border-b border-gray-100 pb-4" : ""}
                    >
                      <p className="text-sm font-bold text-dark">{s.fmt}</p>
                      <p className="text-xs text-gray-500">{s.spec}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="rounded-xl bg-admax-green-light p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-admax-green">
                  <Lightbulb className="h-4 w-4" />
                  Tips for better ads
                </h3>
                <ul className="space-y-2">
                  {[
                    "Keep text large and readable",
                    "Use your brand colours prominently",
                    "Add a clear call-to-action",
                    "Include phone number or address",
                    "High-contrast visuals work best",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-xs leading-relaxed text-admax-green"
                    >
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-dark">Recent Ads</h3>
                  <Link
                    to="/ads"
                    className="text-xs font-semibold text-admax-green hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentAds.length === 0 ? (
                    <p className="text-xs text-gray-500">No ads uploaded yet.</p>
                  ) : (
                    recentAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="flex items-center gap-3 rounded-lg bg-surface p-3 transition hover:bg-gray-100"
                      >
                        <div
                          className={`h-10 w-1 shrink-0 rounded-full ${
                            ad.status === "approved" || ad.status === "active"
                              ? "bg-admax-green"
                              : "bg-amber-400"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-dark">
                            {ad.title || `Ad #${ad.id}`}
                          </p>
                          <p className="text-[11px] uppercase text-gray-400">
                            {ad.media_type || "image"} · {ad.duration || 15}s
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            ad.status === "approved" || ad.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {ad.status || "pending"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </form>
      ) : (
        <Card className="mx-auto max-w-lg py-14 text-center">
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-admax-green-light">
            <CheckCircle className="h-10 w-10 text-admax-green" />
          </div>
          <h2 className="mb-3 font-display text-2xl font-bold text-dark">
            Ad uploaded successfully!
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
            <strong className="text-dark">{title}</strong> has been submitted. It will be reviewed
            and go live within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/campaigns/new">
              <Button className="gap-2">
                <Rocket className="h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
            <Button variant="secondary" onClick={reset}>
              Upload another
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
