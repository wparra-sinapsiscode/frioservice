// Utilidades para integrar servicios reales con el calendario

// Mapeo de estados del servicio a colores
export const getServiceStatusColor = (status) => {
  const statusColors = {
    'PENDING': 'bg-yellow-500',       // Amarillo para pendiente
    'CONFIRMED': 'bg-blue-500',       // Azul para confirmado
    'IN_PROGRESS': 'bg-purple-500',   // Morado para en progreso
    'COMPLETED': 'bg-green-500',      // Verde para completado
    'CANCELLED': 'bg-red-500',        // Rojo para cancelado
    'ON_HOLD': 'bg-orange-500'        // Naranja para en espera
  };
  return statusColors[status] || 'bg-gray-500';
};

// Mapeo de prioridades del servicio a colores
export const getServicePriorityColor = (priority) => {
  const priorityColors = {
    'LOW': 'bg-green-400',      // Verde claro para baja
    'MEDIUM': 'bg-yellow-400',  // Amarillo para media  
    'HIGH': 'bg-orange-500',    // Naranja para alta
    'URGENT': 'bg-red-600'      // Rojo fuerte para urgente
  };
  return priorityColors[priority] || 'bg-gray-400';
};

// Mapeo de tipos de servicio a colores
export const getServiceTypeColor = (type) => {
  const typeColors = {
    'MAINTENANCE': 'bg-info',      // Azul (usando clase existente)
    'REPAIR': 'bg-warning',        // Amarillo (usando clase existente)
    'INSTALLATION': 'bg-success',  // Verde (usando clase existente)
    'INSPECTION': 'bg-primary',    // Azul primario
    'EMERGENCY': 'bg-danger',      // Rojo (usando clase existente)
    'CLEANING': 'bg-secondary',    // Gris
    'CONSULTATION': 'bg-info'      // Azul info
  };
  return typeColors[type] || 'bg-gray-500';
};

// Obtener color combinado basado en prioridad y estado
export const getServiceEventColor = (service) => {
  // Priorizar por urgencia primero
  if (service.priority === 'URGENT') {
    return 'bg-red-600';
  }
  if (service.priority === 'HIGH') {
    return 'bg-orange-500';
  }
  
  // Luego por estado
  if (service.status === 'CANCELLED') {
    return 'bg-red-500';
  }
  if (service.status === 'COMPLETED') {
    return 'bg-green-500';
  }
  if (service.status === 'IN_PROGRESS') {
    return 'bg-purple-500';
  }
  if (service.status === 'CONFIRMED') {
    return 'bg-blue-500';
  }
  
  // Finalmente por tipo para servicios pendientes
  return getServiceTypeColor(service.type);
};

// Convertir servicios del backend a eventos del calendario
export const mapServicesToCalendarEvents = (services) => {
  return services.map(service => ({
    id: service.id,
    title: service.title,
    client: service.client?.companyName || service.client?.contactPerson || 'Cliente no especificado',
    type: service.type?.toLowerCase() || 'maintenance',
    status: service.status,
    priority: service.priority,
    date: service.scheduledDate ? service.scheduledDate.split('T')[0] : null, // Formato YYYY-MM-DD
    time: service.scheduledDate ? 
      new Date(service.scheduledDate).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : 'Sin hora',
    technician: service.technician?.name || service.technician?.firstName + ' ' + service.technician?.lastName || 'Sin asignar',
    equipment: service.equipmentIds || [],
    duration: service.estimatedDuration || null,
    address: service.address,
    contactPhone: service.contactPhone,
    notes: service.clientNotes,
    color: getServiceEventColor(service)
  }));
};

// Filtrar eventos del calendario por criterios
export const filterCalendarEvents = (events, filters) => {
  return events.filter(event => {
    // Filtrar por tipos (mapear desde el filtro del frontend)
    if (filters.types && filters.types.length > 0) {
      const typeMapping = {
        'programado': ['MAINTENANCE', 'INSTALLATION', 'INSPECTION', 'CLEANING', 'CONSULTATION'],
        'correctivo': ['REPAIR', 'EMERGENCY']
      };
      
      const allowedTypes = filters.types.flatMap(type => typeMapping[type] || []);
      if (!allowedTypes.includes(event.type?.toUpperCase())) {
        return false;
      }
    }
    
    // Filtrar por técnico
    if (filters.technician && filters.technician !== 'todos' && event.technician !== filters.technician) {
      return false;
    }
    
    // Filtrar por estado si se proporciona
    if (filters.status && filters.status !== 'todos' && event.status !== filters.status.toUpperCase()) {
      return false;
    }
    
    // Filtrar por prioridad si se proporciona
    if (filters.priority && filters.priority !== 'todos' && event.priority !== filters.priority.toUpperCase()) {
      return false;
    }
    
    return true;
  });
};

// Obtener eventos para una fecha específica
export const getEventsForDate = (events, date) => {
  const dateStr = date.toISOString().split('T')[0];
  return events.filter(event => event.date === dateStr);
};

// Generar un mes de calendario (reutilizando lógica existente)
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
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    currentMonthDays.push({
      day: i,
      month: 'current',
      date: currentDate,
      isToday: currentDate.toDateString() === today.toDateString()
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

// Función para generar días de una semana específica
export const generateWeekDays = (year, month, day) => {
  const selectedDate = new Date(year, month, day);
  const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 6 = sábado
  
  const weekDays = [];
  
  // Calcular el domingo de la semana
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
  
  // Generar los 7 días de la semana
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    
    weekDays.push({
      day: currentDay.getDate(),
      month: currentDay.getMonth() === month ? 'current' : 'other',
      date: currentDay,
      isToday: currentDay.toDateString() === today.toDateString()
    });
  }
  
  return weekDays;
};

// Función para obtener la fecha formateada para el día seleccionado
export const getSelectedDayDate = (year, month, day) => {
  return new Date(year, month, day);
};