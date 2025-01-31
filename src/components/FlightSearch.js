import React, { useState } from "react";
import axios from "axios";

const FlightSearch = () => {
  const [tripType, setTripType] = useState("round-trip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants_in_seat: 0,
    infants_in_lap: 0,
  });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePassengerChange = (type, operation) => {
    setPassengers((prev) => ({
      ...prev,
      [type]:
        operation === "add" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  const getTotalPassengers = () => {
    return Object.values(passengers).reduce((a, b) => a + b, 0);
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
            adults: getTotalPassengers(),
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Image Section */}
      {/* <div className="relative h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900">
          <h1 className="text-6xl font-bold text-center pt-1">Flights</h1>
        </div>
      </div> */}

      {/* Search Form */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
          {/* Trip Type and Passengers Row */}
          <div className="flex items-center space-x-4 mb-4">
            {/* Trip Type Dropdown */}
            <div className="relative">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="bg-gray-700 px-4 py-2 rounded-md"
              >
                <option value="round-trip">Round trip</option>
                <option value="one-way">One way</option>
                <option value="multi-city">Multi-city</option>
              </select>
            </div>

            {/* Passengers Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsPassengerDropdownOpen(!isPassengerDropdownOpen)
                }
                className="bg-gray-700 px-4 py-2 rounded-md flex items-center"
              >
                <span>{getTotalPassengers()} Passenger(s)</span>
              </button>

              {isPassengerDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-gray-700 rounded-md shadow-lg p-4 z-50">
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">Adults</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("adults", "subtract")
                        }
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{passengers.adults}</span>
                      <button
                        onClick={() => handlePassengerChange("adults", "add")}
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-gray-400">Aged 2-11</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("children", "subtract")
                        }
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{passengers.children}</span>
                      <button
                        onClick={() => handlePassengerChange("children", "add")}
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Infants</div>
                      <div className="text-sm text-gray-400">Under 2</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          handlePassengerChange("infants_in_lap", "subtract")
                        }
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        -
                      </button>
                      <span>{passengers.infants_in_lap}</span>
                      <button
                        onClick={() =>
                          handlePassengerChange("infants_in_lap", "add")
                        }
                        className="bg-gray-600 px-3 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class Dropdown */}
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="bg-gray-700 px-4 py-2 rounded-md"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>

          {/* Search Fields Row */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Where from?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-gray-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-gray-700 px-4 py-2 rounded-md"
              />
            </div>
            <div className="col-span-4">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-gray-700 px-4 py-2 rounded-md"
                />
                {tripType === "round-trip" && (
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-gray-700 px-4 py-2 rounded-md"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <p className="text-center mt-8">Loading flights...</p>
      ) : (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-gray-800 rounded-lg p-4 mb-4">
              <p>Price: {flight.price}</p>
              <p>Carrier: {flight.carrier}</p>
              <p>Departure: {flight.departureDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
