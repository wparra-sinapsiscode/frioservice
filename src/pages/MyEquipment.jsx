import React, { useState } from 'react';
import { FiPlus, FiFilter, FiPackage, FiCalendar, FiMapPin, FiClock, FiTool, FiAlertCircle, FiInfo } from 'react-icons/fi';

const MyEquipment = () => {
  // Estado para filtros
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Estado para modal de agregar equipo
  const [showModal, setShowModal] = useState(false);
  
  // Estado para modal de detalles
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  
  // Datos simulados de equipos
  const equipmentList = [
    {
      id: 1,
      name: 'Refrigerador Industrial #103',
      type: 'Refrigerador Industrial',
      brand: 'FrioTech',
      model: 'RT-500',
      serialNumber: 'FT5089312',
      location: 'Almacén principal',
      installationDate: '12/05/2022',
      status: 'operativo',
      lastService: '15/08/2023',
      nextServiceDue: '15/02/2024',
      maintenanceHistory: [
        { date: '15/08/2023', type: 'Mantenimiento preventivo', technician: 'Carlos Mendoza', notes: 'Limpieza de condensador y verificación de sistema' },
        { date: '10/02/2023', type: 'Mantenimiento preventivo', technician: 'Roberto Sánchez', notes: 'Limpieza general y recarga de refrigerante' },
        { date: '20/06/2022', type: 'Reparación', technician: 'Ana López', notes: 'Reemplazo de termostato defectuoso' },
      ]
    },
    {
      id: 2,
      name: 'Congelador Vertical #201',
      type: 'Congelador Vertical',
      brand: 'ColdMax',
      model: 'CV-300',
      serialNumber: 'CM7623145',
      location: 'Área de alimentos',
      installationDate: '05/09/2021',
      status: 'operativo',
      lastService: '20/07/2023',
      nextServiceDue: '20/01/2024',
      maintenanceHistory: [
        { date: '20/07/2023', type: 'Mantenimiento preventivo', technician: 'María Pérez', notes: 'Limpieza de sistema y ajuste de temperatura' },
        { date: '15/01/2023', type: 'Mantenimiento preventivo', technician: 'Carlos Mendoza', notes: 'Limpieza general y calibración' },
        { date: '03/10/2022', type: 'Reparación', technician: 'Juan Díaz', notes: 'Reemplazo de ventilador de condensador' },
      ]
    },
    {
      id: 3,
      name: 'Cámara de Refrigeración #305',
      type: 'Cámara Frigorífica',
      brand: 'FrioMaster',
      model: 'CF-1000',
      serialNumber: 'FM9872563',
      location: 'Bodega trasera',
      installationDate: '20/03/2020',
      status: 'requiere-mantenimiento',
      lastService: '10/04/2023',
      nextServiceDue: '10/10/2023',
      maintenanceHistory: [
        { date: '10/04/2023', type: 'Mantenimiento preventivo', technician: 'Roberto Sánchez', notes: 'Limpieza general y detección de desgaste en compresor' },
        { date: '28/10/2022', type: 'Reparación', technician: 'Ana López', notes: 'Reparación de fuga de refrigerante' },
        { date: '05/04/2022', type: 'Mantenimiento preventivo', technician: 'Carlos Mendoza', notes: 'Limpieza general y recarga de refrigerante' }
      ]
    },
    {
      id: 4,
      name: 'Aire Acondicionado Central',
      type: 'Sistema HVAC',
      brand: 'AirCool',
      model: 'AC-2000',
      serialNumber: 'AC1234987',
      location: 'Edificio principal',
      installationDate: '15/06/2021',
      status: 'operativo',
      lastService: '25/09/2023',
      nextServiceDue: '25/03/2024',
      maintenanceHistory: [
        { date: '25/09/2023', type: 'Mantenimiento preventivo', technician: 'Juan Díaz', notes: 'Limpieza de filtros y ductos' },
        { date: '12/03/2023', type: 'Mantenimiento preventivo', technician: 'María Pérez', notes: 'Limpieza general del sistema y verificación de refrigerante' },
        { date: '30/09/2022', type: 'Mantenimiento preventivo', technician: 'Carlos Mendoza', notes: 'Limpieza de filtros y verificación de sistema' },
      ]
    },
    {
      id: 5,
      name: 'Minisplit 12,000 BTU (Oficina gerencia)',
      type: 'Aire Acondicionado',
      brand: 'CoolBreeze',
      model: 'MS-12K',
      serialNumber: 'CB5678432',
      location: 'Oficina gerencia',
      installationDate: '10/08/2022',
      status: 'operativo',
      lastService: '05/08/2023',
      nextServiceDue: '05/02/2024',
      maintenanceHistory: [
        { date: '05/08/2023', type: 'Mantenimiento preventivo', technician: 'Roberto Sánchez', notes: 'Limpieza de filtros y verificación de carga de refrigerante' },
        { date: '06/02/2023', type: 'Mantenimiento preventivo', technician: 'Ana López', notes: 'Limpieza general y ajuste de sistema' }
      ]
    },
  ];
  
  // Obtener los tipos únicos para el filtro
  const equipmentTypes = [...new Set(equipmentList.map(equip => equip.type))];
  
  // Filtrar equipos
  const filteredEquipment = equipmentList.filter(equip => {
    let passTypeFilter = true;
    let passStatusFilter = true;
    
    if (typeFilter) passTypeFilter = equip.type === typeFilter;
    if (statusFilter) passStatusFilter = equip.status === statusFilter;
    
    return passTypeFilter && passStatusFilter;
  });
  
  // Abrir modal de detalles
  const openDetailsModal = (equipment) => {
    setSelectedEquipment(equipment);
  };
  
  // Renderizar estado del equipo
  const renderStatus = (status) => {
    switch (status) {
      case 'operativo':
        return <span className="status-badge aprobada">Operativo</span>;
      case 'requiere-mantenimiento':
        return <span className="status-badge pendiente">Requiere Mantenimiento</span>;
      case 'fuera-de-servicio':
        return <span className="status-badge rechazada">Fuera de Servicio</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Mis Equipos</h1>
        <button 
          className="btn btn-primary flex items-center" 
          onClick={() => setShowModal(true)}
        >
          <FiPlus className="mr-2" />
          Registrar Nuevo Equipo
        </button>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="typeFilter">Tipo de Equipo</label>
            <select 
              id="typeFilter" 
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {equipmentTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="statusFilter">Estado</label>
            <select 
              id="statusFilter" 
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="operativo">Operativo</option>
              <option value="requiere-mantenimiento">Requiere Mantenimiento</option>
              <option value="fuera-de-servicio">Fuera de Servicio</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Lista de Equipos */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Equipos Registrados ({filteredEquipment.length})</h2>
        
        {filteredEquipment.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No hay equipos con los filtros seleccionados</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEquipment.map(equipment => (
              <div 
                key={equipment.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDetailsModal(equipment)}
              >
                <div className="bg-secondary p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <FiPackage className="text-primary mr-2" />
                    <h3 className="font-semibold">{equipment.name}</h3>
                  </div>
                  <div>
                    {renderStatus(equipment.status)}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FiInfo className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Tipo</p>
                        <p>{equipment.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiTool className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Marca/Modelo</p>
                        <p>{equipment.brand} {equipment.model}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiMapPin className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Ubicación</p>
                        <p>{equipment.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FiCalendar className="text-gray mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Último Servicio</p>
                        <p>{equipment.lastService}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <FiClock className="text-warning mr-2" />
                      <div>
                        <p className="text-sm">Próximo mantenimiento: <span className="font-medium">{equipment.nextServiceDue}</span></p>
                      </div>
                    </div>
                    <button className="text-primary hover:underline text-sm">Ver detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de Agregar Equipo (simplificado) */}
      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-semibold">Registrar Nuevo Equipo</h3>
              <button 
                className="text-gray-dark text-xl" 
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="equipName">Nombre del Equipo</label>
                <input type="text" id="equipName" className="form-control" placeholder="Ej: Refrigerador Industrial #104" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label htmlFor="equipType">Tipo de Equipo</label>
                  <select id="equipType" className="form-control">
                    <option value="">Seleccione un tipo</option>
                    <option value="Refrigerador Industrial">Refrigerador Industrial</option>
                    <option value="Congelador Vertical">Congelador Vertical</option>
                    <option value="Cámara Frigorífica">Cámara Frigorífica</option>
                    <option value="Aire Acondicionado">Aire Acondicionado</option>
                    <option value="Sistema HVAC">Sistema HVAC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="equipLocation">Ubicación</label>
                  <input type="text" id="equipLocation" className="form-control" placeholder="Ej: Almacén principal" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label htmlFor="equipBrand">Marca</label>
                  <input type="text" id="equipBrand" className="form-control" placeholder="Ej: FrioTech" />
                </div>
                <div className="form-group">
                  <label htmlFor="equipModel">Modelo</label>
                  <input type="text" id="equipModel" className="form-control" placeholder="Ej: RT-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label htmlFor="equipSerial">Número de Serie</label>
                  <input type="text" id="equipSerial" className="form-control" placeholder="Ej: FT5089312" />
                </div>
                <div className="form-group">
                  <label htmlFor="equipInstallDate">Fecha de Instalación</label>
                  <input type="date" id="equipInstallDate" className="form-control" />
                </div>
              </div>
              <div className="flex items-start bg-info/10 p-4 rounded mt-4">
                <FiAlertCircle className="text-info mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Al registrar su equipo en nuestro sistema, podrá solicitar servicios más fácilmente 
                  y tendrá acceso al historial completo de mantenimiento.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-primary">Registrar Equipo</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Detalles del Equipo */}
      {selectedEquipment && (
        <div className="modal active">
          <div className="modal-content max-w-[800px]">
            <div className="modal-header">
              <h3 className="text-xl font-semibold">Detalle del Equipo</h3>
              <button 
                className="text-gray-dark text-xl" 
                onClick={() => setSelectedEquipment(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEquipment.name}</h2>
                  <p className="text-gray-600">{selectedEquipment.brand} {selectedEquipment.model}</p>
                </div>
                <div>
                  {renderStatus(selectedEquipment.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">Información General</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-gray-600 w-40">Tipo:</span>
                      <span>{selectedEquipment.type}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Número de Serie:</span>
                      <span>{selectedEquipment.serialNumber}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Ubicación:</span>
                      <span>{selectedEquipment.location}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Fecha de Instalación:</span>
                      <span>{selectedEquipment.installationDate}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Mantenimiento</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-gray-600 w-40">Último Servicio:</span>
                      <span>{selectedEquipment.lastService}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Próximo Servicio:</span>
                      <span className={selectedEquipment.status === 'requiere-mantenimiento' ? 'text-warning font-medium' : ''}>
                        {selectedEquipment.nextServiceDue}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <button className="btn btn-sm btn-primary mt-2">Solicitar Servicio</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold mb-3 border-t pt-4">Historial de Mantenimiento</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tipo de Servicio</th>
                      <th>Técnico</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEquipment.maintenanceHistory.map((service, index) => (
                      <tr key={index}>
                        <td>{service.date}</td>
                        <td>{service.type}</td>
                        <td>{service.technician}</td>
                        <td>{service.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-outline" 
                onClick={() => setSelectedEquipment(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEquipment;