import React, { useState } from "react";
import FlightDetails from "../FlightDetails";

const FlightResults = ({ results, onSelectFlight, onSortChange }) => {
  console.log("FlightResults received:", results);

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    stops: "all", // all, direct, oneStop
    airlines: "all",
    sortBy: "best",
  });

  if (!results || !results.itineraries) {
    console.log("No valid results data");
    return <div className="text-white text-center mt-8">No flights found.</div>;
  }

  const { itineraries, filterStats } = results;

  console.log("Itineraries:", itineraries);
  console.log("FilterStats:", filterStats);

  // Get unique airlines from the results
  const airlines = filterStats.carriers;

  const handleFlightClick = (flight) => {
    setSelectedFlight(selectedFlight?.id === flight.id ? null : flight);
    onSelectFlight(flight);
  };

  // Filter results based on selected filters
  const filteredResults = itineraries.filter((flight) => {
    if (activeFilters.stops !== "all") {
      const stopCount = flight.legs[0].stopCount;
      if (activeFilters.stops === "direct" && stopCount !== 0) return false;
      if (activeFilters.stops === "oneStop" && stopCount !== 1) return false;
    }

    if (activeFilters.airlines !== "all") {
      const airline = flight.legs[0].carriers.marketing[0].name;
      if (airline !== activeFilters.airlines) return false;
    }

    return true;
  });

  // Define sort options with exact API values
  const sortOptions = [
    { value: "best", label: "Best" },
    { value: "price_low", label: "Lowest Price" },
    { value: "price_high", label: "Highest Price" },
    { value: "fastest", label: "Fastest" },
    { value: "outbound_take_off_time", label: "Outbound Take Off Time" },
    { value: "outbound_landing_time", label: "Outbound Landing Time" },
    { value: "return_take_off_time", label: "Return Take Off Time" },
    { value: "return_landing_time", label: "Return Landing Time" },
  ];

  // Update the sort logic to match the API's sorting values
  const sortedResults = [...filteredResults].sort((a, b) => {
    try {
      switch (activeFilters.sortBy) {
        case "price_low":
          return (a.price?.amount || 0) - (b.price?.amount || 0);
        case "fastest":
          return (
            (a.legs[0]?.durationInMinutes || 0) -
            (b.legs[0]?.durationInMinutes || 0)
          );
        case "outbound_take_off_time":
          return (
            new Date(a.legs[0]?.departure || 0) -
            new Date(b.legs[0]?.departure || 0)
          );
        case "outbound_landing_time":
          return (
            new Date(a.legs[0]?.arrival || 0) -
            new Date(b.legs[0]?.arrival || 0)
          );
        case "return_take_off_time":
          return a.legs[1]
            ? new Date(a.legs[1].departure) - new Date(b.legs[1].departure)
            : 0;
        case "return_landing_time":
          return a.legs[1]
            ? new Date(a.legs[1].arrival) - new Date(b.legs[1].arrival)
            : 0;
        default: // 'best'
          return 0;
      }
    } catch (error) {
      console.error("Error sorting flights:", error);
      return 0;
    }
  });

  // Update handleSortChange to ensure clean value
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setActiveFilters((prev) => ({ ...prev, sortBy: newSortBy }));
    if (onSortChange) {
      onSortChange(newSortBy);
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* Stops Filter */}
          <div className="flex-1">
            <select
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              value={activeFilters.stops}
              onChange={(e) =>
                setActiveFilters((prev) => ({ ...prev, stops: e.target.value }))
              }
            >
              <option value="all">All Stops</option>
              <option value="direct">Direct Only</option>
              <option value="oneStop">1 Stop</option>
            </select>
          </div>

          {/* Airlines Filter */}
          <div className="flex-1">
            <select
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              value={activeFilters.airlines}
              onChange={(e) =>
                setActiveFilters((prev) => ({
                  ...prev,
                  airlines: e.target.value,
                }))
              }
            >
              <option value="all">All Airlines</option>
              {airlines.map((airline) => (
                <option key={airline.id} value={airline.name}>
                  {airline.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="flex-1">
            <select
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              value={activeFilters.sortBy}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {sortedResults.length > 0 ? (
        <div className="space-y-4">
          {sortedResults.map((flight) => (
            <div key={flight.id}>
              <div
                className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleFlightClick(flight)}
              >
                <div className="flex items-center justify-between">
                  {/* Airline Logo and Info */}
                  <div className="flex items-center space-x-4 w-1/4">
                    <img
                      src={flight.legs[0].carriers.marketing[0].logoUrl}
                      alt={flight.legs[0].carriers.marketing[0].name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-gray-300 text-sm">
                      {flight.legs[0].carriers.marketing[0].name}
                    </span>
                  </div>

                  {/* Flight Times and Duration - Outbound */}
                  <div className="flex items-center justify-between w-2/4">
                    <div className="text-center">
                      <div className="text-white font-medium">
                        {new Date(flight.legs[0].departure).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {flight.legs[0].origin.displayCode}
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <div className="text-gray-400 text-sm">
                        {Math.floor(flight.legs[0].durationInMinutes / 60)}h{" "}
                        {flight.legs[0].durationInMinutes % 60}m
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-20 h-0.5 bg-gray-400"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {flight.legs[0].stopCount === 0
                          ? "Nonstop"
                          : `${flight.legs[0].stopCount} stop${
                              flight.legs[0].stopCount > 1 ? "s" : ""
                            }`}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-white font-medium">
                        {new Date(flight.legs[0].arrival).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {flight.legs[0].destination.displayCode}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right w-1/4">
                    <div className="text-white font-bold text-xl">
                      {flight.price.formatted}
                    </div>
                    <div className="text-gray-400 text-sm">round trip</div>
                  </div>
                </div>

                {/* Return Flight Info - Only show if it's a round trip */}
                {flight.legs[1] && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-4 w-1/4">
                      <img
                        src={flight.legs[1].carriers.marketing[0].logoUrl}
                        alt={flight.legs[1].carriers.marketing[0].name}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-gray-300 text-sm">
                        {flight.legs[1].carriers.marketing[0].name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-2/4">
                      <div className="text-center">
                        <div className="text-white font-medium">
                          {new Date(
                            flight.legs[1].departure
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {flight.legs[1].origin.displayCode}
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="text-gray-400 text-sm">
                          {Math.floor(flight.legs[1].durationInMinutes / 60)}h{" "}
                          {flight.legs[1].durationInMinutes % 60}m
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-20 h-0.5 bg-gray-400"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {flight.legs[1].stopCount === 0
                            ? "Nonstop"
                            : `${flight.legs[1].stopCount} stop${
                                flight.legs[1].stopCount > 1 ? "s" : ""
                              }`}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-white font-medium">
                          {new Date(flight.legs[1].arrival).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {flight.legs[1].destination.displayCode}
                        </div>
                      </div>
                    </div>

                    <div className="w-1/4"></div>
                  </div>
                )}

                {/* Expandable Details */}
                {selectedFlight?.id === flight.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      {flight.legs.map((leg, index) => (
                        <div key={leg.id} className="bg-gray-900 p-4 rounded">
                          <h3 className="text-white font-medium mb-2">
                            {index === 0 ? "Outbound" : "Return"} Flight Details
                          </h3>
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Flight Number: {leg.segments[0].flightNumber}</p>
                            <p>Aircraft: {leg.carriers.marketing[0].name}</p>
                            <p>
                              Duration: {Math.floor(leg.durationInMinutes / 60)}
                              h {leg.durationInMinutes % 60}m
                            </p>
                            <p>Stops: {leg.stopCount}</p>
                            {leg.stopCount > 0 &&
                              leg.segments.map((segment, idx) => (
                                <div key={idx} className="ml-4 mt-2">
                                  <p>
                                    Stop {idx + 1}: {segment.destination.name}
                                  </p>
                                  <p>
                                    Layover: {segment.durationInMinutes} minutes
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fare Rules and Baggage Info */}
                    <div className="mt-4 bg-gray-900 p-4 rounded">
                      <h3 className="text-white font-medium mb-2">
                        Fare Information
                      </h3>
                      <div className="text-sm text-gray-300">
                        <p>
                          Fare Type:{" "}
                          {flight.farePolicy.isChangeAllowed
                            ? "Flexible"
                            : "Non-Flexible"}
                        </p>
                        <p>
                          Cancellation:{" "}
                          {flight.farePolicy.isCancellationAllowed
                            ? "Allowed"
                            : "Not Allowed"}
                        </p>
                        <p>
                          Changes:{" "}
                          {flight.farePolicy.isChangeAllowed
                            ? "Allowed"
                            : "Not Allowed"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Use existing FlightDetails component */}
              {selectedFlight?.id === flight.id && (
                <FlightDetails
                  flight={flight}
                  onClose={() => setSelectedFlight(null)}
                  sessionId={results.context?.sessionId}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center mt-8">
          No flights found matching your filters.
        </div>
      )}
    </div>
  );
};

export default FlightResults;
