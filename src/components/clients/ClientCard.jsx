import React from 'react';
import { FaUser, FaPhone, FaEnvelope, FaBuilding, FaMapMarkerAlt, FaToolbox, FaCalendarAlt } from 'react-icons/fa';
import { getClientDisplayName, getClientTypeLabel, getClientContactName } from '../../utils/clientUtils';

const ClientCard = ({ client }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-primary p-4 text-white">
        <h3 className="font-bold text-lg">{getClientDisplayName(client)}</h3>
        <div className="flex items-center text-sm opacity-90 mt-1">
          <FaBuilding className="mr-2" />
          <span>{getClientTypeLabel(client)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 text-sm">
          {/* Ubicación */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray mr-3 min-w-[16px]" />
            <span>{client.city}</span>
          </div>
          
          {/* Contacto */}
          <div className="flex items-center">
            <FaUser className="text-gray mr-3 min-w-[16px]" />
            <span>{getClientContactName(client)}</span>
          </div>
          
          {/* Teléfono */}
          <div className="flex items-center">
            <FaPhone className="text-gray mr-3 min-w-[16px]" />
            <span>{client.phone}</span>
          </div>
          
          {/* Email */}
          <div className="flex items-center">
            <FaEnvelope className="text-gray mr-3 min-w-[16px]" />
            <span className="truncate">{client.email}</span>
          </div>
          
          {/* Servicios */}
          <div className="flex items-center">
            <FaToolbox className="text-gray mr-3 min-w-[16px]" />
            <span>{client.services} servicios</span>
          </div>
          
          {/* Próximo servicio */}
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray mr-3 min-w-[16px]" />
            <span>Próximo: {client.nextService}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
          <button className="btn btn-secondary btn-sm">Ver Equipos</button>
          <button className="btn btn-primary btn-sm">Detalles</button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;