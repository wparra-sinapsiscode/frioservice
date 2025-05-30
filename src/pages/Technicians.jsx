import React, { useState, useContext } from 'react';
import { FaPlus, FaUsers, FaCheckCircle, FaClock, FaSpinner } from 'react-icons/fa';
import TechnicianCard from '../components/technicians/TechnicianCard';
import TechnicianModal from '../components/technicians/TechnicianModal';
import StatsCard from '../components/dashboard/StatsCard';
import { AppContext } from '../context/AppContext';

const Technicians = () => {
  // =============== ACCESO AL CONTEXTO ===============
  const { 
    technicians, 
    isLoadingTechnicians, 
    errorTechnicians,
    addTechnician,
    updateTechnician,
    deleteTechnician,
    WorkspaceTechnicians
  } = useContext(AppContext);

  // =============== ESTADO LOCAL ===============
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

  const handleSaveTechnician = async (technicianData) => {
    console.log('🔥🔥🔥 2. PÁGINA: Datos recibidos del modal:', technicianData);
    try {
      if (editingTechnician) {
        // ACTUALIZAR TÉCNICO EXISTENTE
        console.log(">>> [TECHNICIANS PAGE] Actualizando técnico:", editingTechnician.id, technicianData);
        await updateTechnician(editingTechnician.id, technicianData);
        console.log("✅ [TECHNICIANS PAGE] Técnico actualizado exitosamente");
      } else {
        // CREAR NUEVO TÉCNICO
        console.log(">>> [TECHNICIANS PAGE] Creando nuevo técnico:", technicianData);
        await addTechnician(technicianData);
        console.log("✅ [TECHNICIANS PAGE] Técnico creado exitosamente");
      }
      handleCloseModal();
    } catch (error) {
      console.error("### [TECHNICIANS PAGE] Error al guardar técnico:", error);
      alert(`Error al guardar técnico: ${error.message}`);
    }
  };

  const handleViewTechnician = (technician) => {
    setViewingTechnician(technician);
  };

  const handleEditTechnician = (technician) => {
    setEditingTechnician(technician);
    setIsModalOpen(true);
  };

  const handleDeleteTechnician = async (technician) => {
    // Determinar el nombre para mostrar en el confirm
    const technicianName = technician.user?.username || technician.name || 'este técnico';
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${technicianName}?\n\nEsta acción eliminará:\n- El perfil del técnico\n- Su usuario asociado\n- NO se puede deshacer`)) {
      try {
        console.log(">>> [TECHNICIANS PAGE] Eliminando técnico:", technician.id);
        await deleteTechnician(technician.id);
        console.log("✅ [TECHNICIANS PAGE] Técnico eliminado exitosamente");
      } catch (error) {
        console.error("### [TECHNICIANS PAGE] Error al eliminar técnico:", error);
        alert(`Error al eliminar técnico: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0">Gestión de Técnicos</h2>
        </div>
        <div className="flex gap-3 relative z-30">
          <button 
            className="btn btn-primary flex items-center gap-2 relative z-30"
            onClick={handleNewTechnician}
            style={{ zIndex: 30 }}
          >
            <FaPlus /> Nuevo Técnico
          </button>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <StatsCard 
          title="Total Técnicos" 
          value={isLoadingTechnicians ? "..." : technicians.length.toString()} 
          type="pending" 
          icon={<FaUsers className="text-2xl text-white" />}
        />
        <StatsCard 
          title="Disponibles" 
          value={isLoadingTechnicians ? "..." : technicians.filter(t => t.isAvailable).length.toString()} 
          type="completed" 
          icon={<FaCheckCircle className="text-2xl text-white" />}
        />
        <StatsCard 
          title="Servicios Totales" 
          value={isLoadingTechnicians ? "..." : technicians.reduce((sum, t) => sum + (t.servicesCompleted || 0), 0).toString()} 
          type="quotes" 
          icon={<FaClock className="text-2xl text-white" />}
        />
      </div>
      
      {/* =============== RENDERIZACIÓN CONDICIONAL =============== */}
      
      {/* ESTADO DE CARGA */}
      {isLoadingTechnicians && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-gray-600">Cargando técnicos...</p>
          </div>
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {!isLoadingTechnicians && errorTechnicians && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <p className="font-semibold">Error al cargar técnicos</p>
            <p className="text-sm mt-2">{errorTechnicians}</p>
          </div>
          <button 
            onClick={WorkspaceTechnicians}
            className="btn btn-primary"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL - TÉCNICOS */}
      {!isLoadingTechnicians && !errorTechnicians && (
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
          
          {/* MENSAJE CUANDO NO HAY TÉCNICOS */}
          {technicians.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay técnicos registrados</h3>
              <p className="text-gray-500 mb-6">Comienza agregando tu primer técnico al sistema</p>
              <button 
                className="btn btn-primary"
                onClick={handleNewTechnician}
              >
                <FaPlus className="mr-2" /> Agregar Primer Técnico
              </button>
            </div>
          )}
        </div>
      )}

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
                {/* Avatar placeholder ya que el backend no maneja imágenes aún */}
                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-primary/10 flex items-center justify-center">
                  <FaUsers className="text-2xl text-primary" />
                </div>
                <h4 className="font-semibold text-lg">
                  {viewingTechnician.user?.username || viewingTechnician.name || 'Técnico'}
                </h4>
                <p className="text-gray-600">{viewingTechnician.specialty}</p>
                <p className="text-sm text-gray-500">{viewingTechnician.user?.email}</p>
                {viewingTechnician.phone && (
                  <p className="text-sm text-gray-500">{viewingTechnician.phone}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center border-t pt-3">
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.servicesCompleted || 0}</p>
                  <p className="text-sm text-gray-600">Servicios</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.averageTime || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Tiempo Prom.</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{viewingTechnician.rating || '0.0'} ⭐</p>
                  <p className="text-sm text-gray-600">Calificación</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experiencia:</span>
                  <span className="font-medium">{viewingTechnician.experienceYears || 0} años</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${viewingTechnician.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {viewingTechnician.isAvailable ? 'Disponible' : 'No disponible'}
                  </span>
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