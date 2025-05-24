import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CalendarGrid from '../components/calendar/CalendarGrid';
import CalendarWeek from '../components/calendar/CalendarWeek';
import CalendarDayView from '../components/calendar/CalendarDayView';
import { 
  calendarEvents, 
  generateCalendarDays, 
  generateWeekDays,
  getSelectedDayDate,
  filterCalendarEvents 
} from '../utils/calendarMockData';
import { technicianData } from '../utils/mockData';

const ServiceCalendar = () => {
  const [currentDate, setCurrentDate] = useState({
    month: 4, // Mayo (0-indexed)
    year: 2025,
    day: 21, // Día actual para vistas de semana y día
  });
  
  const [viewMode, setViewMode] = useState('month');
  
  const [filters, setFilters] = useState({
    types: ['programado', 'correctivo'],
    technician: 'todos',
  });
  
  // Obtener datos del calendario según la vista
  const calendarDays = generateCalendarDays(currentDate.year, currentDate.month);
  const weekDays = generateWeekDays(currentDate.year, currentDate.month, currentDate.day);
  const selectedDayDate = getSelectedDayDate(currentDate.year, currentDate.month, currentDate.day);
  const filteredEvents = filterCalendarEvents(calendarEvents, filters);
  
  // Nombres de los meses
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Funciones de navegación
  const goToPrev = () => {
    setCurrentDate(prev => {
      if (viewMode === 'month') {
        const newMonth = prev.month - 1;
        if (newMonth < 0) {
          return { ...prev, month: 11, year: prev.year - 1 };
        }
        return { ...prev, month: newMonth };
      } else if (viewMode === 'week') {
        const newDate = new Date(prev.year, prev.month, prev.day - 7);
        return {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDate()
        };
      } else { // day
        const newDate = new Date(prev.year, prev.month, prev.day - 1);
        return {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDate()
        };
      }
    });
  };
  
  const goToNext = () => {
    setCurrentDate(prev => {
      if (viewMode === 'month') {
        const newMonth = prev.month + 1;
        if (newMonth > 11) {
          return { ...prev, month: 0, year: prev.year + 1 };
        }
        return { ...prev, month: newMonth };
      } else if (viewMode === 'week') {
        const newDate = new Date(prev.year, prev.month, prev.day + 7);
        return {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDate()
        };
      } else { // day
        const newDate = new Date(prev.year, prev.month, prev.day + 1);
        return {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDate()
        };
      }
    });
  };
  
  // Manejar cambios en filtros
  const handleFilterTypeToggle = (type) => {
    setFilters(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...prev.types, type] };
      }
    });
  };
  
  const handleTechnicianChange = (e) => {
    setFilters(prev => ({ ...prev, technician: e.target.value }));
  };

  // Función para obtener el título según la vista
  const getViewTitle = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.month]} ${currentDate.year}`;
    } else if (viewMode === 'week') {
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      if (weekStart.date.getMonth() === weekEnd.date.getMonth()) {
        return `${weekStart.day} - ${weekEnd.day} ${monthNames[weekStart.date.getMonth()]} ${weekStart.date.getFullYear()}`;
      } else {
        return `${weekStart.day} ${monthNames[weekStart.date.getMonth()]} - ${weekEnd.day} ${monthNames[weekEnd.date.getMonth()]} ${weekStart.date.getFullYear()}`;
      }
    } else { // day
      return `${currentDate.day} ${monthNames[currentDate.month]} ${currentDate.year}`;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Calendario de Servicios</h2>
        </div>
        <div className="flex gap-3">
          <Link
            to="/servicios"
            className="btn btn-outline flex items-center gap-2"
          >
            <FaArrowLeft /> Volver
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded shadow p-5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-4">
            <button 
              onClick={goToPrev}
              className="btn btn-outline p-2"
            >
              <FaChevronLeft />
            </button>
            <h3 className="text-xl font-medium m-0 min-w-[200px] text-center">
              {getViewTitle()}
            </h3>
            <button 
              onClick={goToNext}
              className="btn btn-outline p-2"
            >
              <FaChevronRight />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('month')}
            >
              Mes
            </button>
            <button 
              className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('week')}
            >
              Semana
            </button>
            <button 
              className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('day')}
            >
              Día
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mb-5 pb-4 border-b border-gray-light">
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Tipo:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.types.includes('programado')}
                  onChange={() => handleFilterTypeToggle('programado')}
                  className="hidden"
                />
                <span className={`inline-block w-4 h-4 rounded ${filters.types.includes('programado') ? 'bg-info' : 'bg-gray-light'}`}></span>
                Programado
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.types.includes('correctivo')}
                  onChange={() => handleFilterTypeToggle('correctivo')}
                  className="hidden"
                />
                <span className={`inline-block w-4 h-4 rounded ${filters.types.includes('correctivo') ? 'bg-warning' : 'bg-gray-light'}`}></span>
                Correctivo
              </label>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-2 font-medium">Técnicos:</label>
            <select 
              className="px-2 py-2 border border-gray-light rounded min-w-[120px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              value={filters.technician}
              onChange={handleTechnicianChange}
            >
              <option value="todos">Todos</option>
              {technicianData.map((tech, index) => (
                <option key={index} value={tech.name}>{tech.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="calendar-container">
          {viewMode === 'month' && (
            <CalendarGrid 
              days={calendarDays} 
              events={filteredEvents} 
            />
          )}
          {viewMode === 'week' && (
            <CalendarWeek 
              weekDays={weekDays} 
              events={filteredEvents} 
            />
          )}
          {viewMode === 'day' && (
            <CalendarDayView 
              selectedDate={selectedDayDate} 
              events={filteredEvents} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCalendar;