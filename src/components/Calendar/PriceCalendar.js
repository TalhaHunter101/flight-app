import React, { useEffect, useState } from "react";
import { getPriceCalendar } from "../../api/flightApiService";

const PriceCalendar = ({
  originSkyId,
  destinationSkyId,
  selectedDate,
  returnDate,
  onDateSelect,
  isSelectingReturn,
  tripType,
}) => {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    const fetchPriceCalendar = async () => {
      if (!originSkyId || !destinationSkyId) return;

      setLoading(true);
      try {
        const fromDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          1
        );
        const toDate = new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 2,
          0
        );

        const response = await getPriceCalendar(
          originSkyId,
          destinationSkyId,
          fromDate.toISOString().split("T")[0],
          toDate.toISOString().split("T")[0]
        );

        setCalendarData(response.data.flights);
      } catch (error) {
        console.error("Error fetching price calendar:", error);
      }
      setLoading(false);
    };

    fetchPriceCalendar();
  }, [originSkyId, destinationSkyId, currentMonth]);

  const getPriceColor = (group) => {
    switch (group) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isInRange = (date) => {
    if (!selectedDate || !hoverDate || !isSelectingReturn) return false;
    const checkDate = new Date(date);
    const start = new Date(selectedDate);
    const end = new Date(hoverDate);
    return checkDate >= start && checkDate <= end;
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(new Date(date))) return;

    // For one-way trips, always close calendar after selection
    if (tripType === "one-way") {
      onDateSelect(date, false);
      return;
    }

    onDateSelect(date, isSelectingReturn);
  };

  const renderCalendarMonth = (monthOffset) => {
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset + 1,
      0
    );
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);

    const weeks = [];
    let days = [];
    let day = startDate;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate.getDay(); i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>);
    }

    while (day <= endDate) {
      const currentDate = day.toISOString().split("T")[0];
      const priceData = calendarData?.days.find((d) => d.day === currentDate);
      const isDisabled = isDateDisabled(day);
      const isSelected =
        currentDate === selectedDate || currentDate === returnDate;
      const isInDateRange = isInRange(currentDate);

      days.push(
        <td
          key={currentDate}
          className={`p-2 text-center ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-700"
          } ${isSelected ? "bg-blue-600" : ""} 
          ${isInDateRange ? "bg-blue-600/30" : ""}`}
          onClick={() => !isDisabled && handleDateClick(currentDate)}
          onMouseEnter={() => isSelectingReturn && setHoverDate(currentDate)}
        >
          <div className="flex flex-col items-center">
            <span
              className={`text-sm ${
                isDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              {day.getDate()}
            </span>
            {priceData && !isDisabled && (
              <span className={`text-xs ${getPriceColor(priceData.group)}`}>
                ${Math.round(priceData.price)}
              </span>
            )}
          </div>
        </td>
      );

      if (days.length === 7) {
        weeks.push(<tr key={day.toISOString()}>{days}</tr>);
        days = [];
      }

      day = new Date(day.setDate(day.getDate() + 1));
    }

    if (days.length > 0) {
      weeks.push(<tr key={`last-${monthOffset}`}>{days}</tr>);
    }

    return weeks;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl w-[800px] -translate-x-1/2 absolute">
      <div className="p-4 relative">
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white">Loading prices...</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
              )
            }
            className="text-gray-400 hover:text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex space-x-8">
            <h2 className="text-white text-xl">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <h2 className="text-white text-xl">
              {new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              ).toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
          </div>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
              )
            }
            className="text-gray-400 hover:text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[0, 1].map((monthOffset) => (
            <table key={monthOffset} className="w-full">
              <thead>
                <tr>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <th
                      key={day}
                      className="text-gray-400 font-normal p-2 text-center"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderCalendarMonth(monthOffset)}</tbody>
            </table>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center text-gray-400 text-sm px-4 pb-4">
          <div>
            {isSelectingReturn ? "Select return date" : "Select departure date"}
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Low
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Medium
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
