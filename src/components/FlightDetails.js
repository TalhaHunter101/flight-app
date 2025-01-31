import React, { useEffect, useState } from "react";
import { getFlightDetails } from "../api/flightApiService";

const FlightDetails = ({ flight, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const legs = flight.legs.map((leg) => ({
          origin: leg.origin.displayCode,
          destination: leg.destination.displayCode,
          date: leg.departure.split("T")[0],
        }));

        const response = await getFlightDetails({
          itineraryId: flight.id,
          legs,
          sessionId: flight.sessionId,
          adults: 1,
          currency: "USD",
          locale: "en-US",
          market: "en-US",
          countryCode: "US",
        });

        setDetails(response.data.itinerary);
      } catch (error) {
        console.error("Error fetching flight details:", error);
        alert(
          "An error occurred while fetching flight details. Please try again."
        );
      }
      setLoading(false);
    };

    fetchDetails();
  }, [flight]);

  if (loading) {
    return <p>Loading flight details...</p>;
  }

  if (!details) {
    return <p>No flight details available.</p>;
  }

  const { legs, pricingOptions } = details;
  const { totalPrice } = pricingOptions[0];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Flight Details</h2>
      {legs.map((leg, index) => (
        <div key={leg.id} className="mb-4">
          <h3 className="text-xl font-bold">
            {index === 0 ? "Outbound" : "Return"} Flight
          </h3>
          <p>
            {leg.origin.name} ({leg.origin.displayCode}) to{" "}
            {leg.destination.name} ({leg.destination.displayCode})
          </p>
          <p>Departure: {new Date(leg.departure).toLocaleString()}</p>
          <p>Arrival: {new Date(leg.arrival).toLocaleString()}</p>
          <p>Duration: {leg.duration} minutes</p>
        </div>
      ))}
      <p>Total Price: {totalPrice}</p>
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default FlightDetails;
