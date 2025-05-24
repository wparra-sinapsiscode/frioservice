// Datos simulados para la página de Estadísticas
export const statsCardData = {
  totalServices: {
    title: 'Total Servicios',
    value: '86',
    type: 'pending',
    trend: {
      positive: true, 
      icon: '↑',
      text: '12% vs. mes anterior'
    }
  },
  totalIncome: {
    title: 'Ingresos Totales',
    value: 'S/ 32,450',
    type: 'income',
    trend: {
      positive: true, 
      icon: '↑',
      text: '8% vs. mes anterior'
    }
  },
  newClients: {
    title: 'Nuevos Clientes',
    value: '14',
    type: 'quotes',
    trend: {
      positive: true, 
      icon: '↑',
      text: '27% vs. mes anterior'
    }
  },
  satisfaction: {
    title: 'Satisfacción',
    value: '4.8/5',
    type: 'completed',
    trend: {
      positive: true, 
      icon: '↑',
      text: '0.2 vs. mes anterior'
    }
  },
};

// Datos para el gráfico de servicios por tipo
export const servicesByTypeData = {
  labels: ['Mantenimiento Preventivo', 'Reparación', 'Instalación', 'Consultoría'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: [
        '#17a2b8', 
        '#dc3545', 
        '#28a745', 
        '#ffc107'
      ],
      borderWidth: 1,
    }
  ]
};

// Datos para el gráfico de ingresos mensuales
export const monthlyIncomeData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Ingresos Mensuales (S/)',
      data: [15000, 18000, 22000, 20000, 25000, 28000, 32000, 30000, 28000, 32000, 30000, 35000],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40, 167, 69, 0.2)',
      tension: 0.3,
      fill: true,
    }
  ]
};

// Datos para el gráfico de eficiencia de técnicos
export const technicianEfficiencyData = {
  labels: ['Juan Pérez', 'María López', 'Carlos González', 'Ana Martínez', 'Roberto Sánchez'],
  datasets: [
    {
      label: 'Tiempo promedio (horas)',
      data: [2.3, 2.1, 3.5, 2.5, 2.8],
      backgroundColor: '#17a2b8',
    }
  ]
};

// Datos para el gráfico de satisfacción de técnicos
export const technicianSatisfactionData = {
  labels: ['Juan Pérez', 'María López', 'Carlos González', 'Ana Martínez', 'Roberto Sánchez'],
  datasets: [
    {
      label: 'Calificación Promedio (1-5)',
      data: [4.8, 4.7, 4.5, 4.6, 4.4],
      backgroundColor: '#6f42c1',
    }
  ]
};

// Datos para el gráfico de servicios por técnico
export const servicesByTechnicianData = {
  labels: ['Juan Pérez', 'María López', 'Carlos González', 'Ana Martínez', 'Roberto Sánchez'],
  datasets: [
    {
      label: 'Servicios completados',
      data: [45, 38, 52, 35, 41],
      backgroundColor: '#fd7e14',
    }
  ]
};

// Datos para el gráfico de servicios por equipo
export const servicesByEquipmentData = {
  labels: ['Refrigeradoras', 'Congeladores', 'Cámaras frigoríficas', 'Frigobares', 'Otros'],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#007bff', 
        '#20c997', 
        '#6f42c1', 
        '#fd7e14', 
        '#6c757d'
      ],
      borderWidth: 1,
    }
  ]
};

// Datos para la tabla de técnicos destacados
export const topTechniciansData = [
  {
    name: 'Carlos González',
    services: 52,
    avgTime: '3.5h',
    satisfaction: '4.5/5',
    income: 'S/ 28,450'
  },
  {
    name: 'Juan Pérez',
    services: 45,
    avgTime: '2.3h',
    satisfaction: '4.8/5',
    income: 'S/ 22,800'
  },
  {
    name: 'Roberto Sánchez',
    services: 41,
    avgTime: '2.8h',
    satisfaction: '4.4/5',
    income: 'S/ 19,600'
  },
  {
    name: 'María López',
    services: 38,
    avgTime: '2.1h',
    satisfaction: '4.7/5',
    income: 'S/ 18,200'
  },
  {
    name: 'Ana Martínez',
    services: 35,
    avgTime: '2.5h',
    satisfaction: '4.6/5',
    income: 'S/ 16,800'
  }
];