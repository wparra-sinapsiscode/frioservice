/**
 * Utility functions for client data processing
 */

/**
 * Obtiene el nombre de un cliente según su tipo
 * @param {Object} client - Objeto cliente del backend
 * @returns {string} Nombre apropiado según el tipo de cliente
 */
export const getClientDisplayName = (client) => {
  if (!client) return 'Cliente no disponible';
  
  // Para empresas: mostrar razón social (companyName)
  if (client.clientType === 'COMPANY') {
    return client.companyName || 'Empresa sin nombre';
  }
  
  // Para personas naturales: mostrar nombre completo (contactPerson)
  if (client.clientType === 'PERSONAL') {
    return client.contactPerson || 'Cliente sin nombre';
  }
  
  // Fallback para casos no definidos
  return client.companyName || client.contactPerson || client.user?.username || 'Cliente sin nombre';
};

/**
 * Obtiene el nombre del contacto principal de un cliente
 * @param {Object} client - Objeto cliente del backend
 * @returns {string} Nombre del contacto principal
 */
export const getClientContactName = (client) => {
  if (!client) return 'Contacto no disponible';
  
  // Para empresas: mostrar persona de contacto
  if (client.clientType === 'COMPANY') {
    return client.contactPerson || 'Sin persona de contacto';
  }
  
  // Para personas naturales: el contacto es el mismo cliente
  if (client.clientType === 'PERSONAL') {
    return client.contactPerson || 'Cliente sin nombre';
  }
  
  return client.contactPerson || 'Sin contacto definido';
};

/**
 * Obtiene el tipo de documento de identificación
 * @param {Object} client - Objeto cliente del backend
 * @returns {string} Tipo de documento
 */
export const getClientDocumentType = (client) => {
  if (!client) return '';
  
  if (client.clientType === 'COMPANY') {
    return 'RUC';
  }
  
  if (client.clientType === 'PERSONAL') {
    return 'DNI';
  }
  
  return '';
};

/**
 * Obtiene el número de documento de identificación
 * @param {Object} client - Objeto cliente del backend
 * @returns {string} Número de documento
 */
export const getClientDocumentNumber = (client) => {
  if (!client) return '';
  
  return client.businessRegistration || '';
};

/**
 * Formatea el tipo de cliente para mostrar
 * @param {Object} client - Objeto cliente del backend
 * @returns {string} Tipo de cliente formateado
 */
export const getClientTypeLabel = (client) => {
  if (!client || !client.clientType) return 'Sin tipo';
  
  const typeLabels = {
    'COMPANY': 'Empresa',
    'PERSONAL': 'Personal'
  };
  
  return typeLabels[client.clientType] || client.clientType;
};