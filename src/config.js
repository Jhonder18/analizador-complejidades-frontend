// Configuración de la aplicación

// URL del backend - cambiar según el entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Configuración de desarrollo vs producción
const IS_DEVELOPMENT = import.meta.env.DEV;
const IS_PRODUCTION = import.meta.env.PROD;

// Configuraciones de la aplicación
export const APP_CONFIG = {
  name: 'Analizador de Complejidades',
  version: '1.0.0',
  description: 'Herramienta para analizar la complejidad temporal y espacial de algoritmos',
  author: 'Proyecto Universitario - Algoritmos',
};

// URLs y endpoints
export { API_BASE_URL };

// Configuración de timeouts
export const TIMEOUT_CONFIG = {
  API_TIMEOUT: 30000, // 30 segundos
  DEBOUNCE_DELAY: 500, // 500ms para debounce en inputs
};

// Configuración de la UI
export const UI_CONFIG = {
  EDITOR: {
    DEFAULT_TAB: 'natural',
    MAX_INPUT_LENGTH: 10000,
    PLACEHOLDER: {
      NATURAL: 'Describe tu algoritmo en lenguaje natural...',
      CODE: 'Escribe tu código aquí...',
    },
  },
  
  ANALYSIS: {
    MAX_RESULTS_DISPLAY: 10,
    DEFAULT_LANGUAGE: 'python',
    SUPPORTED_LANGUAGES: ['python', 'javascript', 'java', 'cpp', 'c'],
  },
  
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
};

// Temas y estilos
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark'],
};

// Configuración de análisis
export const ANALYSIS_CONFIG = {
  COMPLEXITY_TYPES: [
    'O(1)',
    'O(log n)',
    'O(n)',
    'O(n log n)',
    'O(n²)',
    'O(n³)',
    'O(2^n)',
    'O(n!)',
  ],
  
  SUPPORTED_ALGORITHMS: [
    'linear_search',
    'binary_search',
    'bubble_sort',
    'selection_sort',
    'insertion_sort',
    'merge_sort',
    'quick_sort',
    'heap_sort',
    'dfs',
    'bfs',
    'dijkstra',
  ],
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  ENABLE_LOGGING: IS_DEVELOPMENT,
  MOCK_API_CALLS: false, // Cambiar a true para usar datos mock
  SHOW_DEBUG_INFO: IS_DEVELOPMENT,
};

// URLs externas y recursos
export const EXTERNAL_LINKS = {
  DOCUMENTATION: '/docs',
  GITHUB_REPO: 'https://github.com/tu-usuario/analizador-complejidades',
  UNIVERSITY: '#',
  CONTACT_EMAIL: 'contacto@ejemplo.com',
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor verifica tu conexión a internet.',
  API_ERROR: 'Error en el servidor. Por favor intenta nuevamente.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  TIMEOUT_ERROR: 'La operación ha tardado demasiado. Por favor intenta nuevamente.',
  EMPTY_INPUT: 'Por favor ingresa código o descripción para analizar.',
  INVALID_CODE: 'El código ingresado no es válido.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Análisis completado exitosamente.',
  CODE_VALIDATED: 'Código validado correctamente.',
  FEEDBACK_SENT: 'Feedback enviado correctamente.',
};

// Configuración de localStorage keys
export const STORAGE_KEYS = {
  THEME: 'complexity_analyzer_theme',
  LAST_ANALYSIS: 'complexity_analyzer_last_analysis',
  USER_PREFERENCES: 'complexity_analyzer_preferences',
  ANALYSIS_HISTORY: 'complexity_analyzer_history',
};

// Configuración de métricas y analytics (si se implementa)
export const ANALYTICS_CONFIG = {
  ENABLED: IS_PRODUCTION,
  TRACK_ANALYSIS: true,
  TRACK_NAVIGATION: true,
  TRACK_ERRORS: true,
};

// Función helper para obtener configuración según entorno
export const getConfig = () => {
  return {
    apiBaseUrl: API_BASE_URL,
    isDevelopment: IS_DEVELOPMENT,
    isProduction: IS_PRODUCTION,
    ...APP_CONFIG,
    ...UI_CONFIG,
    ...TIMEOUT_CONFIG,
  };
};

// Export por defecto con toda la configuración
export default {
  APP_CONFIG,
  API_BASE_URL,
  TIMEOUT_CONFIG,
  UI_CONFIG,
  THEME_CONFIG,
  ANALYSIS_CONFIG,
  DEV_CONFIG,
  EXTERNAL_LINKS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ANALYTICS_CONFIG,
  getConfig,
};