import React, { useState } from "react";
import axios from "axios";

const HotelSearch = () => {
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get(
        "https://hotels4.p.rapidapi.com/locations/v2/search",
        {
          params: {
            query: location,
            locale: "en_US",
          },
          headers: {
            "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          },
        }
      );

      const destinationId =
        response.data.suggestions[0].entities[0].destinationId;

      const hotelsResponse = await axios.get(
        "https://hotels4.p.rapidapi.com/properties/list",
        {
          params: {
            destinationId: destinationId,
            pageNumber: "1",
            pageSize: "10",
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults1: guests,
            sortOrder: "PRICE",
            locale: "en_US",
            currency: "USD",
          },
          headers: {
            "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
            "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
          },
        }
      );

      setHotels(hotelsResponse.data.data.body.searchResults.results);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <form
        onSubmit={handleSearch}
        className="bg-gray-700 p-4 rounded-lg mb-4 flex space-x-4"
      >
        <div className="flex-1">
          <label htmlFor="location" className="block">
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-600 px-2 py-1 rounded w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="checkInDate" className="block">
            Check-in Date:
          </label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border border-gray-600 px-2 py-1 rounded w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="checkOutDate" className="block">
            Check-out Date:
          </label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border border-gray-600 px-2 py-1 rounded w-full"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="guests" className="block">
            Guests:
          </label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="border border-gray-600 px-2 py-1 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-gray-700 p-4 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold">{hotel.name}</h3>
              <p>Price: {hotel.ratePlan.price.current}</p>
              <p>Rating: {hotel.starRating}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                View Prices
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
