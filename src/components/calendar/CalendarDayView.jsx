import React from 'react';
import { getEventsForDate } from '../../utils/serviceCalendarUtils';

const CalendarDayView = ({ selectedDate, events }) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM a 8 PM
  const dayEvents = getEventsForDate(events, selectedDate);

  const getEventsForHour = (hour) => {
    return dayEvents.filter(event => {
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventHour === hour;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="w-full">
      {/* Encabezado del día */}
      <div className="text-center mb-4 p-4 bg-gray-lightest rounded">
        <h3 className="text-xl font-medium text-primary">
          {formatDate(selectedDate)}
        </h3>
        <p className="text-sm text-gray-dark mt-1">
          {dayEvents.length} servicio{dayEvents.length !== 1 ? 's' : ''} programado{dayEvents.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Rejilla de horas */}
      <div className="border border-gray-light rounded">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          
          return (
            <div key={hour} className="flex border-b border-gray-light last:border-b-0">
              <div className="w-20 text-center py-4 text-sm text-gray-dark font-medium bg-gray-lightest border-r border-gray-light">
                {hour}:00
              </div>
              <div className="flex-1 p-4 min-h-[80px]">
                {hourEvents.length > 0 ? (
                  <div className="space-y-2">
                    {hourEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        className={`p-3 rounded border-l-4 cursor-pointer ${
                          event.color ? `${event.color}/10 border-${event.color.replace('bg-', '')}` : 'bg-gray-500/10 border-gray-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-dark">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray mt-1">
                              Cliente: {event.client}
                            </p>
                            <p className="text-sm text-gray">
                              Técnico: {event.technician}
                            </p>
                            <p className="text-sm text-gray">
                              Estado: {event.status} | Prioridad: {event.priority}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium text-white ${
                              event.color || 'bg-gray-500'
                            }`}>
                              {event.type?.toUpperCase() || 'SERVICIO'}
                            </span>
                            <p className="text-sm font-medium mt-1">
                              {event.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-light py-4">
                    No hay servicios programados para esta hora
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;