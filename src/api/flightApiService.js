const axios = require("axios");

// Query Params for getNearbyAirports
// lat: Latitude of the location
// lng: Longitude of the location
// locale: (Optional) Locale code. Default is 'en-US'.
const getNearbyAirports = async (lat, lng, locale = "en-US") => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports",
    params: {
      lat: lat,
      lng: lng,
      locale: locale,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchAirport
// query: The search query string
// locale: (Optional) Locale code. Default is 'en-US'.
const searchAirport = async (query, locale = "en-US") => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport",
    params: {
      query: query,
      locale: locale,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchFlightsV2
// originSkyId: The originSkyId code, extracted from the Search Airport API.
// destinationSkyId: The destinationSkyId code, extracted from the Search Airport API.
// originEntityId: The originEntityId code, extracted from the Search Airport API.
// destinationEntityId: The destinationEntityId code, extracted from the Search Airport API.
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// adults: (Optional) Number of adults (12+ years). Default is 1.
// sortBy: (Optional) Sort by criteria. Default is 'best'. Options: 'best', 'price_high', 'fastest', 'outbound_take_off_time', 'outbound_landing_time', 'return_take_off_time', 'return_landing_time'.
// currency: (Optional) Currency code. Default is 'USD'.
// market: (Optional) Market code. Default is 'en-US'.
// countryCode: (Optional) Country code. Default is 'US'.
const searchFlightsV2 = async (
  originSkyId,
  destinationSkyId,
  originEntityId,
  destinationEntityId,
  departureDate,
  returnDate,
  cabinClass = "economy",
  adults = 1,
  childrens = 0,
  infants = 0,
  sortBy = "best",
  limit = 20,
  carriersIds,
  currency = "USD",
  market = "en-US",
  countryCode = "US"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights",
    params: {
      originSkyId: originSkyId,
      destinationSkyId: destinationSkyId,
      originEntityId: originEntityId,
      destinationEntityId: destinationEntityId,
      date: departureDate,
      returnDate: returnDate,
      cabinClass: cabinClass,
      adults: adults,
      childrens: childrens,
      infants: infants,
      sortBy: sortBy,
      limit: limit,
      carriersIds: carriersIds,
      currency: currency,
      market: market,
      countryCode: countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchFlightsComplete
// originSkyId: The originSkyId code, extracted from the Search Airport API.
// destinationSkyId: The destinationSkyId code, extracted from the Search Airport API.
// originEntityId: The originEntityId code, extracted from the Search Airport API.
// destinationEntityId: The destinationEntityId code, extracted from the Search Airport API.
// date: Departure or travel date. Format: YYYY-MM-DD
// returnDate: (Optional) Return date. Format: YYYY-MM-DD
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// adults: (Optional) Number of adults (12+ years). Default is 1.
// childrens: (Optional) Number of children (2-12 years). Default is 0.
// infants: (Optional) Number of infants (Under 2 years). Default is 0.
// sortBy: (Optional) Sort by criteria. Default is 'best'. Options: 'best', 'price_high', 'fastest', 'outbound_take_off_time', 'outbound_landing_time', 'return_take_off_time', 'return_landing_time'.
// limit: (Optional) Set a limit on the amount of records. Example: 100
// carriersIds: (Optional) Filter the flight itinerary data by the carrier. If there are multiple carriers that need to be passed, they should be passed in comma-separated format. Example: -32672,-31435
// currency: (Optional) Currency code. Default is 'USD'.
// market: (Optional) Market code. Default is 'en-US'.
// countryCode: (Optional) Country code. Default is 'US'.
const searchFlightsComplete = async (
  originSkyId,
  destinationSkyId,
  originEntityId,
  destinationEntityId,
  date,
  returnDate = null,
  cabinClass = "economy",
  adults = 1,
  childrens = 0,
  infants = 0,
  sortBy = "best",
  limit = null,
  carriersIds = null,
  currency = "USD",
  market = "en-US",
  countryCode = "US"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete",
    params: {
      originSkyId: originSkyId,
      destinationSkyId: destinationSkyId,
      originEntityId: originEntityId,
      destinationEntityId: destinationEntityId,
      date: date,
      returnDate: returnDate,
      cabinClass: cabinClass,
      adults: adults,
      childrens: childrens,
      infants: infants,
      sortBy: sortBy,
      limit: limit,
      carriersIds: carriersIds,
      currency: currency,
      market: market,
      countryCode: countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchIncompleteFlights
// sessionId: Session id can be retrieved from api/v2/flights/searchFlights or api/v1/flights/searchFlights or api/v2/flights/searchFlightsComplete endpoint(data->context->sessionId)
// limit: (Optional) Set a limit on the amount of records. Example: 100
// carriersIds: (Optional) Filter the flight itinerary data by the carrier. If there are multiple carriers that need to be passed, they should be passed in comma-separated format. Example: -32672,-31435
// currency: (Optional) Currency code. Default is 'USD'.
// market: (Optional) Market code. Default is 'en-US'.
// countryCode: (Optional) Country code. Default is 'US'.
const searchIncompleteFlights = async (
  sessionId,
  limit = null,
  carriersIds = null,
  currency = "USD",
  market = "en-US",
  countryCode = "US"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchIncomplete",
    params: {
      sessionId: sessionId,
      limit: limit,
      carriersIds: carriersIds,
      currency: currency,
      market: market,
      countryCode: countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for getFlightDetails
// legs: The legs must contain the origin, destination and date in object format and must be passed in an array. EXAMPLE: [ { 'origin': 'LHR', 'destination': 'JFK', 'date': '2024-01-07' }, ... ]
// adults: (Optional) Number of adults (12+ years). Default is 1.
// currency: (Optional) Currency code. Default is 'USD'.
// locale: (Optional) Locale code. Default is 'en-US'.
// market: (Optional) Market code. Default is 'en-US'.
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// countryCode: (Optional) Country code. Default is 'US'.
const getFlightDetails = async ({
  itineraryId,
  legs,
  sessionId,
  adults = 1,
  currency = "USD",
  locale = "en-US",
  market = "en-US",
  cabinClass = "economy",
  countryCode = "US",
}) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/getFlightDetails",
    params: {
      itineraryId,
      legs: JSON.stringify(legs),
      sessionId,
      adults,
      currency,
      locale,
      market,
      cabinClass,
      countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for getPriceCalendar
// originSkyId: The originSkyId code can be extracted from the Search Airport API in the Flights collection.
// destinationSkyId: The destinationSkyId code can be extracted from the Search Airport API in the Flights collection.
// fromDate: Journey date. Format: YYYY-MM-DD
// toDate: (Optional) Return date. Format: YYYY-MM-DD
// currency: (Optional) Currency code. Default is 'USD'.
const getPriceCalendar = async (
  originSkyId,
  destinationSkyId,
  fromDate,
  toDate = null,
  currency = "USD"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/getPriceCalendar",
    params: {
      originSkyId: originSkyId,
      destinationSkyId: destinationSkyId,
      fromDate: fromDate,
      toDate: toDate,
      currency: currency,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Error fetching price calendar:", error);
    throw error;
  }
};

// Query Params for searchFlightsMultiStops
// legs: The legs must contain the origin, originEntityId, destination, destinationEntityId and date in object format and must be passed in an array. EXAMPLE: [ { 'origin': 'LHR', 'originEntityId': '95565050', 'destination': 'JFK', 'destinationEntityId': '95565058', 'date': '2024-01-07' }, ... ]
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// adults: (Optional) Number of adults (12+ years). Default is 1.
// childrens: (Optional) Number of children (2-12 years). Default is 0.
// infants: (Optional) Number of infants (Under 2 years). Default is 0.
// sortBy: (Optional) Sort by criteria. Default is 'best'. Options: 'best', 'price_high', 'fastest', 'outbound_take_off_time', 'outbound_landing_time', 'return_take_off_time', 'return_landing_time'.
// currency: (Optional) Currency code. Default is 'USD'.
// market: (Optional) Market code. Default is 'en-US'.
// countryCode: (Optional) Country code. Default is 'US'.
const searchFlightsMultiStops = async (
  legs,
  cabinClass = "economy",
  adults = 1,
  childrens = 0,
  infants = 0,
  sortBy = "best",
  currency = "USD",
  market = "en-US",
  countryCode = "US"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlightsMultiStops",
    params: {
      legs: JSON.stringify(legs),
      cabinClass: cabinClass,
      adults: adults,
      childrens: childrens,
      infants: infants,
      sortBy: sortBy,
      currency: currency,
      market: market,
      countryCode: countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchFlightEverywhere
// originEntityId: The originEntityId code can be extracted from the Search Airport API in the Flights collection.
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// journeyType: (Optional) One Way = one_way, Round Trip = round_trip
// currency: (Optional) Currency code. Default is 'USD'.
const searchFlightEverywhere = async (
  originEntityId,
  cabinClass = "economy",
  journeyType = "one_way",
  currency = "USD"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightEverywhere",
    params: {
      originEntityId: originEntityId,
      cabinClass: cabinClass,
      journeyType: journeyType,
      currency: currency,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Query Params for searchFlightsWebComplete
// originSkyId: The originSkyId code can be extracted from the Search Airport API in the Flights collection.
// destinationSkyId: The destinationSkyId code can be extracted from the Search Airport API in the Flights collection.
// originEntityId: The originEntityId code can be extracted from the Search Airport API in the Flights collection.
// destinationEntityId: The destinationEntityId code can be extracted from the Search Airport API in the Flights collection.
// date: Departure or travel date. Format: YYYY-MM-DD
// returnDate: (Optional) Return date. Format: YYYY-MM-DD
// cabinClass: (Optional) The cabin class. Default is 'economy'. Options: 'economy', 'premium_economy', 'business', 'first'.
// adults: (Optional) Number of adults (12+ years). Default is 1.
// childrens: (Optional) Number of children (2-12 years). Default is 0.
// infants: (Optional) Number of infants (Under 2 years). Default is 0.
// sortBy: (Optional) Sort by criteria. Default is 'best'. Options: 'best', 'price_high', 'fastest', 'outbound_take_off_time', 'outbound_landing_time', 'return_take_off_time', 'return_landing_time'.
// limit: (Optional) Set a limit on the amount of records. Example: 100
// carriersIds: (Optional) Filter the flight itinerary data by the carrier. If there are multiple carriers that need to be passed, they should be passed in comma-separated format. Example: -32672,-31435
// currency: (Optional) Currency code. Default is 'USD'.
// market: (Optional) Market code. Default is 'en-US'.
// countryCode: (Optional) Country code. Default is 'US'.
const searchFlightsWebComplete = async (
  originSkyId,
  destinationSkyId,
  originEntityId,
  destinationEntityId,
  date,
  returnDate = null,
  cabinClass = "economy",
  adults = 1,
  childrens = 0,
  infants = 0,
  sortBy = "best",
  limit = null,
  carriersIds = null,
  currency = "USD",
  market = "en-US",
  countryCode = "US"
) => {
  const options = {
    method: "GET",
    url: "https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsWebComplete",
    params: {
      originSkyId: originSkyId,
      destinationSkyId: destinationSkyId,
      originEntityId: originEntityId,
      destinationEntityId: destinationEntityId,
      date: date,
      returnDate: returnDate,
      cabinClass: cabinClass,
      adults: adults,
      childrens: childrens,
      infants: infants,
      sortBy: sortBy,
      limit: limit,
      carriersIds: carriersIds,
      currency: currency,
      market: market,
      countryCode: countryCode,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.REACT_APP_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  getNearbyAirports,
  searchAirport,
  searchFlightsV2,
  searchFlightsComplete,
  searchFlightsWebComplete,
  searchIncompleteFlights,
  getFlightDetails,
  getPriceCalendar,
  searchFlightsMultiStops,
  searchFlightEverywhere,
};
