import { useEffect, useState } from "react";
import API from "../services/api";

export default function AssignAds() {
  const [ads, setAds] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");
  const [selectedScreens, setSelectedScreens] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const adsRes = await API.get("/ads");
    const screensRes = await API.get("/screens");

    setAds(adsRes.data);
    setScreens(screensRes.data);
  };

  const handleCheckbox = (id) => {
    if (selectedScreens.includes(id)) {
      setSelectedScreens(selectedScreens.filter((s) => s !== id));
    } else {
      setSelectedScreens([...selectedScreens, id]);
    }
  };

  const handleAssign = async () => {
    try {
      await API.post("/assign/assign", {
        ad_id: selectedAd,
        screen_ids: selectedScreens,
      });

      alert("Assigned successfully 🚀");

    } catch (err) {
      alert("Assignment failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Assign Ads to Screens</h2>

      {/* Select Ad */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Ad:</label>
        <select
          value={selectedAd}
          onChange={(e) => setSelectedAd(e.target.value)}
        >
          <option value="">-- Select Ad --</option>
          {ads.map((ad) => (
            <option key={ad.id} value={ad.id}>
              Ad #{ad.id}
            </option>
          ))}
        </select>
      </div>

      {/* Screens */}
      <div>
        <h4>Select Screens:</h4>
        {screens.map((screen) => (
          <div key={screen.id}>
            <input
              type="checkbox"
              onChange={() => handleCheckbox(screen.id)}
            />
            {screen.shop_name} ({screen.city})
          </div>
        ))}
      </div>

      <button
        onClick={handleAssign}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "green",
          color: "white",
        }}
      >
        Assign
      </button>
    </div>
  );
}