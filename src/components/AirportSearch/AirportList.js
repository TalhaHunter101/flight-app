import React from "react";
import AirportIcon from "./AirportIcon";
import LocationIcon from "./LocationIcon";

const AirportList = ({ suggestions, onSelect }) => {
  return (
    <div className="absolute w-full mt-1 bg-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
      {suggestions.length > 0 ? (
        suggestions.map((airport, index) => (
          <div
            key={`${airport.skyId}-${index}`}
            className="p-3 hover:bg-gray-600 cursor-pointer text-gray-100"
            onClick={() => onSelect(airport)}
          >
            <div className="flex items-start">
              {airport.type === "AIRPORT" ? <AirportIcon /> : <LocationIcon />}
              <div>
                <div className="text-gray-100 font-medium">{airport.name}</div>
                <div className="text-gray-300 text-sm">{airport.subtitle}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-3 text-gray-400">No results found</div>
      )}
    </div>
  );
};

export default AirportList;
