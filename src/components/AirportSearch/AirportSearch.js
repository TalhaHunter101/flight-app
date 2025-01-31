import React, { useState } from "react";
import { searchAirport } from "../../api/flightApiService";
import AirportList from "./AirportList";

const AirportSearch = ({ placeholder, value, onChange, type, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (query) => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchAirport(query);
      const suggestions = response.data ? response.data : [];
      const mappedSuggestions = suggestions.map((item) => ({
        name: item.presentation.title,
        suggestionTitle: item.presentation.suggestionTitle,
        subtitle: item.presentation.subtitle,
        entityId: item.navigation.entityId,
        skyId: item.navigation.relevantFlightParams.skyId,
        type: item.navigation.entityType,
      }));

      setSuggestions(mappedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = (airport) => {
    onSelect(airport);
    setShowSuggestions(false);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="relative airport-search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          handleSearch(e.target.value);
        }}
        onFocus={() => {
          setShowSuggestions(true);
          if (value.length > 0) {
            handleSearch(value);
          }
        }}
        className="w-full bg-gray-700 text-white px-4 py-3 rounded-md"
      />
      {showSuggestions && (
        <AirportList suggestions={suggestions} onSelect={handleSelect} />
      )}
    </div>
  );
};

export default AirportSearch;
