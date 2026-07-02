import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Monitor } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import SearchInput from "../components/ui/SearchPagination";
import Card from "../components/ui/Card";
import { images } from "../constants/images";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PUNE_CENTER = [18.5204, 73.8567];

export default function ScreenMap() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const screens = images.screens;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return screens.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [screens, search]);

  return (
    <PublicLayout>
      <section className="bg-dark py-16 text-white">
        <div className="container-page">
          <h1 className="font-display text-4xl font-bold">Screen network map</h1>
          <p className="mt-3 max-w-xl text-gray-400">
            Explore live and upcoming AdMax screens across Pune. Click a pin for details.
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="mb-6 max-w-md">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or city..."
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden p-0">
              <MapContainer
                center={PUNE_CENTER}
                zoom={12}
                className="h-[480px] w-full rounded-xl"
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filtered.map((screen) => (
                  <Marker
                    key={screen.id}
                    position={[screen.lat, screen.lng]}
                    eventHandlers={{ click: () => setSelected(screen) }}
                  >
                    <Popup>
                      <strong>{screen.name}</strong>
                      <br />
                      {screen.city}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="font-display font-bold text-dark">
              {filtered.length} screens found
            </h2>
            {filtered.map((screen) => (
              <button
                key={screen.id}
                type="button"
                onClick={() => setSelected(screen)}
                className={`w-full rounded-xl border p-4 text-left transition hover:shadow-md ${
                  selected?.id === screen.id
                    ? "border-admax-green bg-admax-green-light"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={screen.image}
                    alt={screen.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-dark">{screen.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {screen.city}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-admax-green">
                      <Monitor className="h-3 w-3" />
                      Live · 1080p
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
