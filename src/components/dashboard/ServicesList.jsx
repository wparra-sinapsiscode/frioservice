import React from 'react';

const ServicesList = ({ title, services, viewAllLink }) => {
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
            className={`py-3 flex items-center justify-between ${
              index < services.length - 1 ? 'border-b border-gray-light' : ''
            }`}
          >
            <div className="flex flex-col">
              <p className="font-medium m-0 leading-tight">{service.title}</p>
              <p className="text-sm text-gray m-0">{service.details}</p>
            </div>
            <div className="text-sm bg-secondary px-2 py-1 rounded whitespace-nowrap">
              {service.time}
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