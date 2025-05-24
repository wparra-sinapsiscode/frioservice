import React from 'react';
import { FiStar, FiUser, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const MyEvaluations = () => {
  // Datos simulados de evaluaciones
  const evaluations = [
    {
      id: 1,
      clientName: 'Supermercados ABC',
      date: '15/10/2023',
      rating: 5,
      comment: 'Excelente servicio, el técnico fue muy profesional y solucionó el problema rápidamente. Además dejó todo limpio y ordenado.',
      serviceType: 'Mantenimiento',
      equipment: 'Refrigerador Industrial'
    },
    {
      id: 2,
      clientName: 'Restaurante El Sabor',
      date: '10/10/2023',
      rating: 4,
      comment: 'Buen servicio, aunque tardó un poco más de lo esperado. El equipo funciona perfectamente ahora.',
      serviceType: 'Reparación',
      equipment: 'Congelador Vertical'
    },
    {
      id: 3,
      clientName: 'Panadería Dulce',
      date: '05/10/2023',
      rating: 5,
      comment: 'Servicio impecable. El técnico fue puntual y resolvió el problema con mucha eficiencia.',
      serviceType: 'Mantenimiento',
      equipment: 'Cámara Frigorífica'
    },
    {
      id: 4,
      clientName: 'Clínica San Juan',
      date: '28/09/2023',
      rating: 3,
      comment: 'El servicio fue aceptable, pero hubo que programar una segunda visita para terminar la reparación.',
      serviceType: 'Reparación',
      equipment: 'Aire Acondicionado Split'
    },
    {
      id: 5,
      clientName: 'Hotel Las Palmas',
      date: '20/09/2023',
      rating: 5,
      comment: 'Muy satisfechos con la instalación. El técnico nos explicó detalladamente cómo usar el sistema y fue muy amable.',
      serviceType: 'Instalación',
      equipment: 'Sistema de Aire Acondicionado'
    },
  ];

  // Cálculo del promedio de calificaciones
  const averageRating = evaluations.reduce((acc, curr) => acc + curr.rating, 0) / evaluations.length;

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
      </div>
    </div>
  );
};

export default MyEvaluations;