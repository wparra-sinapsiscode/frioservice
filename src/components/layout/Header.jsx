import React from 'react';
import { FaBars, FaBell, FaEnvelope, FaSearch, FaUser } from 'react-icons/fa';
import { HiOutlineBell, HiOutlineEnvelope, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const Header = ({ toggleSidebar, collapsed }) => {
  return (
    <header className={`header ${
      collapsed ? 'ml-[70px]' : 'ml-[260px]'
    }`}>
      <button 
        onClick={toggleSidebar} 
        className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer transition-all duration-300 mr-4"
        aria-label="Toggle sidebar"
      >
        <FaBars className="w-5 h-5" />
      </button>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar servicios, clientes, técnicos..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500/20 focus:outline-none transition-all duration-300 text-sm placeholder-gray-500"
          />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer transition-all duration-300 relative">
            <HiOutlineBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full font-semibold animate-pulse">3</span>
          </button>
        </div>
        
        {/* Messages */}
        <div className="relative">
          <button className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer transition-all duration-300 relative">
            <HiOutlineEnvelope className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full font-semibold">5</span>
          </button>
        </div>
        
        {/* Profile */}
        <div className="relative">
          <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md">
              <FaUser className="text-white text-sm" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;