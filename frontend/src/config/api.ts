// Configuración centralizada para las URLs del API
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://ciudadguaricor.onrender.com/api' // Cambiar por la URL de producción
  : 'http://localhost:3000';

export { API_BASE_URL };

// Helper para crear URLs completas del API
export const createApiUrl = (endpoint: string) => {
  // Asegurar que el endpoint comience con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
