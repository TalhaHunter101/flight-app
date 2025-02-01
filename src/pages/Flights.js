import React, { useState } from "react";
import FlightSearch from "../components/Flight/FlightSearch";
import FlightDetails from "../components/Flight/FlightDetails";

const Flights = () => {
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Flight Search</h1>
      <FlightSearch
        onSelectFlight={(flightId) => setSelectedFlightId(flightId)}
      />

      {selectedFlightId && (
        <FlightDetails
          flight={{ id: selectedFlightId }}
          onClose={() => setSelectedFlightId(null)}
        />
      )}
    </div>
  );
};

export default Flights;
