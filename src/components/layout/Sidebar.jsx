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
  FaSignOutAlt,
  FaHome,
  FaCog,
  FaUser
} from 'react-icons/fa';
import { 
  HiOutlineChartBarSquare,
  HiOutlineDocumentDuplicate,
  HiOutlineWrenchScrewdriver,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineChartPie,
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineCommandLine
} from 'react-icons/hi2';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  // Determinar el tipo de menú según el usuario
  const getMenuItems = () => {
    switch (user?.userType) {
      case 'admin':
        return adminMenuItems;
      case 'tecnico':
        return technicianMenuItems;
      case 'cliente':
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
      <div className="flex items-center p-5 bg-primary text-white h-[70px]">
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc3Y2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjMgMTlhMiAyIDAgMCAxLTIgMkgzYTIgMiAwIDAgMS0yLTJWOGEyIDIgMCAwIDEgMi0yaDRsMi0zaDZsMiAzaDRhMiAyIDAgMCAxIDIgMnoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEzIiByPSI0Ii8+PC9zdmc+" 
          alt="Logo" 
          className="w-9 h-9 rounded-full" 
        />
        {!collapsed && <h2 className="ml-3 text-xl font-semibold whitespace-nowrap">FríoService</h2>}
      </div>
      
      {/* Información del Usuario */}
      <div className="flex items-center p-4 border-b border-gray-light">
        <img 
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc3Y2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgLz48L3N2Zz4=" 
          alt="Usuario" 
          className="w-10 h-10 rounded-full"
        />
        {!collapsed && (
          <div className="ml-3">
            <h3 className="text-sm font-semibold leading-tight">{user?.username}</h3>
            <p className="text-xs text-gray">
              {user?.userType === 'admin' ? 'Administrador' : 
               user?.userType === 'tecnico' ? 'Técnico' : 'Cliente'}
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