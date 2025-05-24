import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/layout/MainLayout';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      {/* Rutas protegidas para Administrador */}
      <Route path="/" element={user && user.userType === 'admin' ? <MainLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="cotizaciones" element={<Quotes />} />
        <Route path="servicios" element={<Services />} />
        <Route path="calendario-servicios" element={<ServiceCalendar />} />
        <Route path="tecnicos" element={<Technicians />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="estadisticas" element={<Statistics />} />
      </Route>
      
      {/* Rutas protegidas para Técnico */}
      <Route path="/tecnico" element={user && user.userType === 'tecnico' ? <MainLayout /> : <Navigate to="/login" />}>
        <Route index element={<TechnicianDashboard />} />
        <Route path="mis-servicios" element={<MyServices />} />
        <Route path="mis-evaluaciones" element={<MyEvaluations />} />
        <Route path="historial-trabajos" element={<WorkHistory />} />
      </Route>
      
      {/* Rutas protegidas para Cliente */}
      <Route path="/cliente" element={user && user.userType === 'cliente' ? <MainLayout /> : <Navigate to="/login" />}>
        <Route index element={<ClientDashboard />} />
        <Route path="mis-cotizaciones" element={<MyQuotes />} />
        <Route path="solicitar-servicio" element={<RequestService />} />
        <Route path="mis-equipos" element={<MyEquipment />} />
      </Route>
      
      {/* Ruta para cualquier otra URL */}
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
    </Routes>
  );
}

export default App;