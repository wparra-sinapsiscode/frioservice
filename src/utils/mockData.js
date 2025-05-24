// Datos simulados para el Dashboard

// Datos de estadísticas
export const statsData = {
  pendingServices: {
    title: 'Servicios Pendientes',
    value: '12',
    type: 'pending',
  },
  completedServices: {
    title: 'Servicios Completados',
    value: '68',
    type: 'completed',
  },
  quotes: {
    title: 'Cotizaciones',
    value: '24',
    type: 'quotes',
  },
  monthlyIncome: {
    title: 'Ingresos del Mes',
    value: 'S/ 24,500',
    type: 'income',
  },
};

// Datos de servicios por mes (para el gráfico)
export const servicesChartData = {
  day: {
    labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    datasets: [
      {
        label: 'Servicios Programados',
        data: [1, 2, 3, 2, 1, 3, 4, 2, 3, 1],
        borderColor: '#17a2b8',
        backgroundColor: 'rgba(23, 162, 184, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Servicios Correctivos',
        data: [2, 1, 0, 2, 3, 1, 2, 3, 1, 2],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.3,
      },
    ],
  },
  month: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Servicios Programados',
        data: [12, 15, 18, 14, 16, 19, 22, 25, 20, 18, 16, 14],
        borderColor: '#17a2b8',
        backgroundColor: 'rgba(23, 162, 184, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Servicios Correctivos',
        data: [8, 10, 6, 5, 7, 8, 6, 9, 10, 12, 8, 7],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.3,
      },
    ],
  },
  year: {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Servicios Programados',
        data: [95, 120, 150, 180, 210, 190],
        borderColor: '#17a2b8',
        backgroundColor: 'rgba(23, 162, 184, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Servicios Correctivos',
        data: [60, 75, 90, 100, 95, 85],
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.3,
      },
    ],
  },
};

// Datos de servicios próximos
export const upcomingServices = [
  {
    title: 'Mantenimiento Preventivo',
    details: 'Refrigeradora Industrial - Norte Supermercados',
    time: 'Hoy, 14:30',
  },
  {
    title: 'Inspección Congelador',
    details: 'Buena Mesa Restaurantes',
    time: 'Mañana, 10:00',
  },
  {
    title: 'Reparación Cámara Frigorífica',
    details: 'Hospital San Juan',
    time: '22/05, 09:00',
  },
  {
    title: 'Mantenimiento Preventivo',
    details: 'Frigobar - Hotel Las Palmas',
    time: '24/05, 15:00',
  },
];

// Datos de cotizaciones recientes
export const recentQuotes = [
  {
    id: 'COT-2025-042',
    client: 'Norte Supermercados',
    type: 'Programado',
    amount: 'S/ 3,500',
    status: 'aprobada',
    date: '15/05/2025',
  },
  {
    id: 'COT-2025-041',
    client: 'Buena Mesa Restaurante',
    type: 'Correctivo',
    amount: 'S/ 1,200',
    status: 'pendiente',
    date: '14/05/2025',
  },
  {
    id: 'COT-2025-040',
    client: 'Hospital San Juan',
    type: 'Programado',
    amount: 'S/ 5,800',
    status: 'pendiente',
    date: '13/05/2025',
  },
  {
    id: 'COT-2025-039',
    client: 'Ricardo Sánchez',
    type: 'Correctivo',
    amount: 'S/ 850',
    status: 'rechazada',
    date: '12/05/2025',
  },
  {
    id: 'COT-2025-038',
    client: 'Hotel Las Palmas',
    type: 'Programado',
    amount: 'S/ 2,300',
    status: 'aprobada',
    date: '10/05/2025',
  },
];

// Datos de técnicos
export const technicianData = [
  {
    id: 1,
    name: 'Juan Pérez',
    username: 'jperez',
    specialty: 'Refrigeración',
    servicesCompleted: 45,
    averageTime: '2.3h',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '945678123',
    email: 'jperez@frioservice.com',
    experience: 5,
  },
  {
    id: 2,
    name: 'María López',
    username: 'mlopez',
    specialty: 'Congelación',
    servicesCompleted: 38,
    averageTime: '2.1h',
    rating: 4.7,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    phone: '932456789',
    email: 'mlopez@frioservice.com',
    experience: 4,
  },
  {
    id: 3,
    name: 'Carlos González',
    username: 'cgonzalez',
    specialty: 'Cámaras frigoríficas',
    servicesCompleted: 52,
    averageTime: '3.5h',
    rating: 4.5,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    phone: '956781234',
    email: 'cgonzalez@frioservice.com',
    experience: 7,
  },
  {
    id: 4,
    name: 'Ana Martínez',
    username: 'amartinez',
    specialty: 'General',
    servicesCompleted: 35,
    averageTime: '2.5h',
    rating: 4.6,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    phone: '923567891',
    email: 'amartinez@frioservice.com',
    experience: 3,
  },
];

// Datos de clientes
export const clientData = [
  {
    id: 1,
    name: 'Norte Supermercados',
    username: 'norte',
    type: 'empresa',
    city: 'Lima',
    services: 18,
    nextService: '22/05/2025',
    contact: 'Luis García',
    phone: '945678123',
    email: 'contacto@norte.com',
    status: 'activo',
  },
  {
    id: 2,
    name: 'Buena Mesa Restaurante',
    username: 'buenamesarestaurante',
    type: 'empresa',
    city: 'Arequipa',
    services: 12,
    nextService: '18/05/2025',
    contact: 'Rosa Mendoza',
    phone: '932456789',
    email: 'info@buenamesa.com',
    status: 'activo',
  },
  {
    id: 3,
    name: 'Ricardo Sánchez',
    username: 'rsanchez',
    type: 'personal',
    city: 'Lima',
    services: 4,
    nextService: '-',
    contact: 'Ricardo Sánchez',
    phone: '956781234',
    email: 'rsanchez@gmail.com',
    status: 'inactivo',
  },
  {
    id: 4,
    name: 'Hospital San Juan',
    username: 'hospitalsanjuan',
    type: 'empresa',
    city: 'Trujillo',
    services: 22,
    nextService: '20/05/2025',
    contact: 'María Fernández',
    phone: '923567891',
    email: 'administracion@hospitalsanjuan.com',
    status: 'activo',
  },
];