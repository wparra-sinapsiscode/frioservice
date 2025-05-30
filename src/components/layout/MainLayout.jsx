import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useMediaQuery } from 'react-responsive';

const MainLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [collapsed, setCollapsed] = useState(isMobile);
  const location = useLocation();
  
  // Colapsar automáticamente en dispositivos móviles
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Actualiza el título de la página basado en la ruta actual
  useEffect(() => {
    const path = location.pathname;
    let title = 'FríoService - Sistema de Gestión';
    
    // Determinar título según la ruta
    if (path === '/' || path === '/tecnico' || path === '/cliente') {
      title = 'Dashboard | FríoService';
    } else if (path.includes('cotizaciones')) {
      title = 'Cotizaciones | FríoService';
    } else if (path.includes('servicios')) {
      title = 'Servicios | FríoService';
    } else if (path.includes('tecnicos')) {
      title = 'Técnicos | FríoService';
    } else if (path.includes('clientes')) {
      title = 'Clientes | FríoService';
    } else if (path.includes('estadisticas')) {
      title = 'Estadísticas | FríoService';
    } else if (path.includes('calendario')) {
      title = 'Calendario | FríoService';
    } else if (path.includes('mis-servicios')) {
      title = 'Mis Servicios | FríoService';
    } else if (path.includes('mis-evaluaciones')) {
      title = 'Mis Evaluaciones | FríoService';
    } else if (path.includes('historial')) {
      title = 'Historial | FríoService';
    } else if (path.includes('mis-cotizaciones')) {
      title = 'Mis Cotizaciones | FríoService';
    } else if (path.includes('solicitar-servicio')) {
      title = 'Solicitar Servicio | FríoService';
    } else if (path.includes('mis-equipos')) {
      title = 'Mis Equipos | FríoService';
    }
    
    document.title = title;
  }, [location]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      
      <div 
        className={`transition-all duration-300 ${
          collapsed 
            ? 'ml-0 sm:ml-[70px]' 
            : 'ml-0 sm:ml-[260px]'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} collapsed={collapsed} />
        
        <main className="pt-[90px] min-h-screen p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;