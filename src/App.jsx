import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Seattle area bounding box (lat/lon)
  const seattleBounds = {
    lamin: 47.3,
    lamax: 48.0,
    lomin: -123.2,
    lomax: -121.8,
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const url = `https://opensky-network.org/api/states/all?lamin=${seattleBounds.lamin}&lomin=${seattleBounds.lomin}&lamax=${seattleBounds.lamax}&lomax=${seattleBounds.lomax}`;
        const response = await axios.get(url);
        const data = response.data.states || [];
        setFlights(data);
      } catch (err) {
        setError("Failed to fetch flight data");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">
        Flights Near Balc
      </h1>

      {loading && <p className="text-center">Loading flight data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((flight, idx) => (
            <div
              key={idx}
              className="bg-white p-4 shadow-md rounded-xl border border-blue-100"
            >
              <p className="text-lg font-semibold">
                ✈️ {flight[1] || "Unknown Aircraft"}
              </p>
              <p>Origin Country: {flight[2]}</p>
              <p>Latitude: {flight[6]?.toFixed(2) || "N/A"}</p>
              <p>Longitude: {flight[5]?.toFixed(2) || "N/A"}</p>
              <p>Altitude: {flight[7] ? `${flight[7].toFixed(0)} m` : "N/A"}</p>
              <p>Velocity: {flight[9] ? `${flight[9].toFixed(1)} m/s` : "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
