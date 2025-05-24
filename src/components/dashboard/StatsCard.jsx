import React from 'react';
import { 
  FaClipboardList, 
  FaCheckCircle, 
  FaFileInvoiceDollar, 
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown 
} from 'react-icons/fa';
import { 
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiArrowTrendingUp,
  HiArrowTrendingDown
} from 'react-icons/hi2';

// Mapeo de iconos por tipo
const iconMap = {
  pending: <HiOutlineClipboardDocumentList className="w-7 h-7 text-white" />,
  completed: <HiOutlineCheckCircle className="w-7 h-7 text-white" />,
  quotes: <HiOutlineDocumentText className="w-7 h-7 text-white" />,
  income: <HiOutlineCurrencyDollar className="w-7 h-7 text-white" />,
};

// Mapeo de colores de fondo gradientes para los iconos
const bgGradientMap = {
  pending: 'bg-gradient-accent',
  completed: 'bg-gradient-success',
  quotes: 'bg-gradient-warning',
  income: 'bg-gradient-info',
};

const StatsCard = ({ title, value, type, trend }) => {
  return (
    <div className="card-stats group animate-fade-in">
      <div className={`card-icon ${bgGradientMap[type] || 'bg-gradient-accent'} group-hover:shadow-lg`}>
        {iconMap[type] || <HiOutlineClipboardDocumentList className="w-7 h-7 text-white" />}
      </div>
      
      <div className="card-content">
        <h3 className="card-subtitle">{title}</h3>
        <p className="card-value">{value}</p>
        
        {trend && (
          <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${
            trend.positive ? 'text-success-600' : 'text-danger-600'
          }`}>
            {trend.positive ? (
              <HiArrowTrendingUp className="w-4 h-4" />
            ) : (
              <HiArrowTrendingDown className="w-4 h-4" />
            )}
            <span>{trend.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;