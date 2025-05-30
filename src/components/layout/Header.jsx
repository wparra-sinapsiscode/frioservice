import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { FaBars, FaBell, FaEnvelope, FaSearch, FaUser } from 'react-icons/fa';
import { HiOutlineBell, HiOutlineEnvelope, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const Header = ({ toggleSidebar, collapsed }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <header className={`header ${
      collapsed ? 'ml-0 sm:ml-[70px]' : 'ml-0 sm:ml-[260px]'
    }`}>
      <button 
        onClick={toggleSidebar} 
        className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer transition-all duration-300 mr-4"
        aria-label="Toggle sidebar"
      >
        <FaBars className="w-5 h-5" />
      </button>
      
      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <div className="relative w-full">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar servicios, clientes, técnicos..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:outline-none transition-all duration-300 text-sm placeholder-gray-500"
          />
        </div>
      </div>
      
      {/* Se han eliminado los tres botones de la esquina superior derecha */}
      <div className="ml-auto"></div>
    </header>
  );
};

export default Header;