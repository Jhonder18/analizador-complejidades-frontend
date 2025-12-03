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
    validation: {
      is_valid: true,
      codigo_corregido: `fibonacci(n)
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
      cambios: []
    },
    summary: "El algoritmo de Fibonacci calcula el n-ésimo número de la secuencia de Fibonacci de forma recursiva. Cada llamada genera dos llamadas recursivas adicionales, resultando en un árbol binario de llamadas.",
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
      exact: {
        best: "n",
        avg: "2**n",
        worst: "2**n"
      },
      bounds: {
        omega: "2**(n/2)",
        theta: "2**n",
        big_o: "2**n"
      },
      recursive_tree: {
        n_value: n,
        mermaid: generateFibonacciTree(n).mermaid,
        total_calls: generateFibonacciTree(n).calls
      }
    },
    type: "recursivo"
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
