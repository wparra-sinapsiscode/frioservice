import React, { useState } from 'react';

const StatusToggle = ({ 
  isActive, 
  onToggle, 
  disabled = false,
  size = 'sm' // sm, md, lg
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onToggle(!isActive);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-11 h-6',
    md: 'w-14 h-7', 
    lg: 'w-16 h-8'
  };

  const ballSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: isActive ? 'translate-x-5' : 'translate-x-1',
    md: isActive ? 'translate-x-7' : 'translate-x-1',
    lg: isActive ? 'translate-x-8' : 'translate-x-1'
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled || isLoading}
      className={`
        relative inline-flex items-center
        ${sizeClasses[size]}
        rounded-full transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isActive 
          ? 'bg-green-500 focus:ring-green-500' 
          : 'bg-red-500 focus:ring-red-500'
        }
        ${disabled || isLoading 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-lg cursor-pointer'
        }
      `}
      title={`Cambiar a ${isActive ? 'Inactivo' : 'Activo'}`}
    >
      {/* Bolita deslizante */}
      <span
        className={`
          ${ballSizes[size]}
          bg-white rounded-full shadow-md
          transform transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${translateClasses[size]}
        `}
      >
        {/* Spinner de carga */}
        {isLoading && (
          <svg 
            className="animate-spin w-3 h-3 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="opacity-25"
            />
            <path 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            />
          </svg>
        )}
      </span>
      
      {/* Texto interno para accessibility */}
      <span className="sr-only">
        {isActive ? 'Activo' : 'Inactivo'}
      </span>
    </button>
  );
};

export default StatusToggle;