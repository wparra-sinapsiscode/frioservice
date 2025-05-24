// Datos simulados para cotizaciones

export const quotesData = [
  {
    id: 'COT-2025-042',
    client: 'Norte Supermercados',
    type: 'Programado',
    amount: 'S/ 3,500',
    status: 'aprobada',
    date: '15/05/2025',
    technician: 'Juan Pérez',
    description: 'Cotización para mantenimiento preventivo trimestral de sistema de refrigeración central y cámaras frigoríficas.',
    equipment: ['Sistema Central de Refrigeración', 'Cámaras Frigoríficas (2)'],
  },
  {
    id: 'COT-2025-041',
    client: 'Buena Mesa Restaurante',
    type: 'Correctivo',
    amount: 'S/ 1,200',
    status: 'pendiente',
    date: '14/05/2025',
    technician: 'María López',
    description: 'Cotización para reparación de congelador horizontal con problemas en el sistema de refrigeración.',
    equipment: ['Congelador Horizontal CH-200'],
  },
  {
    id: 'COT-2025-040',
    client: 'Hospital San Juan',
    type: 'Programado',
    amount: 'S/ 5,800',
    status: 'pendiente',
    date: '13/05/2025',
    technician: 'Carlos González',
    description: 'Cotización para instalación de nueva cámara frigorífica para almacenamiento de medicamentos.',
    equipment: ['Cámara Frigorífica CF-100'],
  },
  {
    id: 'COT-2025-039',
    client: 'Ricardo Sánchez',
    type: 'Correctivo',
    amount: 'S/ 850',
    status: 'rechazada',
    date: '12/05/2025',
    technician: 'Ana Martínez',
    description: 'Cotización para reparación de frigobar con problemas de enfriamiento y ruido excesivo.',
    equipment: ['Frigobar Modelo FB-50'],
  },
  {
    id: 'COT-2025-038',
    client: 'Hotel Las Palmas',
    type: 'Programado',
    amount: 'S/ 2,300',
    status: 'aprobada',
    date: '10/05/2025',
    technician: 'Juan Pérez',
    description: 'Cotización para mantenimiento anual del sistema de refrigeración del área de cocina y restaurante.',
    equipment: ['Refrigeradores Industriales (2)', 'Congelador Vertical CV-300'],
  },
  {
    id: 'COT-2025-037',
    client: 'Norte Supermercados',
    type: 'Correctivo',
    amount: 'S/ 1,800',
    status: 'aprobada',
    date: '08/05/2025',
    technician: 'María López',
    description: 'Cotización para reparación urgente de sistema de refrigeración en área de lácteos.',
    equipment: ['Vitrinas Refrigeradas (3)'],
  },
  {
    id: 'COT-2025-036',
    client: 'Buena Mesa Restaurante',
    type: 'Programado',
    amount: 'S/ 1,500',
    status: 'pendiente',
    date: '07/05/2025',
    technician: 'Carlos González',
    description: 'Cotización para mantenimiento semestral de equipos de refrigeración y congelación.',
    equipment: ['Refrigerador Industrial', 'Congelador Vertical', 'Congelador Horizontal'],
  },
];

// Filtro de cotizaciones
export const filterQuotes = (quotes, filters) => {
  return quotes.filter(quote => {
    // Filtrar por estado
    if (filters.status !== 'todos' && quote.status !== filters.status) {
      return false;
    }
    
    // Filtrar por cliente
    if (filters.client !== 'todos' && !quote.client.toLowerCase().includes(filters.client.toLowerCase())) {
      return false;
    }
    
    // Filtrar por tipo
    if (filters.type !== 'todos' && quote.type.toLowerCase() !== filters.type) {
      return false;
    }
    
    // Filtrar por fecha
    if (filters.startDate && filters.endDate) {
      const quoteDate = new Date(quote.date.split('/').reverse().join('-'));
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      if (quoteDate < startDate || quoteDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
};