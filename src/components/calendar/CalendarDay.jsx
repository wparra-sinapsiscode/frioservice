import React from 'react';

const CalendarDay = ({ day, isToday, isOtherMonth, events }) => {
  return (
    <div className={`border border-gray-light p-2 min-h-[120px] relative overflow-y-auto ${
      isOtherMonth ? 'bg-[#f9f9f9] text-gray' : ''
    } ${isToday ? 'border-primary' : ''}`}>
      <div className={`font-medium mb-2 flex justify-center items-center w-6 h-6 ${
        isToday ? 'bg-primary text-white rounded-full' : ''
      }`}>
        {day}
      </div>
      
      <div className="space-y-1">
        {events.map((event, index) => (
          <div 
            key={index}
            className={`text-white py-1 px-2 rounded text-xs whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer ${
              event.type === 'programado' ? 'bg-info' : 'bg-warning'
            }`}
            title={`${event.title} - ${event.client} (${event.time})`}
          >
            {event.time} - {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;