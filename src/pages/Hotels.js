import React from "react";
import HotelSearch from "../components/Hotels/HotelSearch";

const Hotels = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          Hotel Search
        </h1>
        <HotelSearch />
      </div>
    </div>
  );
};

export default Hotels;
