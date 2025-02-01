import React, { useState, useEffect, useRef } from "react";
import { searchAirport } from "../../api/flightApiService";
import AirportList from "./AirportList";

const AirportSearch = ({ placeholder, value, onChange, type, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const previousSearches = useRef(new Map()); // Cache for previous searches

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Check if we have cached results for this query
    if (previousSearches.current.has(query)) {
      setSuggestions(previousSearches.current.get(query));
      setShowSuggestions(true);
      return;
    }

    try {
      const response = await searchAirport(query);
      console.log("API response:", response);
      const suggestions = response.data ? response.data : [];
      const mappedSuggestions = suggestions.map((item) => ({
        name: item.presentation.title,
        suggestionTitle: item.presentation.suggestionTitle,
        subtitle: item.presentation.subtitle,
        entityId: item.navigation.entityId,
        skyId: item.navigation.relevantFlightParams.skyId,
        type: item.navigation.entityType,
      }));

      // Cache the results
      previousSearches.current.set(query, mappedSuggestions);

      // Limit cache size to prevent memory issues
      if (previousSearches.current.size > 20) {
        const firstKey = previousSearches.current.keys().next().value;
        previousSearches.current.delete(firstKey);
      }

      setSuggestions(mappedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (value) => {
    onChange(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to delay the search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500); // Increased to 500ms for fewer API calls
  };

  const handleSelect = (airport) => {
    onSelect(airport);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative airport-search-container" ref={searchContainerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          setShowSuggestions(true);
          if (value.length >= 2) {
            // Only search if 2 or more characters
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
