import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Approximate bounding box for Seattle ZIP code 98122
  const seattle98122Bounds = {
    lamin: 47.605,
    lamax: 47.630,
    lomin: -122.320,
    lomax: -122.290,
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const url = `https://opensky-network.org/api/states/all?lamin=${seattle98122Bounds.lamin}&lomin=${seattle98122Bounds.lomin}&lamax=${seattle98122Bounds.lamax}&lomax=${seattle98122Bounds.lomax}`;
        const response = await axios.get(url);
        const data = response.data.states || [];
        setFlights(data);
      } catch (err) {
        setError("Failed to fetch flight data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">
        Flights Over Balc ✈️
      </h1>

      {loading && <p className="text-center">Loading flight data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && flights.length === 0 && (
        <p className="text-center text-gray-500">No flights found over Balc at this moment.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flights.map((flight, idx) => (
          <div
            key={idx}
            className="bg-white p-4 shadow-md rounded-xl border border-blue-100"
          >
            <p className="text-lg font-semibold">
              ✈️ Callsign: {flight[1] || "Unknown"}
            </p>
            <p>Country of Origin: {flight[2]}</p>
            <p>Latitude: {flight[6]?.toFixed(2) || "N/A"}</p>
            <p>Longitude: {flight[5]?.toFixed(2) || "N/A"}</p>
            <p>Altitude: {flight[7] ? `${flight[7].toFixed(0)} m` : "N/A"}</p>
            <p>Velocity: {flight[9] ? `${flight[9].toFixed(1)} m/s` : "N/A"}</p>
            <p className="text-gray-600 text-sm mt-2">
              {/* Origin and destination are NOT available directly from this API */}
              <strong>Origin Airport:</strong> Not available (OpenSky free API limitation)<br />
              <strong>Destination Airport:</strong> Not available
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
