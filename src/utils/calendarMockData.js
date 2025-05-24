// Datos simulados para el calendario

export const calendarEvents = [
  {
    id: 1,
    title: 'Mantenimiento Preventivo',
    client: 'Norte Supermercados',
    type: 'programado',
    date: '2025-05-21',
    time: '14:30',
    technician: 'Juan Pérez',
    equipment: ['Refrigerador Industrial'],
  },
  {
    id: 2,
    title: 'Inspección Congelador',
    client: 'Buena Mesa Restaurante',
    type: 'programado',
    date: '2025-05-22',
    time: '10:00',
    technician: 'María López',
    equipment: ['Congelador Vertical'],
  },
  {
    id: 3,
    title: 'Reparación Cámara Frigorífica',
    client: 'Hospital San Juan',
    type: 'correctivo',
    date: '2025-05-22',
    time: '09:00',
    technician: 'Carlos González',
    equipment: ['Cámara Frigorífica'],
  },
  {
    id: 4,
    title: 'Mantenimiento Frigobar',
    client: 'Hotel Las Palmas',
    type: 'programado',
    date: '2025-05-24',
    time: '15:00',
    technician: 'Ana Martínez',
    equipment: ['Frigobar'],
  },
  {
    id: 5,
    title: 'Reparación Urgente',
    client: 'Buena Mesa Restaurante',
    type: 'correctivo',
    date: '2025-05-25',
    time: '08:30',
    technician: 'Juan Pérez',
    equipment: ['Congelador Horizontal'],
  },
  {
    id: 6,
    title: 'Mantenimiento Sistema Central',
    client: 'Norte Supermercados',
    type: 'programado',
    date: '2025-05-27',
    time: '09:00',
    technician: 'Carlos González',
    equipment: ['Sistema Central de Refrigeración'],
  },
  {
    id: 7,
    title: 'Instalación Equipo Nuevo',
    client: 'Hospital San Juan',
    type: 'programado',
    date: '2025-05-28',
    time: '11:00',
    technician: 'María López',
    equipment: ['Cámara Frigorífica'],
  },
  {
    id: 8,
    title: 'Evaluación para Cotización',
    client: 'Ricardo Sánchez',
    type: 'programado',
    date: '2025-05-29',
    time: '16:00',
    technician: 'Ana Martínez',
    equipment: ['Refrigerador Doméstico'],
  },
];

// Generar un mes de calendario (mayo 2025)
export const generateCalendarDays = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = domingo, 6 = sábado
  
  // Calcular días del mes anterior
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthDays.push({
      day: prevMonthLastDay - i,
      month: 'prev',
      date: new Date(year, month - 1, prevMonthLastDay - i)
    });
  }
  
  // Calcular días del mes actual
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      day: i,
      month: 'current',
      date: new Date(year, month, i),
      isToday: i === 21 && month === 4 // Simulamos que hoy es 21 de mayo
    });
  }
  
  // Calcular días del mes siguiente
  const totalDaysDisplayed = 42; // 6 semanas
  const nextMonthDays = [];
  const remainingDays = totalDaysDisplayed - prevMonthDays.length - currentMonthDays.length;
  
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push({
      day: i,
      month: 'next',
      date: new Date(year, month + 1, i)
    });
  }
  
  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

// Función para filtrar eventos por tipo y técnico
export const filterCalendarEvents = (events, filters) => {
  return events.filter(event => {
    // Filtrar por tipo
    if (filters.types.length > 0 && !filters.types.includes(event.type)) {
      return false;
    }
    
    // Filtrar por técnico
    if (filters.technician !== 'todos' && event.technician !== filters.technician) {
      return false;
    }
    
    return true;
  });
};

// Función para obtener eventos para una fecha específica
export const getEventsForDate = (events, date) => {
  const dateStr = date.toISOString().split('T')[0];
  return events.filter(event => event.date === dateStr);
};

// Función para generar días de una semana específica
export const generateWeekDays = (year, month, day) => {
  const selectedDate = new Date(year, month, day);
  const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 6 = sábado
  
  const weekDays = [];
  
  // Calcular el domingo de la semana
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
  
  // Generar los 7 días de la semana
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    
    weekDays.push({
      day: currentDay.getDate(),
      month: currentDay.getMonth() === month ? 'current' : 'other',
      date: currentDay,
      isToday: currentDay.getDate() === 21 && currentDay.getMonth() === 4 // Simulamos que hoy es 21 de mayo
    });
  }
  
  return weekDays;
};

// Función para obtener la fecha formateada para el día seleccionado
export const getSelectedDayDate = (year, month, day) => {
  return new Date(year, month, day);
};