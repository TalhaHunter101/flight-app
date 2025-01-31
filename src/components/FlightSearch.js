import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add useRef for dropdown click outside handling
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        "https://apiheya-sky-scrapper.p.rapidapi.com/flights",
        {
          params: {
            origin: origin,
            destination: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            adults: adults + children + infants,
            cabinClass: cabinClass,
          },
          headers: {
            "x-rapidapi-host": "apiheya-sky-scrapper.p.rapidapi.com",
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          },
        }
      );

      setFlights(response.data.flights); // Adjust based on actual response structure
    } catch (error) {
      console.error("Error fetching flights:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-top">
      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10">
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
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>

          {/* Origin, Destination, and Dates */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Where from?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-md"
              />
            </div>
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-md"
              />
            </div>
            <div className="col-span-4">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-md"
                />
                {tripType === "round-trip" && (
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-md"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Flight Results */}
        {loading ? (
          <div className="text-center mt-8">
            <div className="text-white">Loading flights...</div>
          </div>
        ) : (
          flights.length > 0 && (
            <div className="mt-8 space-y-4">
              {flights.map((flight) => (
                <div key={flight.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">{flight.airline}</p>
                      <p className="text-sm text-gray-400">
                        {flight.flightNumber}
                      </p>
                    </div>
                    <div className="text-lg font-bold">${flight.price}</div>
                  </div>
                  <div className="mt-4">
                    <p>
                      {flight.departureAirport} - {flight.arrivalAirport}
                    </p>
                    <p>
                      {flight.departureDate} - {flight.arrivalDate}
                    </p>
                    <p>Duration: {flight.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
