import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaTools,
  FaUserCog,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaSearch,
  FaHistory,
  FaBell,
  FaSnowflake,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ collapsed }) => {
  const { user, logout } = useAuth();

  // Determinar el tipo de menú según el rol del usuario
  const getMenuItems = () => {
    // CORRECCIÓN: Se comprueba "user.role" en lugar de "user.userType"
    switch (user?.role?.toLowerCase()) {
      case 'admin':
        return adminMenuItems;
      case 'technician':
        return technicianMenuItems;
      case 'client':
        return clientMenuItems;
      default:
        return [];
    }
  };

  // Elementos del menú para administrador
  const adminMenuItems = [
    { to: '/', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/cotizaciones', icon: <FaFileInvoiceDollar />, text: 'Cotizaciones' },
    { to: '/servicios', icon: <FaTools />, text: 'Servicios' },
    { to: '/tecnicos', icon: <FaUserCog />, text: 'Técnicos' },
    { to: '/clientes', icon: <FaUsers />, text: 'Clientes' },
    { to: '/estadisticas', icon: <FaChartLine />, text: 'Estadísticas' },
  ];

  // Elementos del menú para técnico
  const technicianMenuItems = [
    { to: '/tecnico', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/tecnico/mis-servicios', icon: <FaClipboardList />, text: 'Mis Servicios' },
    { to: '/tecnico/mis-evaluaciones', icon: <FaSearch />, text: 'Mis Evaluaciones' },
    { to: '/tecnico/historial-trabajos', icon: <FaHistory />, text: 'Historial' },
  ];

  // Elementos del menú para cliente
  const clientMenuItems = [
    { to: '/cliente', icon: <FaTachometerAlt />, text: 'Dashboard' },
    { to: '/cliente/mis-cotizaciones', icon: <FaFileInvoiceDollar />, text: 'Mis Cotizaciones' },
    { to: '/cliente/solicitar-servicio', icon: <FaBell />, text: 'Solicitar Servicio' },
    { to: '/cliente/mis-equipos', icon: <FaSnowflake />, text: 'Mis Equipos' },
  ];

  const handleLogout = () => {
    logout();
  };

  const menuItems = getMenuItems();

  return (
    <nav className={`fixed top-0 left-0 h-screen bg-white shadow-md z-30 transition-all duration-300 overflow-y-auto ${collapsed ? 'w-[70px]' : 'w-[260px]'}`}>
      {/* Logo y Header */}
      <div className="flex items-center p-5 bg-gray-900 h-[70px]">
        {/* Ícono blanco, se ve bien */}
        <FaSnowflake className="w-8 h-8 text-white" />

        {/* AÑADIMOS "text-white" aquí para que el texto sea blanco brillante */}
        {!collapsed && (
          <h2 className="ml-3 text-xl font-semibold whitespace-nowrap text-white">
            FríoService
          </h2>
        )}
      </div>

      {/* Información del Usuario */}
      <div className="flex items-center p-4 border-b border-gray-light">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0D8ABC&color=fff&rounded=true`}
          alt="Usuario"
          className="w-10 h-10 rounded-full"
        />
        {!collapsed && (
          <div className="ml-3">
            <h3 className="text-sm font-semibold leading-tight">{user?.username}</h3>
            <p className="text-xs text-gray capitalize">
              {/* CORRECCIÓN: Se muestra "user.role" */}
              {user?.role}
            </p>
          </div>
        )}
      </div>

      {/* Menú de Navegación */}
      <ul className="list-none p-0 m-0">
        {menuItems.map((item, index) => (
          <li key={index} className="relative">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center py-3.5 px-5 text-gray-dark transition-colors duration-300 hover:bg-secondary hover:text-primary
                 ${isActive ? 'bg-primary text-white font-medium' : ''}`
              }
              end={item.to === '/' || item.to === '/tecnico' || item.to === '/cliente'}
            >
              <span className="text-lg min-w-[22px] text-center">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.text}</span>}
            </NavLink>
          </li>
        ))}

        {/* Opción de Cerrar Sesión */}
        <li className="mt-8 border-t border-gray-200/50 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-4 px-6 text-gray-700 transition-all duration-300 hover:bg-red-50 hover:text-red-600 text-left rounded-lg mx-2"
          >
            <span className="min-w-[24px] flex justify-center">
              <FaSignOutAlt className="w-5 h-5" />
            </span>
            {!collapsed && <span className="ml-4 font-medium">Cerrar Sesión</span>}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;