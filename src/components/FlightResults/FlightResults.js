import React from "react";

const FlightResults = ({ results, onSelectFlight }) => {
  if (!results || results.length === 0) {
    return <p>No flights found.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Search Results</h2>
      <div className="space-y-4">
        {results.map((flight, index) => (
          <div
            key={`${flight.id}-${index}`}
            className="bg-gray-700 p-4 rounded-lg shadow-lg cursor-pointer"
            onClick={() => onSelectFlight(flight.id)}
          >
            {/* Display flight details */}
            <p>
              {flight.origin.name} ({flight.origin.id}) to{" "}
              {flight.destination.name} ({flight.destination.id})
            </p>
            <p>Depart: {new Date(flight.departureDateTime).toLocaleString()}</p>
            <p>Arrive: {new Date(flight.arrivalDateTime).toLocaleString()}</p>
            <p>Duration: {flight.duration}</p>
            <p>
              Price: {flight.price.totalPrice} {flight.price.currency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResults;
