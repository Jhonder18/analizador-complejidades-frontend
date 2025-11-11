// Configuración base para las peticiones
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 segundos para análisis complejos
};

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Función helper para hacer peticiones HTTP
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - el análisis está tardando demasiado');
    }
    throw error;
  }
};

// El análisis ahora se hace completamente en el backend

// Función principal para analizar complejidad
export const analyzeComplexity = async (data) => {
  try {
    const requestBody = {
      text: data.input || data.text,
      language_hint: data.language_hint || 'es'
    };

    const response = await apiRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    
    return response;
  } catch (error) {
    console.error('Error analyzing complexity:', error);
    throw new Error(`Error al analizar complejidad: ${error.message}`);
  }
};

// Función para obtener ejemplos de algoritmos
export const getExamples = async () => {
  try {
    const response = await apiRequest('/examples');
    return response;
  } catch (error) {
    console.error('Error fetching examples:', error);
    throw new Error(`Error al obtener ejemplos: ${error.message}`);
  }
};

// Función para obtener información sobre tipos de complejidad
export const getComplexityTypes = async () => {
  try {
    const response = await apiRequest('/complexity-types');
    return response;
  } catch (error) {
    console.error('Error fetching complexity types:', error);
    throw new Error(`Error al obtener tipos de complejidad: ${error.message}`);
  }
};

// Función para validar código antes del análisis
export const validateCode = async (code, language) => {
  try {
    const response = await apiRequest('/validate', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
    
    return response;
  } catch (error) {
    console.error('Error validating code:', error);
    throw new Error(`Error al validar código: ${error.message}`);
  }
};

// Función para reportar problemas o feedback
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
    
    return response;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(`Error al enviar feedback: ${error.message}`);
  }
};

// Función para obtener historial de análisis (si se implementa)
export const getAnalysisHistory = async () => {
  try {
    const response = await apiRequest('/history');
    return response;
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw new Error(`Error al obtener historial: ${error.message}`);
  }
};

export default {
  analyzeComplexity,
  getExamples,
  getComplexityTypes,
  validateCode,
  submitFeedback,
  getAnalysisHistory,
};