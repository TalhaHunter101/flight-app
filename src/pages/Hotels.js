import React from 'react';
import HotelSearch from '../components/HotelSearch';

const Hotels = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Hotel Search</h1>
      <HotelSearch />
    </div>
  );
};

export default Hotels; 