import React from 'react';
import FlightSearch from '../components/FlightSearch';

const Flights = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Flight Search</h1>
      <FlightSearch />
    </div>
  );
};

export default Flights; 