import React, { createContext, useState, useEffect } from 'react';
import { 
  servicesData, 
  filterServices 
} from '../utils/servicesMockData';
import { 
  quotesData, 
  filterQuotes 
} from '../utils/quotesMockData';
import { 
  technicianData 
} from '../utils/mockData';
import { 
  calendarEvents, 
  filterCalendarEvents 
} from '../utils/calendarMockData';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Estado para servicios
  const [services, setServices] = useState(servicesData);
  const [serviceFilters, setServiceFilters] = useState({
    status: 'todos',
    type: 'todos',
    technician: 'todos',
    client: 'todos',
    startDate: '',
    endDate: '',
  });
  const [filteredServices, setFilteredServices] = useState(servicesData);

  // Estado para cotizaciones
  const [quotes, setQuotes] = useState(quotesData);
  const [quoteFilters, setQuoteFilters] = useState({
    status: 'todos',
    client: 'todos',
    type: 'todos',
    startDate: '',
    endDate: '',
  });
  const [filteredQuotes, setFilteredQuotes] = useState(quotesData);

  // Estado para técnicos
  const [technicians, setTechnicians] = useState(technicianData);

  // Estado para calendario
  const [events, setEvents] = useState(calendarEvents);
  const [calendarFilters, setCalendarFilters] = useState({
    types: ['programado', 'correctivo'],
    technician: 'todos',
  });
  const [filteredEvents, setFilteredEvents] = useState(calendarEvents);

  // Efecto para filtrar servicios cuando cambien los filtros
  useEffect(() => {
    setFilteredServices(filterServices(services, serviceFilters));
  }, [services, serviceFilters]);

  // Efecto para filtrar cotizaciones cuando cambien los filtros
  useEffect(() => {
    setFilteredQuotes(filterQuotes(quotes, quoteFilters));
  }, [quotes, quoteFilters]);

  // Efecto para filtrar eventos de calendario cuando cambien los filtros
  useEffect(() => {
    setFilteredEvents(filterCalendarEvents(events, calendarFilters));
  }, [events, calendarFilters]);

  // Función para agregar un nuevo servicio
  const addService = (newService) => {
    setServices(prev => [newService, ...prev]);
  };

  // Función para actualizar un servicio existente
  const updateService = (id, updatedService) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...updatedService } : service
      )
    );
  };

  // Función para eliminar un servicio
  const deleteService = (id) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  // Función para agregar una nueva cotización
  const addQuote = (newQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
  };

  // Función para actualizar una cotización existente
  const updateQuote = (id, updatedQuote) => {
    setQuotes(prev => 
      prev.map(quote => 
        quote.id === id ? { ...quote, ...updatedQuote } : quote
      )
    );
  };

  // Función para eliminar una cotización
  const deleteQuote = (id) => {
    setQuotes(prev => prev.filter(quote => quote.id !== id));
  };

  // Función para agregar un nuevo técnico
  const addTechnician = (newTechnician) => {
    setTechnicians(prev => [...prev, newTechnician]);
  };

  // Función para actualizar un técnico existente
  const updateTechnician = (id, updatedTechnician) => {
    setTechnicians(prev => 
      prev.map(technician => 
        technician.id === id ? { ...technician, ...updatedTechnician } : technician
      )
    );
  };

  // Función para eliminar un técnico
  const deleteTechnician = (id) => {
    setTechnicians(prev => prev.filter(technician => technician.id !== id));
  };

  // Función para agregar un nuevo evento de calendario
  const addEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Función para actualizar un evento existente
  const updateEvent = (id, updatedEvent) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  // Función para eliminar un evento
  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <AppContext.Provider 
      value={{ 
        // Servicios
        services,
        filteredServices,
        serviceFilters,
        setServiceFilters,
        addService,
        updateService,
        deleteService,
        
        // Cotizaciones
        quotes,
        filteredQuotes,
        quoteFilters,
        setQuoteFilters,
        addQuote,
        updateQuote,
        deleteQuote,
        
        // Técnicos
        technicians,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        
        // Eventos de calendario
        events,
        filteredEvents,
        calendarFilters,
        setCalendarFilters,
        addEvent,
        updateEvent,
        deleteEvent
      }}
    >
      {children}
    </AppContext.Provider>
  );
};