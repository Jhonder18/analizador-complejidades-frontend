// api.js

// Configuración base para las peticiones
const API_CONFIG = {
  // Permite sobreescribir por env en el frontend (Vite) o cae al localhost
  baseURL:
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE_URL) ||
    (typeof process !== "undefined" &&
      process.env &&
      process.env.VITE_API_BASE_URL) ||
    "http://localhost:8000/api/v2",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // 10 min porque el LLM/grafo puede tardar
  timeout: 600000,
};

// Helper para manejar respuestas HTTP
const handleResponse = async (response) => {
  // intenta parsear JSON, pero no revienta si viene vacío
  const text = await response.text().catch(() => "");
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // no es JSON, deja data vacío
  }

  if (!response.ok) {
    // Backend FastAPI suele devolver {detail: "..."} en errores
    const msg =
      data.detail ||
      data.message ||
      data.error ||
      `HTTP error! status: ${response.status}`;
    throw new Error(msg);
  }
  return data;
};

// Helper genérico para peticiones
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const config = {
    ...options,
    mode: "cors", // fuerza CORS en fetch
    cache: "no-store",
    headers: {
      ...API_CONFIG.headers,
      ...(options.headers || {}),
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const res = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return await handleResponse(res);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout - el análisis está tardando demasiado");
    }
    // Si fue un CORS/preflight o desconexión, fetch lanza "TypeError: Failed to fetch"
    if (
      error instanceof TypeError &&
      /Failed to fetch/i.test(error.message || "")
    ) {
      throw new Error(
        "No se pudo conectar con el API (CORS/servidor caído). Verifica que http://localhost:8000 esté arriba y CORS habilitado."
      );
    }
    throw error;
  }
};

// El análisis ahora se hace completamente en el backend

// Función principal para analizar complejidad
export const analyzeComplexity = async (data) => {
  const requestBody = {
    text: data?.input || data?.text || "",
    language_hint: data?.language_hint || "es",
  };

  try {
    return await apiRequest("/analyze", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error("Error analyzing complexity:", error);
    throw new Error(`Error al analizar complejidad: ${error.message}`);
  }
};

// --- Las siguientes rutas son opcionales. Si tu backend aún no las expone,
//     devolverán 404. Déjalas si piensas implementarlas; si no, bórralas. ---

export const getExamples = async () => {
  try {
    return await apiRequest("/examples");
  } catch (error) {
    console.error("Error fetching examples:", error);
    throw new Error(`Error al obtener ejemplos: ${error.message}`);
  }
};

export const getComplexityTypes = async () => {
  try {
    return await apiRequest("/complexity-types");
  } catch (error) {
    console.error("Error fetching complexity types:", error);
    throw new Error(`Error al obtener tipos de complejidad: ${error.message}`);
  }
};

export const validateCode = async (code, language) => {
  try {
    return await apiRequest("/validate", {
      method: "POST",
      body: JSON.stringify({ code, language }),
    });
  } catch (error) {
    console.error("Error validating code:", error);
    throw new Error(`Error al validar código: ${error.message}`);
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    return await apiRequest("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw new Error(`Error al enviar feedback: ${error.message}`);
  }
};

export const getAnalysisHistory = async () => {
  try {
    return await apiRequest("/history");
  } catch (error) {
    console.error("Error fetching analysis history:", error);
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
