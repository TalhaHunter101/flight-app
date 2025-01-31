import React, { useEffect, useState } from "react";
import { getFlightDetails } from "../api/flightApiService";

const FlightDetails = ({ flight, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getFlightDetails(flight.id);
        setDetails(response.data.data.itinerary);
      } catch (error) {
        console.error("Error fetching flight details:", error);
        alert(
          "An error occurred while fetching flight details. Please try again."
        );
      }
      setLoading(false);
    };

    fetchDetails();
  }, [flight.id]);

  if (loading) {
    return <p>Loading flight details...</p>;
  }

  if (!details) {
    return <p>No flight details available.</p>;
  }

  const { legs, pricingOptions } = details;
  const { origin, destination, departure, arrival, duration, segments } =
    legs[0];
  const { totalPrice } = pricingOptions[0];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Flight Details</h2>
      <p>
        {origin.name} ({origin.displayCode}) to {destination.name} (
        {destination.displayCode})
      </p>
      <p>Departure: {new Date(departure).toLocaleString()}</p>
      <p>Arrival: {new Date(arrival).toLocaleString()}</p>
      <p>Duration: {duration} minutes</p>
      <p>Price: {totalPrice}</p>

      <h3 className="text-xl font-bold mt-4 mb-2">Segments</h3>
      {segments.map((segment) => (
        <div key={segment.id} className="mb-4">
          <p>
            {segment.origin.name} ({segment.origin.displayCode}) to{" "}
            {segment.destination.name} ({segment.destination.displayCode})
          </p>
          <p>Flight Number: {segment.flightNumber}</p>
          <p>
            {segment.marketingCarrier.name} (
            {segment.marketingCarrier.displayCode})
          </p>
          <p>Departure: {new Date(segment.departure).toLocaleString()}</p>
          <p>Arrival: {new Date(segment.arrival).toLocaleString()}</p>
          <p>Duration: {segment.duration} minutes</p>
        </div>
      ))}

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
