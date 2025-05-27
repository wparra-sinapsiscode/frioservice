import React, { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiPackage, FiCalendar, FiMapPin, FiClock, FiTool, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import EquipmentModal from '../components/equipment/EquipmentModal';
import EquipmentDetailModal from '../components/equipment/EquipmentDetailModal';

const MyEquipment = () => {
  console.log('🔥🔥🔥 MyEquipment component rendered');
  
  // Obtener datos y funciones del contexto
  const { 
    equipment, 
    isLoadingEquipment, 
    errorEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    updateEquipmentStatus,
    fetchEquipment,
    user  // <-- AGREGADO PARA OBTENER USUARIO
  } = useApp();

  // Estado para filtros
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estado para modal de agregar equipo
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  
  // Estado para modal de detalles
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // Fetch equipment on component mount
  useEffect(() => {
    console.log('🔥🔥🔥 MyEquipment useEffect - fetching equipment');
    fetchEquipment();
  }, [fetchEquipment]);
  
  // Obtener los tipos únicos para el filtro desde los datos reales
  const equipmentTypes = [...new Set(equipment.map(equip => equip.type))].filter(Boolean);
  
  // Filtrar equipos con datos reales
  const filteredEquipment = equipment.filter(equip => {
    console.log('🔥🔥🔥 Filtering equipment:', equip);
    let passTypeFilter = true;
    let passStatusFilter = true;
    
    if (typeFilter) passTypeFilter = equip.type === typeFilter;
    if (statusFilter) {
      // Mapear estados del frontend a backend
      const statusMap = {
        'operativo': 'ACTIVE',
        'requiere-mantenimiento': 'MAINTENANCE', 
        'fuera-de-servicio': 'BROKEN',
        'inactivo': 'INACTIVE'
      };
      const backendStatus = statusMap[statusFilter] || statusFilter.toUpperCase();
      passStatusFilter = equip.status === backendStatus;
    }
    
    return passTypeFilter && passStatusFilter;
  });
  
  // Abrir modal de detalles
  const openDetailsModal = (equipment) => {
    console.log('🔥🔥🔥 Opening details for equipment:', equipment);
    setSelectedEquipment(equipment);
  };

  // Abrir modal para nuevo equipo
  const handleNewEquipment = () => {
    console.log('🔥🔥🔥 Opening new equipment modal');
    setEditingEquipment(null);
    setShowModal(true);
  };

  // Abrir modal para editar equipo
  const handleEditEquipment = (equipment) => {
    console.log('🔥🔥🔥 Opening edit modal for equipment:', equipment);
    setEditingEquipment(equipment);
    setShowModal(true);
  };

  // Manejar guardado de equipo (crear o editar)
  const handleSaveEquipment = async (equipmentData) => {
    console.log('🔥🔥🔥 Saving equipment:', equipmentData);
    try {
      if (editingEquipment) {
        // Actualizar equipo existente
        console.log('🔥🔥🔥 Updating equipment with ID:', editingEquipment.id);
        await updateEquipment(editingEquipment.id, equipmentData);
      } else {
        // Crear nuevo equipo
        console.log('🔥🔥🔥 Creating new equipment');
        await addEquipment(equipmentData);
      }
      setShowModal(false);
      setEditingEquipment(null);
    } catch (error) {
      console.error('🔥🔥🔥 Error saving equipment:', error);
      alert('Error al guardar el equipo. Por favor, intente nuevamente.');
    }
  };

  // Manejar eliminación de equipo
  const handleDeleteEquipment = async (equipment) => {
    console.log('🔥 DELETE - Attempting to delete equipment:', equipment);
    console.log('🔥 DELETE - Usuario actual desde hook:', user);
    console.log('🔥 DELETE - ClientId del equipo:', equipment.clientId);
    console.log('🔥 DELETE - UserId actual:', user?.id || user?.userId);
    console.log('🔥 DELETE - Rol del usuario:', user?.role);
    
    try {
      console.log('🔥 DELETE - Llamando deleteEquipment con ID:', equipment.id);
      await deleteEquipment(equipment.id);
      console.log('🔥 DELETE - Eliminación exitosa');
    } catch (error) {
      console.error('🔥 DELETE - Error eliminando equipo:', error);
      console.error('🔥 DELETE - Error message:', error.message);
      console.error('🔥 DELETE - Error stack:', error.stack);
      alert('Error al eliminar el equipo. Por favor, intente nuevamente.');
    }
  };

  // Manejar cambio de estado del equipo
  const handleStatusChange = async (equipmentId, newStatus) => {
    console.log('🔥🔥🔥 Changing equipment status:', equipmentId, 'to', newStatus);
    try {
      await updateEquipmentStatus(equipmentId, newStatus);
    } catch (error) {
      console.error('🔥🔥🔥 Error updating equipment status:', error);
      alert('Error al actualizar el estado del equipo. Por favor, intente nuevamente.');
    }
  };
  
  // Renderizar estado del equipo (mapear backend status a frontend labels)
  const renderStatus = (status) => {
    console.log('🔥🔥🔥 Rendering status:', status);
    const statusMap = {
      'ACTIVE': { label: 'Operativo', class: 'aprobada' },
      'MAINTENANCE': { label: 'Requiere Mantenimiento', class: 'pendiente' },
      'BROKEN': { label: 'Fuera de Servicio', class: 'rechazada' },
      'INACTIVE': { label: 'Inactivo', class: 'rechazada' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: '' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('🔥🔥🔥 Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  // Loading state
  if (isLoadingEquipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando equipos...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (errorEquipment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {errorEquipment}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Mis Equipos</h1>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={handleNewEquipment}
        >
          <FiPlus className="mr-2" />
          Agregar Equipo
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="operativo">Operativo</option>
                <option value="requiere-mantenimiento">Requiere Mantenimiento</option>
                <option value="fuera-de-servicio">Fuera de Servicio</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          
          {(typeFilter || statusFilter) && (
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              onClick={() => {
                setTypeFilter('');
                setStatusFilter('');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <FiPackage className="text-blue-500 mr-3" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-800">{equipment.name}</h3>
                    <p className="text-sm text-gray-600">{equipment.type}</p>
                  </div>
                </div>
                {renderStatus(equipment.status)}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiTool className="mr-2" size={16} />
                  <span>{equipment.brand} - {equipment.model}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="mr-2" size={16} />
                  <span>{equipment.location || 'Ubicación no especificada'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="mr-2" size={16} />
                  <span>Instalado: {formatDate(equipment.installDate)}</span>
                </div>
                {equipment.warrantyExpiry && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-2" size={16} />
                    <span>Garantía: {formatDate(equipment.warrantyExpiry)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button 
                  className="btn btn-outline btn-sm flex-1"
                  onClick={() => openDetailsModal(equipment)}
                >
                  <FiInfo className="mr-1" size={16} />
                  Ver detalles
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEditEquipment(equipment)}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <FiPackage className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay equipos</h3>
          <p className="text-gray-500 mb-4">
            {equipment.length === 0 
              ? 'Aún no has registrado ningún equipo.'
              : 'No se encontraron equipos con los filtros aplicados.'
            }
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleNewEquipment}
          >
            <FiPlus className="mr-2" />
            Agregar tu primer equipo
          </button>
        </div>
      )}

      {/* Modal para agregar/editar equipo */}
      {showModal && (
        <EquipmentModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingEquipment(null);
          }}
          onSave={handleSaveEquipment}
          equipment={editingEquipment}
        />
      )}

      {/* Modal de detalles */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          isOpen={!!selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
          onEdit={handleEditEquipment}
          onDelete={handleDeleteEquipment}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default MyEquipment;