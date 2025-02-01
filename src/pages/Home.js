import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-white">
          Welcome to Flight & Hotel Search
        </h1>
        <p className="text-lg text-gray-900 mb-8">
          Search for flights and hotels using our simple and intuitive
          interface.
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/flights"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Search Flights
          </Link>
          <Link
            to="/hotels"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Search Hotels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
