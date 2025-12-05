// Función para generar el árbol de recursión de Fibonacci en formato Mermaid
const generateFibonacciTree = (n) => {
  let nodeCounter = 0;
  const nodes = [];
  const edges = [];
  
  const generateNode = (value, parentId = null) => {
    nodeCounter++;
    const nodeId = `n${value}_${nodeCounter}`;
    nodes.push(`    ${nodeId}["F(${value})"]`);
    
    if (parentId) {
      edges.push(`    ${parentId} --> ${nodeId}`);
    }
    
    if (value > 1) {
      generateNode(value - 1, nodeId);
      generateNode(value - 2, nodeId);
    }
    
    return nodeId;
  };
  
  const rootId = generateNode(n);
  
  // Construir el diagrama Mermaid
  const mermaidCode = `graph TD\n${nodes.join('\n')}\n${edges.join('\n')}`;
  
  // Calcular total de llamadas
  const calculateCalls = (val) => {
    if (val <= 1) return 1;
    return calculateCalls(val - 1) + calculateCalls(val - 2) + 1;
  };
  
  return {
    mermaid: mermaidCode,
    calls: calculateCalls(n)
  };
};

// Exportar también la función para regenerar el árbol
export const generateFibonacciTreeData = generateFibonacciTree;

// Mock data para el análisis de Fibonacci recursivo
export const getFibonacciMockData = (n = 4) => {
  return {
    nl_description: "Algoritmo recursivo de Fibonacci",
    pseudocode: `fibonacci(n)
begin
    if (n <= 1) then
    begin
        return n
    end
    else
    begin
        return fibonacci(n-1) + fibonacci(n-2)
    end
end`,
    mode: "recursivo",
    ast: [
      {
        "fibonacci": {
          "variables": [["n", ""]],
          "code": {
            "if:n <= 1": {
              "return": "n"
            },
            "else": {
              "return": "fibonacci(n-1) + fibonacci(n-2)"
            }
          }
        }
      }
    ],
    result: "## Resumen Ejecutivo\n\nEl algoritmo de Fibonacci calcula el n-ésimo número de la secuencia de Fibonacci de forma recursiva. Cada llamada genera dos llamadas recursivas adicionales, resultando en un árbol binario de llamadas.\n\n## Análisis de Complejidad\n\nLa complejidad temporal es exponencial O(2^n) debido a que cada llamada genera dos subproblemas. La complejidad espacial es O(n) debido a la profundidad máxima de la pila de recursión.",
    ecuaciones: {
      big_O_temporal: "-n**2/2 + n*(n - 1) + n/2",
      big_Theta_temporal: "-n**2/2 + n*(n - 1) + n/2",
      big_Omega_temporal: "-n**2/2 + n*(n - 1) + n/2"
    },
    notation: {
      big_O_temporal: "O(n²)",
      big_O_espacial: "O(1)",
      big_Theta_temporal: "Θ(n²)",
      big_Theta_espacial: "Θ(1)",
      big_Omega_temporal: "Ω(n)",
      big_Omega_espacial: "Ω(1)"
    },
    solution: {
      method: "Teorema Maestro (Forma General)",
      steps: [
        {
          step: "Paso 1: Identificar la relación de recurrencia",
          explanation: "La función Fibonacci hace dos llamadas recursivas: T(n-1) y T(n-2), más una operación constante O(1) para la suma.",
          formula: "T(n) = T(n-1) + T(n-2) + O(1)"
        },
        {
          step: "Paso 2: Analizar el árbol de recursión",
          explanation: "Cada llamada genera dos subproblemas, formando un árbol binario. La altura del árbol es n, y en el peor nivel hay aproximadamente 2^n nodos.",
          formula: "Altura = n, Nodos por nivel ≈ 2^i"
        },
        {
          step: "Paso 3: Sumar el trabajo en todos los niveles",
          explanation: "El trabajo en cada nivel i es O(2^i). Sumando todos los niveles desde 0 hasta n obtenemos una serie geométrica.",
          formula: "T(n) = Sum(2**i, i=0, n) = O(2**n)"
        },
        {
          step: "Paso 4: Conclusión",
          explanation: "La complejidad temporal de Fibonacci recursivo es exponencial debido a la duplicación de llamadas en cada nivel del árbol de recursión.",
          formula: "T(n) = O(2**n)"
        }
      ],
      recurrence: {
        original: "T(n) = T(n-1) + T(n-2) + O(1)",
        base_cases: [
          "T(0) = O(1)",
          "T(1) = O(1)"
        ],
        explanation: "La función realiza dos llamadas recursivas con tamaños n-1 y n-2, más una operación constante para la suma."
      },
      recursive_tree: {
        n_value: n,
        mermaid: generateFibonacciTree(n).mermaid,
        total_calls: generateFibonacciTree(n).calls
      }
    }
  };
};

// Detectar si el código es Fibonacci
export const isFibonacciCode = (code) => {
  const normalizedCode = code.toLowerCase().replace(/\s+/g, ' ');
  
  // Patrones que indican Fibonacci
  const patterns = [
    /fibonacci/,
    /(n\s*-\s*1).*\+.*(n\s*-\s*2)/,
    /(n\s*-\s*2).*\+.*(n\s*-\s*1)/,
    /return.*fibonacci.*\+.*fibonacci/
  ];
  
  return patterns.some(pattern => pattern.test(normalizedCode));
};
