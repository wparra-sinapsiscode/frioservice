import React from 'react';
import CalendarDay from './CalendarDay';
import { getEventsForDate } from '../../utils/serviceCalendarUtils';

const CalendarGrid = ({ days, events }) => {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <div className="w-full overflow-hidden">
      {/* Cabecera de días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div 
            key={index} 
            className="text-center font-medium py-2 text-gray-dark"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Rejilla de días */}
      <div className="grid grid-cols-7 gap-1 h-[700px]">
        {days.map((dayInfo, index) => {
          const dayEvents = getEventsForDate(events, dayInfo.date);
          
          return (
            <CalendarDay 
              key={index}
              day={dayInfo.day}
              isToday={dayInfo.isToday}
              isOtherMonth={dayInfo.month !== 'current'}
              events={dayEvents}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;