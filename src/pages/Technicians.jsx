import React, { useState } from 'react';
import { FaPlus, FaUsers, FaCheckCircle, FaClock } from 'react-icons/fa';
import TechnicianCard from '../components/technicians/TechnicianCard';
import TechnicianModal from '../components/technicians/TechnicianModal';
import StatsCard from '../components/dashboard/StatsCard';
import { technicianData } from '../utils/mockData';

const Technicians = () => {
  const [technicians, setTechnicians] = useState(technicianData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [viewingTechnician, setViewingTechnician] = useState(null);

  const handleNewTechnician = () => {
    setEditingTechnician(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTechnician(null);
  };

  const handleSaveTechnician = (technicianData) => {
    if (editingTechnician) {
      setTechnicians(technicians.map(tech => 
        tech.id === editingTechnician.id ? { ...technicianData, id: editingTechnician.id } : tech
      ));
    } else {
      setTechnicians([...technicians, { ...technicianData, id: Date.now() }]);
    }
  };

  const handleViewTechnician = (technician) => {
    setViewingTechnician(technician);
  };

  const handleEditTechnician = (technician) => {
    setEditingTechnician(technician);
    setIsModalOpen(true);
  };

  const handleDeleteTechnician = (technician) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${technician.name}?`)) {
      setTechnicians(technicians.filter(tech => tech.id !== technician.id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Técnicos</h2>
        </div>
        <div className="flex gap-3">
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleNewTechnician}
          >
            <FaPlus /> Nuevo Técnico
          </button>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatsCard 
          title="Total Técnicos" 
          value={technicians.length.toString()} 
          type="pending" 
          icon={<FaUsers className="text-2xl text-white" />}
        />
        <StatsCard 
          title="Servicios Completados" 
          value="124" 
          type="completed" 
          icon={<FaCheckCircle className="text-2xl text-white" />}
        />
        <StatsCard 
          title="Tiempo Promedio" 
          value="2.5h" 
          type="quotes" 
          icon={<FaClock className="text-2xl text-white" />}
        />
      </div>
      
      {/* Técnicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {technicians.map((technician, index) => (
          <TechnicianCard 
            key={technician.id || index} 
            technician={technician}
            onView={handleViewTechnician}
            onEdit={handleEditTechnician}
            onDelete={handleDeleteTechnician}
          />
        ))}
        
        {technicians.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray">
            No hay técnicos registrados
          </div>
        )}
      </div>

      {/* Modal para nuevo/editar técnico */}
      <TechnicianModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTechnician}
        technician={editingTechnician}
      />

      {/* Modal para ver técnico */}
      {viewingTechnician && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalles del Técnico</h3>
              <button 
                onClick={() => setViewingTechnician(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <img 
                  src={viewingTechnician.avatar} 
                  alt={viewingTechnician.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="font-semibold text-lg">{viewingTechnician.name}</h4>
                <p className="text-gray-600">{viewingTechnician.specialty}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center border-t pt-3">
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.servicesCompleted}</p>
                  <p className="text-sm text-gray-600">Servicios</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.averageTime}</p>
                  <p className="text-sm text-gray-600">Tiempo Prom.</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.rating}</p>
                  <p className="text-sm text-gray-600">Calificación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Technicians;