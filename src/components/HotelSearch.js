import React, { useState } from 'react';
import axios from 'axios';

const HotelSearch = () => {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get('https://hotels4.p.rapidapi.com/locations/v2/search', {
        params: {
          query: location,
          locale: 'en_US',
        },
        headers: {
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        },
      });

      const destinationId = response.data.suggestions[0].entities[0].destinationId;

      const hotelsResponse = await axios.get('https://hotels4.p.rapidapi.com/properties/list', {
        params: {
          destinationId: destinationId,
          pageNumber: '1',
          pageSize: '10',
          checkIn: checkInDate,
          checkOut: checkOutDate,
          adults1: guests,
          sortOrder: 'PRICE',
          locale: 'en_US',
          currency: 'USD',
        },
        headers: {
          'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST,
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        },
      });

      setHotels(hotelsResponse.data.data.body.searchResults.results);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="checkInDate">Check-in Date:</label>
          <input
            type="date"
            id="checkInDate"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="checkOutDate">Check-out Date:</label>
          <input
            type="date"
            id="checkOutDate"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="guests">Guests:</label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="border border-gray-300 px-2 py-1 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Search Hotels
        </button>
      </form>

      {loading ? (
        <p>Loading hotels...</p>
      ) : (
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.id}>
              <p>Name: {hotel.name}</p>
              <p>Price: {hotel.ratePlan.price.current}</p>
              <p>Rating: {hotel.starRating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotelSearch; 