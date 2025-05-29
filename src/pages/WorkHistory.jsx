import React, { useState, useEffect } from 'react';
import { FiCalendar, FiFilter, FiMapPin, FiTool, FiClock, FiCheckCircle, FiAlertTriangle, FiLoader, FiMessageSquare, FiStar } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const WorkHistory = () => {
  const { user } = useAuth();
  const [workHistory, setWorkHistory] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [errorEvaluations, setErrorEvaluations] = useState(null);
  
  // Estado para los filtros
  const [monthFilter, setMonthFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Fetch work history and evaluations from API
  useEffect(() => {
    const fetchWorkHistory = async () => {
      if (!user?.id || !user?.token) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3001/api/services/technician/${user.id}?status=COMPLETED`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🔥 Work history data:', data);
        console.log('🔥 Total services:', data.data ? data.data.length : 0);
        console.log('🔥 Services with ratings:', data.data ? data.data.filter(s => s.clientRating !== null).length : 0);
        console.log('🔥 Services without ratings:', data.data ? data.data.filter(s => s.clientRating === null).length : 0);
        
        // Log the first service to check its structure
        if (data.data && data.data.length > 0) {
          console.log('🔥 Sample service:', {
            id: data.data[0].id,
            title: data.data[0].title,
            status: data.data[0].status,
            clientRating: data.data[0].clientRating,
            clientComment: data.data[0].clientComment,
          });
        }

        if (data.success && data.data) {
          // Transform API data to component format
          const transformedData = data.data.map(service => ({
            id: service.id,
            client: service.client?.companyName || service.client?.contactPerson || 'Cliente no especificado',
            equipment: getEquipmentDisplay(service.equipmentIds, service.type),
            type: getServiceTypeDisplay(service.type),
            address: service.address,
            date: service.completedAt ? new Date(service.completedAt).toLocaleDateString('es-ES') : 
                  service.scheduledDate ? new Date(service.scheduledDate).toLocaleDateString('es-ES') : 'Sin fecha',
            time: getTimeDisplay(service.scheduledDate, service.completedAt, service.timeSpent),
            issues: service.description || 'Sin descripción',
            solution: service.workPerformed || 'Sin detalles de trabajo realizado',
            parts: getMaterialsUsed(service.materialsUsed),
            status: getServiceStatus(service.status),
            priority: service.priority,
            clientNotes: service.clientNotes,
            technicianNotes: service.technicianNotes,
            // Información de evaluación
            clientRating: service.clientRating,
            clientComment: service.clientComment,
            ratedAt: service.ratedAt
          }));

          setWorkHistory(transformedData);
        } else {
          throw new Error(data.message || 'Error al obtener historial de trabajos');
        }
      } catch (error) {
        console.error('Error fetching work history:', error);
        setError('Error al cargar el historial: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Función para obtener evaluaciones
    const fetchEvaluations = async () => {
      if (!user?.id || !user?.token) return;
      
      try {
        setLoadingEvaluations(true);
        setErrorEvaluations(null);
        
        const response = await fetch(
          `http://localhost:3001/api/services/technician/${user.id}/evaluations`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🌟 Evaluations data:', data);
        
        if (data.success && data.data) {
          setEvaluations(data.data);
        } else {
          throw new Error(data.message || 'Error al obtener evaluaciones');
        }
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setErrorEvaluations('Error al cargar evaluaciones: ' + error.message);
      } finally {
        setLoadingEvaluations(false);
      }
    };
    
    // Ejecutar ambas consultas
    fetchWorkHistory();
    fetchEvaluations();
  }, [user]);

  // Helper functions
  const getEquipmentDisplay = (equipmentIds, serviceType) => {
    if (equipmentIds && equipmentIds.length > 0) {
      return `Equipo de refrigeración (${equipmentIds.length} unidad${equipmentIds.length > 1 ? 'es' : ''})`;
    }
    return getServiceTypeEquipment(serviceType);
  };

  const getServiceTypeEquipment = (type) => {
    const equipmentMap = {
      'MAINTENANCE': 'Equipo de refrigeración',
      'REPAIR': 'Equipo averiado',
      'INSTALLATION': 'Nuevo equipo',
      'INSPECTION': 'Equipo a inspeccionar',
      'EMERGENCY': 'Equipo de emergencia',
      'CLEANING': 'Equipo a limpiar',
      'CONSULTATION': 'Consulta técnica'
    };
    return equipmentMap[type] || 'Equipo no especificado';
  };

  const getServiceTypeDisplay = (type) => {
    const typeMap = {
      'MAINTENANCE': 'Mantenimiento',
      'REPAIR': 'Reparación',
      'INSTALLATION': 'Instalación',
      'INSPECTION': 'Inspección',
      'EMERGENCY': 'Emergencia',
      'CLEANING': 'Limpieza',
      'CONSULTATION': 'Consultoría'
    };
    return typeMap[type] || type;
  };

  const getTimeDisplay = (scheduledDate, completedAt, timeSpent) => {
    const startTime = scheduledDate ? new Date(scheduledDate).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'Sin hora';
    
    if (timeSpent) {
      const hours = Math.floor(timeSpent / 60);
      const minutes = timeSpent % 60;
      return `${startTime} (${hours}h ${minutes}m)`;
    }
    
    if (completedAt) {
      const endTime = new Date(completedAt).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${startTime} - ${endTime}`;
    }
    
    return startTime;
  };

  const getMaterialsUsed = (materialsUsed) => {
    if (!materialsUsed) return ['Sin materiales registrados'];
    
    if (typeof materialsUsed === 'string') {
      try {
        const parsed = JSON.parse(materialsUsed);
        return Array.isArray(parsed) ? parsed : [materialsUsed];
      } catch {
        return [materialsUsed];
      }
    }
    
    if (Array.isArray(materialsUsed)) {
      return materialsUsed.length > 0 ? materialsUsed : ['Sin materiales registrados'];
    }
    
    return ['Sin materiales registrados'];
  };

  const getServiceStatus = (status) => {
    if (status === 'COMPLETED') return 'exitoso';
    if (status === 'IN_PROGRESS') return 'parcial';
    return 'pendiente';
  };

  // Filtrar historial por mes y tipo
  const filteredHistory = workHistory.filter(item => {
    let passMonthFilter = true;
    let passTypeFilter = true;

    if (monthFilter) {
      const [day, month, year] = item.date.split('/');
      passMonthFilter = month === monthFilter.padStart(2, '0');
    }

    if (typeFilter) {
      passTypeFilter = item.type === typeFilter;
    }

    return passMonthFilter && passTypeFilter;
  });

  // Extraer tipos únicos para el filtro
  const uniqueTypes = [...new Set(workHistory.map(item => item.type))];

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Historial de Trabajos</h1>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <FiLoader className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-gray-600">Cargando historial de trabajos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Historial de Trabajos</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <p className="font-semibold">Error al cargar historial</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Historial de Trabajos</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="text-gray mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="monthFilter">Mes</label>
            <select 
              id="monthFilter" 
              className="form-control"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            >
              <option value="">Todos los meses</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="typeFilter">Tipo de Servicio</label>
            <select 
              id="typeFilter" 
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Resumen de evaluaciones */}
      {!loadingEvaluations && evaluations.length > 0 && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FiStar className="text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Resumen de Evaluaciones</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Calificación promedio</p>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-700 mr-2">
                  {(evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0) / evaluations.length).toFixed(1)}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i}
                      className={`${i < Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0) / evaluations.length) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} h-4 w-4`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Total de evaluaciones</p>
              <p className="text-2xl font-bold text-blue-700">{evaluations.length}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Evaluaciones recientes</p>
              <p className="text-2xl font-bold text-blue-700">
                {evaluations.filter(e => {
                  const evalDate = new Date(e.date);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return evalDate > thirtyDaysAgo;
                }).length}
              </p>
              <p className="text-xs text-gray-500">En los últimos 30 días</p>
            </div>
          </div>
          
          {evaluations.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Evaluaciones recientes</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {evaluations.slice(0, 5).map((evaluation, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{evaluation.clientName}</p>
                        <p className="text-sm text-gray-500">{evaluation.serviceType} • {evaluation.serviceDate}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i}
                            className={`${i < evaluation.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} h-4 w-4`} 
                          />
                        ))}
                        <span className="ml-1 text-sm">{evaluation.rating}</span>
                      </div>
                    </div>
                    {evaluation.comment && (
                      <p className="text-gray-700 mt-1 italic text-sm">"{evaluation.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Historial de trabajo */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Servicios Realizados ({filteredHistory.length})</h2>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <FiTool className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {workHistory.length === 0 ? 'No hay servicios completados' : 'No hay registros con los filtros seleccionados'}
            </h3>
            <p className="text-gray-500">
              {workHistory.length === 0 
                ? 'Una vez que completes servicios, aparecerán en tu historial.'
                : 'Prueba ajustando los filtros para ver más resultados.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredHistory.map(work => (
              <div key={work.id} className="border rounded-lg overflow-hidden">
                <div className="flex justify-between items-center bg-secondary p-4 border-b">
                  <div>
                    <h3 className="font-semibold">{work.client}</h3>
                    <p className="text-sm text-gray-500">{work.equipment}</p>
                  </div>
                  <div className="flex items-center">
                    {work.status === 'exitoso' ? (
                      <FiCheckCircle className="text-success mr-2" />
                    ) : work.status === 'parcial' ? (
                      <FiAlertTriangle className="text-warning mr-2" />
                    ) : (
                      <FiClock className="text-info mr-2" />
                    )}
                    <span className={`text-sm font-medium ${
                      work.status === 'exitoso' ? 'text-success' : 
                      work.status === 'parcial' ? 'text-warning' : 'text-info'
                    }`}>
                      {work.status === 'exitoso' ? 'Completado' : 
                       work.status === 'parcial' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-start mb-2">
                        <FiTool className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Tipo de Servicio</p>
                          <p>{work.type}</p>
                        </div>
                      </div>
                      <div className="flex items-start mb-2">
                        <FiMapPin className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Dirección</p>
                          <p>{work.address}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start mb-2">
                        <FiCalendar className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Fecha</p>
                          <p>{work.date}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FiClock className="text-gray mt-1 mr-2" />
                        <div>
                          <p className="text-sm text-gray-dark font-medium">Horario</p>
                          <p>{work.time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Detalles del Servicio</h4>
                    
                    {/* Sección de evaluación del cliente */}
                    {work.clientRating && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FiMessageSquare className="text-blue-500 mr-2" />
                            <h5 className="font-semibold text-blue-700">Evaluación del cliente</h5>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i}
                                className={`${i < work.clientRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} h-4 w-4`} 
                              />
                            ))}
                            <span className="ml-1 text-sm font-medium">{work.clientRating.toFixed(1)}</span>
                          </div>
                        </div>
                        {work.clientComment && (
                          <div className="mt-2">
                            <p className="text-gray-700 italic">"{work.clientComment}"</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {work.ratedAt ? `Evaluado el ${new Date(work.ratedAt).toLocaleDateString('es-ES')}` : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Descripción</p>
                        <p className="text-gray-700 mb-2">{work.issues}</p>
                        {work.clientNotes && (
                          <>
                            <p className="text-sm text-gray-dark font-medium">Notas del Cliente</p>
                            <p className="text-gray-700 mb-2">{work.clientNotes}</p>
                          </>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-dark font-medium">Trabajo Realizado</p>
                        <p className="text-gray-700 mb-2">{work.solution}</p>
                        {work.technicianNotes && (
                          <>
                            <p className="text-sm text-gray-dark font-medium">Notas del Técnico</p>
                            <p className="text-gray-700 mb-2">{work.technicianNotes}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-dark font-medium">Materiales utilizados</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {work.parts.map((part, index) => (
                          <span key={index} className="bg-secondary px-2 py-1 rounded text-sm">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistory;