import React from 'react';
import { getEventsForDate } from '../../utils/serviceCalendarUtils';

const CalendarWeek = ({ weekDays, events }) => {
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM a 8 PM

  const getEventsForHour = (dayEvents, hour) => {
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventHour === hour;
    });
  };

  return (
    <div className="w-full overflow-auto">
      {/* Encabezado de días */}
      <div className="grid grid-cols-8 gap-1 mb-2 sticky top-0 bg-white z-10">
        <div className="text-center font-medium py-2 text-gray-dark">Hora</div>
        {weekDays.map((dayInfo, index) => (
          <div 
            key={index} 
            className={`text-center font-medium py-2 ${
              dayInfo.isToday ? 'text-primary' : 'text-gray-dark'
            }`}
          >
            <div>{dayNames[index]}</div>
            <div className={`text-lg ${dayInfo.isToday ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
              {dayInfo.day}
            </div>
          </div>
        ))}
      </div>
      
      {/* Rejilla de horas */}
      <div className="border border-gray-light">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-1 border-b border-gray-light">
            <div className="text-center py-4 text-sm text-gray-dark font-medium bg-gray-lightest">
              {hour}:00
            </div>
            {weekDays.map((dayInfo, dayIndex) => {
              const dayEvents = getEventsForDate(events, dayInfo.date);
              const hourEvents = getEventsForHour(dayEvents, hour);
              
              return (
                <div 
                  key={dayIndex}
                  className="p-2 min-h-[60px] border-r border-gray-light last:border-r-0"
                >
                  {hourEvents.map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className={`text-white py-1 px-2 rounded text-xs mb-1 cursor-pointer ${
                        event.color || 'bg-gray-500'
                      }`}
                      title={`${event.title} - ${event.client} (${event.time}) - Estado: ${event.status} - Prioridad: ${event.priority}`}
                    >
                      {event.title} - {event.client}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeek;