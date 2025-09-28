import { API_BASE_URL } from '../config';

// Configuración base para las peticiones
const API_CONFIG = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
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

// Función para detectar el tipo de algoritmo basado en el código/texto
const detectAlgorithmType = (input) => {
  const text = input.toLowerCase();
  
  if (text.includes('selection') || text.includes('min_index') || text.includes('selección')) {
    return 'selection-sort';
  }
  if (text.includes('bubble') || text.includes('burbuja') || text.includes('swap') && text.includes('for')) {
    return 'bubble-sort';
  }
  if (text.includes('insertion') || text.includes('inserción') || text.includes('insert')) {
    return 'insertion-sort';
  }
  if (text.includes('merge') || text.includes('divide') || text.includes('conquer')) {
    return 'merge-sort';
  }
  if (text.includes('quick') || text.includes('pivot') || text.includes('partition')) {
    return 'quick-sort';
  }
  if (text.includes('binary search') || text.includes('búsqueda binaria') || text.includes('mid')) {
    return 'binary-search';
  }
  if (text.includes('fibonacci') || text.includes('fib')) {
    return 'fibonacci';
  }
  if (text.includes('factorial') || text.includes('fact')) {
    return 'factorial';
  }
  
  return 'generic';
};

// Datos mockeados para diferentes tipos de algoritmos
const getMockedAnalysis = (algorithmType, inputData) => {
  const mockData = {
    'selection-sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: 'Selection Sort realiza n-1 pasadas, y en cada pasada busca el elemento mínimo en el resto del array. Esto resulta en aproximadamente n²/2 comparaciones.',
      confidence: 0.95,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'bubble-sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: 'Bubble Sort compara elementos adyacentes e intercambia si están en orden incorrecto. En el peor caso, necesita n² comparaciones.',
      confidence: 0.92,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'insertion-sort': {
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      explanation: 'Insertion Sort inserta cada elemento en su posición correcta. En el peor caso, cada inserción requiere desplazar todos los elementos previos.',
      confidence: 0.88,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'merge-sort': {
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      explanation: 'Merge Sort divide el array recursivamente y luego combina los subarrays ordenados. La recursión tiene profundidad log n y cada nivel procesa n elementos.',
      confidence: 0.94,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'quick-sort': {
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(log n)',
      explanation: 'Quick Sort divide el array usando un pivot. En promedio, divide el problema por la mitad, resultando en O(n log n). En el peor caso puede ser O(n²).',
      confidence: 0.90,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'binary-search': {
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      explanation: 'Binary Search divide el espacio de búsqueda por la mitad en cada iteración, resultando en una complejidad logarítmica.',
      confidence: 0.98,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'fibonacci': {
      timeComplexity: 'O(2ⁿ)',
      spaceComplexity: 'O(n)',
      explanation: 'La implementación recursiva naive de Fibonacci tiene complejidad exponencial debido a los cálculos redundantes.',
      confidence: 0.85,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'factorial': {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      explanation: 'Factorial recursivo realiza n llamadas recursivas, cada una con trabajo constante.',
      confidence: 0.93,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    },
    
    'generic': {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      explanation: 'Análisis genérico basado en la estructura del código. Para un análisis más preciso, utiliza algoritmos más específicos.',
      confidence: 0.60,
      inputCode: inputData.input,
      language: inputData.language || 'python'
    }
  };

  return mockData[algorithmType] || mockData['generic'];
};

// Función principal para analizar complejidad
export const analyzeComplexity = async (data) => {
  try {
    // Simular análisis local mientras no hay backend
    const algorithmType = detectAlgorithmType(data.input);
    const baseAnalysis = getMockedAnalysis(algorithmType, data);
    
    // Simular tiempo de análisis realista
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Retornar resultado simulado completo
    const simulatedResult = {
      ...baseAnalysis,
      algorithmType: algorithmType,
      detectedAlgorithms: [algorithmType],
      analysisTime: `${(Math.random() * 2 + 1).toFixed(1)}s`,
      timestamp: new Date().toISOString(),
      inputType: data.type,
      metadata: {
        linesOfCode: data.input.split('\n').length,
        charactersCount: data.input.length,
        language: data.language || 'text',
        processingTime: Math.random() * 1500 + 500
      }
    };
    
    return simulatedResult;
    
    // Código original para cuando el backend esté disponible
    /*
    const response = await apiRequest('/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return response;
    */
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