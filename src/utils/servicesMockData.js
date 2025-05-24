// Datos simulados para servicios

export const servicesData = [
  {
    id: 'SRV-2025-035',
    title: 'Mantenimiento Preventivo Refrigerador',
    client: 'Norte Supermercados',
    type: 'Programado',
    equipment: ['Refrigerador Industrial Modelo FR-500'],
    technician: 'Juan Pérez',
    date: '21/05/2025',
    time: '14:30',
    status: 'pendiente',
    description: 'Mantenimiento preventivo programado de refrigerador industrial en área de carnes. Incluye limpieza de serpentines, revisión de compresor y niveles de gas refrigerante.',
  },
  {
    id: 'SRV-2025-034',
    title: 'Reparación Congelador',
    client: 'Buena Mesa Restaurante',
    type: 'Correctivo',
    equipment: ['Congelador Vertical CV-302'],
    technician: 'María López',
    date: '20/05/2025',
    time: '10:00',
    status: 'en-progreso',
    description: 'Reparación de congelador vertical que presenta problemas de temperatura. Cliente reporta que no mantiene la temperatura adecuada y hace ruido excesivo.',
  },
  {
    id: 'SRV-2025-033',
    title: 'Instalación Cámara Frigorífica',
    client: 'Hospital San Juan',
    type: 'Programado',
    equipment: ['Cámara Frigorífica CF-100'],
    technician: 'Carlos González',
    date: '22/05/2025',
    time: '09:00',
    status: 'pendiente',
    description: 'Instalación de nueva cámara frigorífica para almacenamiento de medicamentos. Incluye conexión eléctrica, calibración de temperatura y capacitación básica al personal.',
  },
  {
    id: 'SRV-2025-032',
    title: 'Revisión Frigobar',
    client: 'Ricardo Sánchez',
    type: 'Correctivo',
    equipment: ['Frigobar Modelo FB-50'],
    technician: 'Ana Martínez',
    date: '19/05/2025',
    time: '16:00',
    status: 'completado',
    description: 'Revisión de frigobar que no enfría correctamente. Se detectó fuga de gas refrigerante que fue reparada y recargada.',
  },
  {
    id: 'SRV-2025-031',
    title: 'Mantenimiento Sistema de Refrigeración',
    client: 'Norte Supermercados',
    type: 'Programado',
    equipment: ['Sistema Central', 'Cámaras Frigoríficas (2)'],
    technician: 'Juan Pérez',
    date: '18/05/2025',
    time: '09:30',
    status: 'completado',
    description: 'Mantenimiento trimestral del sistema central de refrigeración y cámaras frigoríficas. Incluye limpieza de equipos, revisión de parámetros y calibración de temperaturas.',
  },
  {
    id: 'SRV-2025-030',
    title: 'Reparación Urgente Congelador',
    client: 'Buena Mesa Restaurante',
    type: 'Correctivo',
    equipment: ['Congelador Horizontal CH-200'],
    technician: 'María López',
    date: '17/05/2025',
    time: '18:00',
    status: 'completado',
    description: 'Reparación urgente de congelador horizontal que dejó de funcionar. Se reemplazó el compresor y se verificó el funcionamiento correcto del equipo.',
  },
  {
    id: 'SRV-2025-029',
    title: 'Evaluación Técnica para Cotización',
    client: 'Hotel Las Palmas',
    type: 'Programado',
    equipment: ['Sistema de Climatización Central'],
    technician: 'Carlos González',
    date: '23/05/2025',
    time: '11:00',
    status: 'pendiente',
    description: 'Visita técnica para evaluación del sistema de climatización central del hotel. El cliente solicita cotización para mantenimiento preventivo anual.',
  },
];

// Filtro de servicios
export const filterServices = (services, filters) => {
  return services.filter(service => {
    // Filtrar por estado
    if (filters.status !== 'todos' && service.status !== filters.status) {
      return false;
    }
    
    // Filtrar por tipo
    if (filters.type !== 'todos' && service.type.toLowerCase() !== filters.type) {
      return false;
    }
    
    // Filtrar por técnico
    if (filters.technician !== 'todos' && !service.technician.toLowerCase().includes(filters.technician.toLowerCase())) {
      return false;
    }
    
    // Filtrar por cliente
    if (filters.client !== 'todos' && !service.client.toLowerCase().includes(filters.client.toLowerCase())) {
      return false;
    }
    
    // Filtrar por fecha
    if (filters.startDate && filters.endDate) {
      // Convertir el formato DD/MM/YYYY a objeto Date
      const [day, month, year] = service.date.split('/');
      const serviceDate = new Date(year, month - 1, day);
      
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      // Configurar las fechas para incluir todo el día
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      if (serviceDate < startDate || serviceDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};