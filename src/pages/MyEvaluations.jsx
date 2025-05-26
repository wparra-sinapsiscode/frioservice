import React, { useState, useEffect } from 'react';
import { FiStar, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const MyEvaluations = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch evaluations from API
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!user?.id || !user?.token) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

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
        console.log('🔥 Evaluations data:', data);

        if (data.success && data.data) {
          setEvaluations(data.data);
        } else {
          throw new Error(data.message || 'Error al obtener evaluaciones');
        }
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        setError('Error al cargar las evaluaciones: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [user]);

  // Cálculo del promedio de calificaciones
  const averageRating = evaluations.length > 0 
    ? evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length 
    : 0;

  // Renderizado de estrellas basado en la calificación
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar 
          key={i} 
          className={`${i <= rating ? 'text-warning fill-current' : 'text-gray'} text-xl`} 
        />
      );
    }
    return stars;
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Evaluaciones</h1>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evaluaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Evaluaciones</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <p className="font-semibold">Error al cargar evaluaciones</p>
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Evaluaciones</h1>
      
      {/* Resumen de calificaciones */}
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Calificación Promedio</h2>
            <p className="text-gray-600 mb-4">Basado en {evaluations.length} evaluaciones</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{evaluations.filter(e => e.rating === 5).length}</div>
            <div className="flex justify-center">{renderStars(5)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{evaluations.filter(e => e.rating === 4).length}</div>
            <div className="flex justify-center">{renderStars(4)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{evaluations.filter(e => e.rating === 3).length}</div>
            <div className="flex justify-center">{renderStars(3)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{evaluations.filter(e => e.rating === 2).length}</div>
            <div className="flex justify-center">{renderStars(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{evaluations.filter(e => e.rating === 1).length}</div>
            <div className="flex justify-center">{renderStars(1)}</div>
          </div>
        </div>
      </div>
      
      {/* Lista de evaluaciones */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Comentarios de Clientes</h2>
        
        {evaluations.length === 0 ? (
          <div className="text-center py-12">
            <FiStar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay evaluaciones aún</h3>
            <p className="text-gray-500">
              Una vez que completes servicios y los clientes te evalúen, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {evaluations.map(evaluation => (
            <div key={evaluation.id} className="border-b pb-6 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center">
                    <FiUser className="text-gray mr-2" />
                    <h3 className="font-semibold">{evaluation.clientName}</h3>
                  </div>
                  <div className="flex items-center mt-1">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">{evaluation.date}</span>
                  </div>
                </div>
                <div className="flex">{renderStars(evaluation.rating)}</div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-600 mb-1">Servicio:</div>
                <div className="bg-secondary inline-block px-3 py-1 rounded-full text-sm mr-2">
                  {evaluation.serviceType}
                </div>
                <div className="bg-secondary inline-block px-3 py-1 rounded-full text-sm">
                  {evaluation.equipment}
                </div>
              </div>
              
              <div className="flex items-start">
                <FiMessageSquare className="text-gray mt-1 mr-2" />
                <p className="text-gray-700">{evaluation.comment}</p>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvaluations;