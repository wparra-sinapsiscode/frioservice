import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
// import MainLayout from './components/layout/MainLayout'; // No es necesario importarlo aquí si ProtectedRoute lo maneja

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceCalendar from './pages/ServiceCalendar';
import Quotes from './pages/Quotes';
import Technicians from './pages/Technicians';
import Clients from './pages/Clients';
import Statistics from './pages/Statistics';
import TechnicianDashboard from './pages/TechnicianDashboard';
import MyServices from './pages/MyServices';
import MyEvaluations from './pages/MyEvaluations';
import WorkHistory from './pages/WorkHistory';
import ClientDashboard from './pages/ClientDashboard';
import MyQuotes from './pages/MyQuotes';
import RequestService from './pages/RequestService';
import MyEquipment from './pages/MyEquipment';

function App() {
  const { user, loading } = useAuth();

  // Mapa para redirigir a los usuarios que ya están logueados
  // Asegúrate de que las claves aquí (admin, tecnico, cliente) coincidan con los valores en minúsculas de user.role
  const roleRedirects = {
    admin: '/',
    technician: '/tecnico', // <-- Cambia 'tecnico' por 'technician'
    cliente: '/cliente'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta pública para Login: si el usuario ya existe, lo redirige a su dashboard */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            // --- CAMBIO CLAVE AQUÍ ---
            <Navigate to={roleRedirects[user.role?.toLowerCase()] || '/'} replace />
          )
        }
      />

      {/* --- RUTAS PROTEGIDAS Y CORRECTAMENTE ESTRUCTURADAS --- */}

      {/* Rutas para Administrador */}
      <Route path="/" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route index element={<Dashboard />} />
        <Route path="servicios" element={<Services />} />
        <Route path="calendario-servicios" element={<ServiceCalendar />} />
        <Route path="cotizaciones" element={<Quotes />} />
        <Route path="tecnicos" element={<Technicians />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="estadisticas" element={<Statistics />} />
      </Route>

      {/* Rutas para Técnico */}
      <Route path="/tecnico" element={<ProtectedRoute allowedRoles={['technician']} />}>
        <Route index element={<TechnicianDashboard />} />
        <Route path="mis-servicios" element={<MyServices />} />
        <Route path="mis-evaluaciones" element={<MyEvaluations />} />
        <Route path="historial-trabajos" element={<WorkHistory />} />
      </Route>

      {/* Rutas para Cliente */}
      <Route path="/cliente" element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route index element={<ClientDashboard />} />
        <Route path="mis-cotizaciones" element={<MyQuotes />} />
        <Route path="solicitar-servicio" element={<RequestService />} />
        <Route path="mis-equipos" element={<MyEquipment />} />
      </Route>

      {/* Ruta para cualquier otra URL no encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;