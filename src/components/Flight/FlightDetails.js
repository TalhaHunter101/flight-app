import React, { useEffect, useState, useCallback } from "react";
import { getFlightDetails } from "../../api/flightApiService";
import LoadingSpinner from "../utils/LoadingSpinner";

const FlightDetails = ({ flight, sessionId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    try {
      const legs = flight.legs.map((leg) => ({
        origin: leg.origin.displayCode,
        destination: leg.destination.displayCode,
        date: leg.departure.split("T")[0],
      }));

      const usedSessionId = flight.sessionId?.trim() || sessionId?.trim() || "";

      if (!usedSessionId) {
        throw new Error("Session ID is missing");
      }

      const response = await getFlightDetails({
        itineraryId: flight.id,
        legs,
        sessionId: usedSessionId,
        adults: 1,
        currency: "USD",
        locale: "en-US",
        market: "en-US",
        countryCode: "US",
      });

      if (response.data?.itinerary) {
        setDetails(response.data.itinerary);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      alert("Failed to fetch flight details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [flight, sessionId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size={30} color="#3B82F6" />
        </div>
      ) : details ? (
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-white font-medium mb-2">Departing Flight</h3>
            <div className="flex items-center mb-4">
              <img
                src={details.legs[0].segments[0].marketingCarrier?.logo}
                alt={details.legs[0].segments[0].marketingCarrier?.name}
                className="w-12 h-12 mr-4"
              />
              <div className="text-gray-300">
                <p className="font-semibold">
                  {new Date(details.legs[0].departure).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - {details.legs[0].origin.name} (
                  {details.legs[0].origin.displayCode})
                </p>
                <p className="text-sm">
                  Travel time:{" "}
                  {Math.floor(details.legs[0].durationInMinutes / 60)} hr{" "}
                  {details.legs[0].durationInMinutes % 60} min
                </p>
                <p className="text-sm">
                  Flight: {details.legs[0].segments[0].marketingCarrier?.name} ·{" "}
                  {details.legs[0].segments[0].aircraft?.name} ·{" "}
                  {details.legs[0].segments[0].flightNumber}
                </p>
              </div>
            </div>
          </div>

          {details.legs.length > 1 && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h3 className="text-white font-medium mb-2">Return Flight</h3>
              <div className="flex items-center mb-4">
                <img
                  src={details.legs[1].segments[0].marketingCarrier?.logo}
                  alt={details.legs[1].segments[0].marketingCarrier?.name}
                  className="w-12 h-12 mr-4"
                />
                <div className="text-gray-300">
                  <p className="font-semibold">
                    {new Date(details.legs[1].departure).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}{" "}
                    - {details.legs[1].origin.name} (
                    {details.legs[1].origin.displayCode})
                  </p>
                  <p className="text-sm">
                    Travel time:{" "}
                    {Math.floor(details.legs[1].durationInMinutes / 60)} hr{" "}
                    {details.legs[1].durationInMinutes % 60} min
                  </p>
                  <p className="text-sm">
                    Flight: {details.legs[1].segments[0].marketingCarrier?.name}{" "}
                    · {details.legs[1].segments[0].aircraft?.name} ·{" "}
                    {details.legs[1].segments[0].flightNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-white font-medium">Booking Options</h4>
            {details.pricingOptions.map((option, i) => (
              <div
                key={i}
                className="border p-2 rounded flex justify-between items-center mt-2 bg-gray-700"
              >
                <div>
                  <p className="text-white font-medium">
                    {option.agents[0]?.name}
                  </p>
                  <p className="text-gray-300">Price: ${option.totalPrice}</p>
                </div>
                <button
                  onClick={() => window.open(option.agents[0]?.url, "_blank")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">No details available</p>
      )}
    </div>
  );
};

export default FlightDetails;
