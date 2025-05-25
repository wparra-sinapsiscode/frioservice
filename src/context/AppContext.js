import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  // --- ESTADOS ---
  const [services, setServices] = useState(servicesData);
  const [serviceFilters, setServiceFilters] = useState({
    status: 'todos', type: 'todos', technician: 'todos',
    client: 'todos', startDate: '', endDate: '',
  });
  const [filteredServices, setFilteredServices] = useState(servicesData);

  const [quotes, setQuotes] = useState(quotesData);
  const [quoteFilters, setQuoteFilters] = useState({
    status: 'todos', client: 'todos', type: 'todos',
    startDate: '', endDate: '',
  });
  const [filteredQuotes, setFilteredQuotes] = useState(quotesData);

  const [technicians, setTechnicians] = useState(technicianData);

  const [events, setEvents] = useState(calendarEvents);
  const [calendarFilters, setCalendarFilters] = useState({
    types: ['programado', 'correctivo'],
    technician: 'todos',
  });
  const [filteredEvents, setFilteredEvents] = useState(calendarEvents);

  // --- EFECTOS ---
  useEffect(() => {
    setFilteredServices(filterServices(services, serviceFilters));
  }, [services, serviceFilters]);

  useEffect(() => {
    setFilteredQuotes(filterQuotes(quotes, quoteFilters));
  }, [quotes, quoteFilters]);

  useEffect(() => {
    setFilteredEvents(filterCalendarEvents(events, calendarFilters));
  }, [events, calendarFilters]);

  // --- FUNCIONES MEMORIZADAS CON useCallback ---
  const addService = useCallback((newService) => setServices(prev => [newService, ...prev]), []);
  const updateService = useCallback((id, updatedService) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedService } : s));
  }, []);
  const deleteService = useCallback((id) => setServices(prev => prev.filter(s => s.id !== id)), []);

  const addQuote = useCallback((newQuote) => setQuotes(prev => [newQuote, ...prev]), []);
  const updateQuote = useCallback((id, updatedQuote) => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...updatedQuote } : q));
  }, []);
  const deleteQuote = useCallback((id) => setQuotes(prev => prev.filter(q => q.id !== id)), []);

  const addTechnician = useCallback((newTechnician) => setTechnicians(prev => [...prev, newTechnician]), []);
  const updateTechnician = useCallback((id, updatedTechnician) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, ...updatedTechnician } : t));
  }, []);
  const deleteTechnician = useCallback((id) => setTechnicians(prev => prev.filter(t => t.id !== id)), []);

  const addEvent = useCallback((newEvent) => setEvents(prev => [...prev, newEvent]), []);
  const updateEvent = useCallback((id, updatedEvent) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  }, []);
  const deleteEvent = useCallback((id) => setEvents(prev => prev.filter(e => e.id !== id)), []);

  // --- VALOR DEL CONTEXTO MEMORIZADO CON useMemo ---
  const contextValue = useMemo(() => ({
    services, filteredServices, serviceFilters, setServiceFilters,
    addService, updateService, deleteService,
    quotes, filteredQuotes, quoteFilters, setQuoteFilters,
    addQuote, updateQuote, deleteQuote,
    technicians, addTechnician, updateTechnician, deleteTechnician,
    events, filteredEvents, calendarFilters, setCalendarFilters,
    addEvent, updateEvent, deleteEvent
  }), [
    services, filteredServices, serviceFilters,
    addService, updateService, deleteService,
    quotes, filteredQuotes, quoteFilters,
    addQuote, updateQuote, deleteQuote,
    technicians, addTechnician, updateTechnician, deleteTechnician,
    events, filteredEvents, calendarFilters,
    addEvent, updateEvent, deleteEvent
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};