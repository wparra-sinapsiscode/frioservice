import React from 'react';

const ServicesList = ({ title, services, viewAllLink }) => {
  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'ON_HOLD':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el texto del estado en español
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'ON_HOLD':
        return 'En Espera';
      default:
        return status;
    }
  };

  // Función para obtener el color de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'border-l-red-500';
      case 'HIGH':
        return 'border-l-red-400';
      case 'MEDIUM':
        return 'border-l-orange-500';
      case 'LOW':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium m-0">{title}</h3>
        {viewAllLink && (
          <a 
            href={viewAllLink} 
            className="text-sm text-primary hover:underline"
          >
            Ver todos
          </a>
        )}
      </div>
      
      <ul className="list-none p-0 m-0">
        {services.map((service, index) => (
          <li 
            key={index} 
            className={`py-3 border-l-4 pl-4 mb-2 rounded-r ${getPriorityColor(service.priority)} ${
              index < services.length - 1 ? 'border-b border-gray-light pb-4' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium m-0 leading-tight">{service.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(service.status)}`}>
                    {getStatusText(service.status)}
                  </span>
                </div>
                <p className="text-sm text-gray m-0 break-words">{service.details}</p>
              </div>
              <div className="text-sm bg-secondary px-2 py-1 rounded whitespace-nowrap ml-2">
                {service.time}
              </div>
            </div>
          </li>
        ))}
        
        {services.length === 0 && (
          <li className="py-4 text-center text-gray">
            No hay servicios próximos
          </li>
        )}
      </ul>
    </div>
  );
};

export default ServicesList;