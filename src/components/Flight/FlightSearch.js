import React, { useState, useRef, useEffect } from "react";
import {
  searchFlightsComplete,
  searchFlightsMultiStops,
} from "../../api/flightApiService";
import AirportSearch from "../AirportSearch/AirportSearch";
import PriceCalendar from "../Calendar/PriceCalendar";
import FlightResults from "./FlightResults";
import CalendarIcon from "../utils/CalendarIcon";
import LoadingSpinner from "../utils/LoadingSpinner";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [originAirportIds, setOriginAirportIds] = useState(null);
  const [destinationAirportIds, setDestinationAirportIds] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [multiCityFlights, setMultiCityFlights] = useState([
    {
      id: 1,
      origin: "",
      destination: "",
      date: "",
      originIds: null,
      destinationIds: null,
    },
  ]);
  const [isSelectingReturn, setIsSelectingReturn] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("best");
  const [activeCalendarIndex, setActiveCalendarIndex] = useState(null);
  const [visibleCalendars, setVisibleCalendars] = useState({});

  // Add useRef for dropdown click outside handling
  const dropdownRef = useRef(null);

  // Handle click outside to close passenger dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPassengerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update handlePassengerChange to handle different categories
  const handlePassengerChange = (type, operation) => {
    if (type === "adults") {
      setAdults((prev) =>
        operation === "increment"
          ? Math.min(prev + 1, 9)
          : Math.max(prev - 1, 1)
      );
    } else if (type === "children") {
      setChildren((prev) =>
        operation === "increment"
          ? Math.min(prev + 1, 9)
          : Math.max(prev - 1, 0)
      );
    } else if (type === "infants") {
      setInfants((prev) =>
        operation === "increment"
          ? Math.min(prev + 1, 9)
          : Math.max(prev - 1, 0)
      );
    }
  };

  const handleAddFlight = () => {
    const lastFlight = multiCityFlights[multiCityFlights.length - 1];
    setMultiCityFlights([
      ...multiCityFlights,
      {
        id: lastFlight.id + 1,
        origin: lastFlight.destination,
        destination: "",
        date: "",
        originIds: lastFlight.destinationIds,
        destinationIds: null,
      },
    ]);
  };

  const handleRemoveFlight = (id) => {
    if (multiCityFlights.length > 1) {
      setMultiCityFlights(
        multiCityFlights.filter((flight) => flight.id !== id)
      );
    }
  };

  const handleAirportSelect = (airport, type, index = 0) => {
    if (tripType === "multi-city") {
      const newFlights = [...multiCityFlights];
      if (type === "origin") {
        newFlights[index] = {
          ...newFlights[index],
          origin: airport.suggestionTitle,
          originIds: {
            skyId: airport.skyId,
            entityId: airport.entityId,
          },
        };
      } else {
        newFlights[index] = {
          ...newFlights[index],
          destination: airport.suggestionTitle,
          destinationIds: {
            skyId: airport.skyId,
            entityId: airport.entityId,
          },
        };
        // Update next flight's origin if it exists
        if (index + 1 < newFlights.length) {
          newFlights[index + 1] = {
            ...newFlights[index + 1],
            origin: airport.suggestionTitle,
            originIds: {
              skyId: airport.skyId,
              entityId: airport.entityId,
            },
          };
        }
      }
      setMultiCityFlights(newFlights);
    } else {
      // Existing single/round-trip logic
      if (type === "origin") {
        setOrigin(airport.suggestionTitle);
        setOriginAirportIds({
          skyId: airport.skyId,
          entityId: airport.entityId,
        });
      } else {
        setDestination(airport.suggestionTitle);
        setDestinationAirportIds({
          skyId: airport.skyId,
          entityId: airport.entityId,
        });
      }

      // Show calendar when both airports are selected
      if (
        (type === "destination" && originAirportIds) ||
        (type === "origin" && destinationAirportIds)
      ) {
        setShowCalendar(true);
      }
    }
  };

  const handleDateSelect = (date, isReturn = false) => {
    if (tripType === "multi-city") {
      const newFlights = [...multiCityFlights];
      newFlights[activeCalendarIndex].date = date;
      setMultiCityFlights(newFlights);
      setVisibleCalendars((prev) => ({
        ...prev,
        [activeCalendarIndex]: false,
      }));
      setActiveCalendarIndex(null);
    } else {
      if (!isReturn) {
        setDepartureDate(date);
        if (tripType === "round-trip") {
          setIsSelectingReturn(true);
        } else {
          setShowCalendar(false);
        }
      } else {
        setReturnDate(date);
        setShowCalendar(false);
        setIsSelectingReturn(false);
      }
    }
  };

  const isFormValid = () => {
    if (tripType === "multi-city") {
      return multiCityFlights.every(
        (flight) =>
          flight.origin &&
          flight.destination &&
          flight.date &&
          flight.originIds &&
          flight.destinationIds
      );
    }

    const hasRequiredFields =
      originAirportIds && destinationAirportIds && departureDate;

    return tripType === "round-trip"
      ? hasRequiredFields && returnDate
      : hasRequiredFields;
  };

  const handleSearch = async (customSortBy = sortBy) => {
    setIsLoading(true);
    try {
      const validSortValues = [
        "best",
        "price_high",
        "fastest",
        "outbound_take_off_time",
        "outbound_landing_time",
        "return_take_off_time",
        "return_landing_time",
      ];

      const sortParam = validSortValues.includes(customSortBy)
        ? customSortBy
        : "best";
      let response;

      if (tripType === "multi-city") {
        const legs = multiCityFlights.map((flight) => ({
          origin: flight.originIds.skyId,
          originEntityId: flight.originIds.entityId,
          destination: flight.destinationIds.skyId,
          destinationEntityId: flight.destinationIds.entityId,
          date: flight.date,
        }));

        response = await searchFlightsMultiStops(
          legs,
          cabinClass.toLowerCase(),
          adults,
          children,
          infants,
          sortParam,
          "USD",
          "en-US",
          "US"
        );

        if (response.status && response.data) {
          setSearchResults({
            itineraries: response.data.itineraries || [],
            context: {
              status: response.status ? "complete" : "incomplete",
              totalResults: response.data.context?.totalResults || 0,
              sessionId: response.sessionId,
            },
            filterStats: response.data.filterStats || {
              carriers: [],
              airports: [],
              duration: {},
              stopPrices: {},
            },
          });
        } else {
          setSearchResults(null);
        }
      } else {
        // Existing round-trip/one-way logic
        response = await searchFlightsComplete(
          originAirportIds.skyId,
          destinationAirportIds.skyId,
          originAirportIds.entityId,
          destinationAirportIds.entityId,
          departureDate,
          returnDate,
          cabinClass.toLowerCase(),
          adults,
          children,
          infants,
          sortParam,
          10,
          undefined,
          "USD",
          "en-US",
          "US"
        );

        if (response.data && response.data.itineraries) {
          setSearchResults(response.data);
        } else {
          console.log("No itineraries found in response");
          setSearchResults(null);
        }
      }
    } catch (error) {
      setSearchResults(null);
      alert("An error occurred while searching for flights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (newSortBy) => {
    const validSortBy = String(newSortBy).trim();
    console.log("Handling sort change:", validSortBy); // Debug log
    setSortBy(validSortBy);
    handleSearch(validSortBy);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-top">
      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          {/* Trip Type, Passengers, and Cabin Class */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                <option value="round-trip">Round trip</option>
                <option value="one-way">One way</option>
                <option value="multi-city">Multi-city</option>
              </select>
            </div>

            {/* Updated Passengers Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setIsPassengerDropdownOpen(!isPassengerDropdownOpen)
                }
                className="bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                <span>
                  {adults + children + infants} Passenger
                  {adults + children + infants !== 1 ? "s" : ""}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isPassengerDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-700 rounded-lg shadow-lg p-4 z-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Adults</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("adults", "decrement")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={adults <= 1}
                      >
                        -
                      </button>
                      <span className="text-white w-4 text-center">
                        {adults}
                      </span>
                      <button
                        onClick={() =>
                          handlePassengerChange("adults", "increment")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={adults >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-white font-medium">Children</p>
                      <p className="text-sm text-gray-400">Aged 2-11</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("children", "decrement")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={children <= 0}
                      >
                        -
                      </button>
                      <span className="text-white w-4 text-center">
                        {children}
                      </span>
                      <button
                        onClick={() =>
                          handlePassengerChange("children", "increment")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={children >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-white font-medium">Infants</p>
                      <p className="text-sm text-gray-400">In seat</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("infants", "decrement")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={infants <= 0}
                      >
                        -
                      </button>
                      <span className="text-white w-4 text-center">
                        {infants}
                      </span>
                      <button
                        onClick={() =>
                          handlePassengerChange("infants", "increment")
                        }
                        className="bg-gray-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500"
                        disabled={infants >= 9}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class */}
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md cursor-pointer"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>

          {/* Origin, Destination, and Dates */}
          {tripType === "multi-city" ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {multiCityFlights.map((flight, index) => (
                <div
                  key={flight.id}
                  className="grid grid-cols-12 gap-4 relative"
                >
                  <div className="col-span-4">
                    <AirportSearch
                      placeholder="Where from?"
                      value={flight.origin}
                      onChange={(value) => {
                        const newFlights = [...multiCityFlights];
                        newFlights[index].origin = value;
                        setMultiCityFlights(newFlights);
                      }}
                      type="origin"
                      onSelect={(airport) =>
                        handleAirportSelect(airport, "origin", index)
                      }
                    />
                  </div>
                  <div className="col-span-4">
                    <AirportSearch
                      placeholder="Where to?"
                      value={flight.destination}
                      onChange={(value) => {
                        const newFlights = [...multiCityFlights];
                        newFlights[index].destination = value;
                        setMultiCityFlights(newFlights);
                      }}
                      type="destination"
                      onSelect={(airport) =>
                        handleAirportSelect(airport, "destination", index)
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={flight.date}
                        onClick={() => {
                          if (flight.originIds && flight.destinationIds) {
                            setVisibleCalendars((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setActiveCalendarIndex(index);
                          } else {
                            alert(
                              "Please select both origin and destination airports first"
                            );
                          }
                        }}
                        readOnly
                        placeholder="Select Date"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-md cursor-pointer"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon />
                      </div>
                    </div>
                    {visibleCalendars[index] &&
                      activeCalendarIndex === index &&
                      flight.originIds &&
                      flight.destinationIds && (
                        <div className="absolute right-40 mt-2 z-50">
                          <PriceCalendar
                            originSkyId={flight.originIds.skyId}
                            destinationSkyId={flight.destinationIds.skyId}
                            selectedDate={flight.date}
                            onDateSelect={(date) => {
                              const newFlights = [...multiCityFlights];
                              newFlights[index].date = date;
                              setMultiCityFlights(newFlights);
                              setVisibleCalendars((prev) => ({
                                ...prev,
                                [index]: false,
                              }));
                            }}
                            isSelectingReturn={false}
                            tripType="one-way"
                          />
                        </div>
                      )}
                  </div>
                  {index > 0 && (
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveFlight(flight.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-left">
                <button
                  onClick={handleAddFlight}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  + Add Flight
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 relative">
              <div className="col-span-4">
                <AirportSearch
                  placeholder="Where from?"
                  value={origin}
                  onChange={setOrigin}
                  type="origin"
                  onSelect={(airport) => handleAirportSelect(airport, "origin")}
                />
              </div>
              <div className="col-span-4">
                <AirportSearch
                  placeholder="Where to?"
                  value={destination}
                  onChange={setDestination}
                  type="destination"
                  onSelect={(airport) =>
                    handleAirportSelect(airport, "destination")
                  }
                />
              </div>
              <div className="col-span-4 relative">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Departure Date"
                      value={departureDate}
                      onClick={() => setShowCalendar(true)}
                      readOnly
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-md cursor-pointer"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CalendarIcon />
                    </div>
                  </div>
                  {tripType === "round-trip" && (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Return Date"
                        value={returnDate}
                        onClick={() => {
                          setShowCalendar(true);
                          setIsSelectingReturn(true);
                        }}
                        readOnly
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-md cursor-pointer"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <CalendarIcon />
                      </div>
                    </div>
                  )}
                </div>
                {showCalendar && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <PriceCalendar
                      originSkyId={originAirportIds.skyId}
                      destinationSkyId={destinationAirportIds.skyId}
                      selectedDate={departureDate}
                      returnDate={returnDate}
                      onDateSelect={handleDateSelect}
                      isSelectingReturn={isSelectingReturn}
                      tripType={tripType}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              disabled={!isFormValid()}
              className={`bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-medium
                ${
                  isFormValid()
                    ? "hover:bg-blue-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
            >
              {isLoading ? (
                <LoadingSpinner size={24} color="#ffffff" />
              ) : (
                "Explore"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Flight Results */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <LoadingSpinner size={50} color="#3B82F6" />
        </div>
      ) : (
        searchResults && (
          <FlightResults
            results={searchResults}
            onSelectFlight={(flight) => console.log("Selected flight:", flight)}
            onSortChange={handleSortChange}
          />
        )
      )}
    </div>
  );
};

export default FlightSearch;
