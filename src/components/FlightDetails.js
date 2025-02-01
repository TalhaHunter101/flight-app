import React, { useEffect, useState } from "react";
import { getFlightDetails } from "../api/flightApiService";
import LoadingSpinner from "./LoadingSpinner";

const FlightDetails = ({ flight, sessionId, onClose }) => {
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

        // Use flight.sessionId if exists (after trimming); otherwise use the sessionId prop (trimmed)
        const usedSessionId =
          (flight.sessionId && flight.sessionId.trim()) ||
          (sessionId && sessionId.trim()) ||
          "";

        console.log("Used sessionId:", usedSessionId);
        if (!usedSessionId) {
          alert("Session ID is missing. Cannot fetch flight details.");
          setLoading(false);
          return;
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

        // Log the entire response to check its structure
        console.log("Flight details response:", JSON.stringify(response));

        // Check if response.data and response.data.itinerary exist
        if (response.data && response.data.itinerary) {
          setDetails(response.data.itinerary);
        } else {
          console.error("Invalid response structure:", response);
          alert("Failed to fetch flight details. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching flight details:", error);
        alert(
          "An error occurred while fetching flight details. Please try again."
        );
      }
      setLoading(false);
    };

    fetchDetails();
  }, [flight, sessionId]);

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size={30} color="#3B82F6" />
        </div>
      ) : details ? (
        <div className="grid grid-cols-2 gap-4">
          {details.legs.map((leg, index) => (
            <div key={leg.id} className="bg-gray-900 p-4 rounded">
              <h3 className="text-white font-medium mb-2">
                {index === 0 ? "Outbound" : "Return"} Flight Details
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Flight Number: {leg.segments[0].flightNumber}</p>
                <p>Aircraft: {leg.segments[0].marketingCarrier?.name}</p>
                <p>
                  Duration: {Math.floor(leg.durationInMinutes / 60)}h{" "}
                  {leg.durationInMinutes % 60}m
                </p>
                <p>Stops: {leg.stopCount}</p>
                {leg.stopCount > 0 &&
                  leg.segments.map((segment, idx) => (
                    <div key={idx} className="ml-4 mt-2">
                      <p>
                        Stop {idx + 1}: {segment.destination.name}
                      </p>
                      <p>Layover: {segment.durationInMinutes} minutes</p>
                    </div>
                  ))}
              </div>
              <div className="mt-4 text-white">
                <p>Price: {details.pricingOptions[0].totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No details available</p>
      )}
      {details &&
        details.pricingOptions &&
        details.pricingOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white font-medium">Booking Options</h3>
            <div className="space-y-2">
              {details.pricingOptions.map((option, i) => (
                <div
                  key={i}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-medium">
                      {option.agents[0]?.name}
                    </p>
                    <p className="text-gray-300">Price: {option.totalPrice}</p>
                  </div>
                  <button
                    onClick={() => window.open(option.agents[0]?.url, "_blank")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default FlightDetails;
