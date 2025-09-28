import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';

const ComplexityAnalysis = ({ analysisResult }) => {
  const [selectedCase, setSelectedCase] = useState('worst');
  const { isDark } = useTheme();

  // Datos de ejemplo - en una implementación real, estos vendrían del análisis
  const getAnalysisData = () => {
    // Esto se basaría en el algoritmo detectado
    const algorithmType = analysisResult?.algorithmType || 'selection-sort';
    
    switch (algorithmType) {
      case 'selection-sort':
        return {
          pseudocode: [
            { line: 'Algoritmo SelectionSort(A[0..n-1]):', cost: '' },
            { line: 'for i = 0 to n-2 do', cost: 'C1 * n' },
            { line: '  min_index = i', cost: 'C2 * (n-1)' },
            { line: '  for j = i+1 to n-1 do', cost: 'C3 * (n² - n)/2' },
            { line: '    if A[j] < A[min_index] then', cost: 'C4 * (n² - n)/2' },
            { line: '      min_index = j', cost: 'C5 * 0 a (n² - n)/2' },
            { line: '    end if', cost: '' },
            { line: '  end for', cost: '' },
            { line: '  swap(A[i], A[min_index])', cost: 'C6 * (n-1)' },
            { line: 'end for', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = C1*n + C2*(n-1) + C3*(n²-n)/2 + C4*(n²-n)/2 + C5*0 + C6*(n-1)',
              simplified: 'T(n) = O(n²)',
              explanation: 'En el mejor caso (array ya ordenado), nunca se ejecuta la asignación min_index = j (C5=0). Sin embargo, las comparaciones siguen siendo necesarias.'
            },
            worst: {
              function: 'T(n) = C1*n + C2*(n-1) + C3*(n²-n)/2 + C4*(n²-n)/2 + C5*(n²-n)/2 + C6*(n-1)',
              simplified: 'T(n) = O(n²)',
              explanation: 'En el peor caso (array ordenado inversamente), siempre se ejecuta la asignación min_index = j en cada comparación.'
            },
            average: {
              function: 'T(n) = C1*n + C2*(n-1) + C3*(n²-n)/2 + C4*(n²-n)/2 + C5*(n²-n)/4 + C6*(n-1)',
              simplified: 'T(n) = O(n²)',
              explanation: 'En promedio, la asignación min_index = j se ejecuta aproximadamente la mitad de las veces que se realizan comparaciones.'
            }
          }
        };
      
      case 'bubble-sort':
        return {
          pseudocode: [
            { line: 'Algoritmo BubbleSort(A[0..n-1]):', cost: '' },
            { line: 'for i = 0 to n-2 do', cost: 'C1 * n' },
            { line: '  for j = 0 to n-2-i do', cost: 'C2 * (n² - n)/2' },
            { line: '    if A[j] > A[j+1] then', cost: 'C3 * (n² - n)/2' },
            { line: '      swap(A[j], A[j+1])', cost: 'C4 * 0 a (n² - n)/2' },
            { line: '    end if', cost: '' },
            { line: '  end for', cost: '' },
            { line: 'end for', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = C1*n + C2*(n²-n)/2 + C3*(n²-n)/2 + C4*0',
              simplified: 'T(n) = O(n²)',
              explanation: 'En el mejor caso (array ya ordenado), no se realizan intercambios (C4=0), pero las comparaciones son necesarias.'
            },
            worst: {
              function: 'T(n) = C1*n + C2*(n²-n)/2 + C3*(n²-n)/2 + C4*(n²-n)/2',
              simplified: 'T(n) = O(n²)',
              explanation: 'En el peor caso (array ordenado inversamente), se realizan todos los intercambios posibles.'
            },
            average: {
              function: 'T(n) = C1*n + C2*(n²-n)/2 + C3*(n²-n)/2 + C4*(n²-n)/4',
              simplified: 'T(n) = O(n²)',
              explanation: 'En promedio, se realizan aproximadamente la mitad de los intercambios posibles.'
            }
          }
        };

      case 'merge-sort':
        return {
          pseudocode: [
            { line: 'Algoritmo MergeSort(A[left..right]):', cost: '' },
            { line: 'if left < right then', cost: 'C1 * log n' },
            { line: '  mid = (left + right) / 2', cost: 'C2 * log n' },
            { line: '  MergeSort(A[left..mid])', cost: 'T(n/2)' },
            { line: '  MergeSort(A[mid+1..right])', cost: 'T(n/2)' },
            { line: '  Merge(A[left..mid..right])', cost: 'C3 * n' },
            { line: 'end if', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = 2T(n/2) + C3*n, T(1) = C1',
              simplified: 'T(n) = O(n log n)',
              explanation: 'Merge Sort siempre divide el array por la mitad, resultando en log n niveles, cada uno procesando n elementos.'
            },
            worst: {
              function: 'T(n) = 2T(n/2) + C3*n, T(1) = C1',
              simplified: 'T(n) = O(n log n)',
              explanation: 'La complejidad se mantiene constante independientemente del orden inicial de los datos.'
            },
            average: {
              function: 'T(n) = 2T(n/2) + C3*n, T(1) = C1',
              simplified: 'T(n) = O(n log n)',
              explanation: 'Merge Sort tiene complejidad estable O(n log n) en todos los casos.'
            }
          }
        };

      case 'quick-sort':
        return {
          pseudocode: [
            { line: 'Algoritmo QuickSort(A[low..high]):', cost: '' },
            { line: 'if low < high then', cost: 'C1 * profundidad' },
            { line: '  pivot = Partition(A[low..high])', cost: 'C2 * n' },
            { line: '  QuickSort(A[low..pivot-1])', cost: 'T(k)' },
            { line: '  QuickSort(A[pivot+1..high])', cost: 'T(n-k-1)' },
            { line: 'end if', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = 2T(n/2) + C2*n, T(1) = C1',
              simplified: 'T(n) = O(n log n)',
              explanation: 'En el mejor caso, el pivot divide el array exactamente por la mitad en cada recursión.'
            },
            worst: {
              function: 'T(n) = T(n-1) + C2*n, T(1) = C1',
              simplified: 'T(n) = O(n²)',
              explanation: 'En el peor caso, el pivot es siempre el elemento más pequeño o más grande, creando particiones desbalanceadas.'
            },
            average: {
              function: 'T(n) = T(n/4) + T(3n/4) + C2*n',
              simplified: 'T(n) = O(n log n)',
              explanation: 'En promedio, el pivot divide el array en proporciones razonablemente equilibradas.'
            }
          }
        };

      case 'binary-search':
        return {
          pseudocode: [
            { line: 'Algoritmo BinarySearch(A[0..n-1], target):', cost: '' },
            { line: 'left = 0, right = n-1', cost: 'C1 * 1' },
            { line: 'while left <= right do', cost: 'C2 * log n' },
            { line: '  mid = (left + right) / 2', cost: 'C3 * log n' },
            { line: '  if A[mid] == target then return mid', cost: 'C4 * log n' },
            { line: '  else if A[mid] < target then left = mid + 1', cost: 'C5 * log n' },
            { line: '  else right = mid - 1', cost: 'C6 * log n' },
            { line: 'end while', cost: '' },
            { line: 'return -1', cost: 'C7 * 1' }
          ],
          cases: {
            best: {
              function: 'T(n) = C1 + C2 + C3 + C4',
              simplified: 'T(n) = O(1)',
              explanation: 'En el mejor caso, el elemento buscado está en el centro del array y se encuentra en la primera comparación.'
            },
            worst: {
              function: 'T(n) = C1 + (C2 + C3 + C4 + C5)*log n + C7',
              simplified: 'T(n) = O(log n)',
              explanation: 'En el peor caso, se necesitan log n comparaciones para encontrar el elemento o determinar que no existe.'
            },
            average: {
              function: 'T(n) = C1 + (C2 + C3 + C4 + C5)*log n/2 + C7',
              simplified: 'T(n) = O(log n)',
              explanation: 'En promedio, se necesitan aproximadamente log n/2 comparaciones.'
            }
          }
        };

      case 'fibonacci':
        return {
          pseudocode: [
            { line: 'Algoritmo Fibonacci(n):', cost: '' },
            { line: 'if n <= 1 then', cost: 'C1 * 1' },
            { line: '  return n', cost: 'C2 * 1' },
            { line: 'else', cost: '' },
            { line: '  return Fibonacci(n-1) + Fibonacci(n-2)', cost: 'T(n-1) + T(n-2) + C3' },
            { line: 'end if', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = C1 + C2 para n ≤ 1',
              simplified: 'T(n) = O(1)',
              explanation: 'Para casos base (n ≤ 1), la función retorna inmediatamente.'
            },
            worst: {
              function: 'T(n) = T(n-1) + T(n-2) + C3, T(0) = T(1) = C1',
              simplified: 'T(n) = O(2ⁿ)',
              explanation: 'La recursión sin memoización genera un árbol binario completo, resultando en complejidad exponencial.'
            },
            average: {
              function: 'T(n) = T(n-1) + T(n-2) + C3',
              simplified: 'T(n) = O(φⁿ)',
              explanation: 'La complejidad promedio está relacionada con la proporción áurea φ ≈ 1.618, aproximadamente O(1.618ⁿ).'
            }
          }
        };

      case 'factorial':
        return {
          pseudocode: [
            { line: 'Algoritmo Factorial(n):', cost: '' },
            { line: 'if n <= 1 then', cost: 'C1 * 1' },
            { line: '  return 1', cost: 'C2 * 1' },
            { line: 'else', cost: '' },
            { line: '  return n * Factorial(n-1)', cost: 'T(n-1) + C3' },
            { line: 'end if', cost: '' }
          ],
          cases: {
            best: {
              function: 'T(n) = C1 + C2 para n ≤ 1',
              simplified: 'T(n) = O(1)',
              explanation: 'Para el caso base (n ≤ 1), la función retorna inmediatamente.'
            },
            worst: {
              function: 'T(n) = T(n-1) + C3, T(1) = C1',
              simplified: 'T(n) = O(n)',
              explanation: 'Se realizan n llamadas recursivas, cada una con trabajo constante.'
            },
            average: {
              function: 'T(n) = T(n-1) + C3',
              simplified: 'T(n) = O(n)',
              explanation: 'La complejidad es siempre lineal independientemente del valor específico de n.'
            }
          }
        };
      
      default:
        return {
          pseudocode: [
            { line: 'Algoritmo Genérico Detectado:', cost: '' },
            { line: 'Analizando estructura del código...', cost: 'Variable' },
            { line: 'Detectando bucles y recursiones...', cost: 'Variable' },
            { line: 'Calculando complejidad aproximada...', cost: 'Variable' }
          ],
          cases: {
            best: {
              function: `T(n) = ${analysisResult?.timeComplexity || 'O(n)'}`,
              simplified: analysisResult?.timeComplexity || 'O(n)',
              explanation: 'Análisis automático basado en la estructura del código proporcionado. Para obtener un análisis más detallado, utiliza algoritmos específicos conocidos.'
            },
            worst: {
              function: `T(n) = ${analysisResult?.timeComplexity || 'O(n)'}`,
              simplified: analysisResult?.timeComplexity || 'O(n)',
              explanation: 'El análisis genérico proporciona una estimación basada en patrones de código detectados automáticamente.'
            },
            average: {
              function: `T(n) = ${analysisResult?.timeComplexity || 'O(n)'}`,
              simplified: analysisResult?.timeComplexity || 'O(n)',
              explanation: 'Para un análisis más preciso de casos promedio, se recomienda especificar el tipo de algoritmo o proporcionar más contexto.'
            }
          }
        };
    }
  };

  const analysisData = getAnalysisData();
  const currentCase = analysisData.cases[selectedCase];

  // Convertir pseudocódigo a formato para Monaco Editor
  const getPseudocodeText = () => {
    return analysisData.pseudocode
      .map(line => {
        if (line.cost) {
          return `${line.line.padEnd(40)} // ${line.cost}`;
        }
        return line.line;
      })
      .join('\n');
  };

  // Mostrar código original si está disponible
  const getOriginalCode = () => {
    return analysisResult?.inputCode || analysisResult?.code || `// Código original no disponible
// El análisis se basa en la detección automática del algoritmo`;
  };

  const getCodeLanguage = () => {
    return analysisResult?.language || 'javascript';
  };

  return (
    <div className="complexity-analysis">
      <div className="analysis-header">
        <h3>Análisis Completo de Complejidad</h3>
        <p>Pseudocódigo con costos por línea y funciones de eficiencia</p>
      </div>

      {/* Código Original */}
      <div className="original-code-section">
        <h4>Código Analizado</h4>
        <div className="code-editor-container">
          <MonacoEditor
            height="200px"
            language={getCodeLanguage()}
            value={getOriginalCode()}
            theme={isDark ? "vs-dark" : "vs-light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
              },
              automaticLayout: true,
              wordWrap: 'on',
              tabSize: 2,
              renderLineHighlight: 'none',
              selectOnLineNumbers: false,
              mouseWheelZoom: false,
              contextmenu: false
            }}
          />
        </div>
      </div>

      {/* Pseudocódigo con costos */}
      <div className="pseudocode-section">
        <h4>Pseudocódigo con Análisis de Costos</h4>
        <div className="pseudocode-editor-container">
          <MonacoEditor
            height="300px"
            language="plaintext"
            value={getPseudocodeText()}
            theme={isDark ? "vs-dark" : "vs-light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
              },
              automaticLayout: true,
              wordWrap: 'off',
              tabSize: 2,
              renderLineHighlight: 'none',
              selectOnLineNumbers: false,
              mouseWheelZoom: false,
              contextmenu: false,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              lineHeight: 22
            }}
          />
        </div>
        <div className="pseudocode-legend">
          <p><strong>Leyenda:</strong> Las líneas muestran el pseudocódigo seguido de su costo computacional (// Costo)</p>
        </div>
      </div>

      {/* Selector de casos */}
      <div className="case-selector">
        <h4>Análisis por Casos</h4>
        <div className="case-tabs">
          <button 
            className={`case-tab ${selectedCase === 'best' ? 'active' : ''}`}
            onClick={() => setSelectedCase('best')}
          >
            Mejor Caso
          </button>
          <button 
            className={`case-tab ${selectedCase === 'worst' ? 'active' : ''}`}
            onClick={() => setSelectedCase('worst')}
          >
            Peor Caso
          </button>
          <button 
            className={`case-tab ${selectedCase === 'average' ? 'active' : ''}`}
            onClick={() => setSelectedCase('average')}
          >
            Caso Promedio
          </button>
        </div>
      </div>

      {/* Análisis del caso seleccionado */}
      <div className="case-analysis">
        <div className="case-content">
          <div className="efficiency-function">
            <h5>Función de Eficiencia</h5>
            <div className="function-formula">
              <code>{currentCase.function}</code>
            </div>
          </div>

          <div className="simplified-complexity">
            <h5>Complejidad Simplificada</h5>
            <div className="complexity-result">
              <span className="complexity-notation">{currentCase.simplified}</span>
            </div>
          </div>

          <div className="case-explanation">
            <h5>Justificación</h5>
            <p>{currentCase.explanation}</p>
          </div>
        </div>
      </div>

      {/* Resumen comparativo */}
      <div className="complexity-summary">
        <h4>Resumen Comparativo</h4>
        <div className="summary-table">
          <div className="summary-header">
            <div>Caso</div>
            <div>Complejidad Temporal</div>
            <div>Complejidad Espacial</div>
          </div>
          <div className="summary-row">
            <div>Mejor</div>
            <div>{analysisData.cases.best.simplified}</div>
            <div>{analysisResult?.spaceComplexity || 'O(1)'}</div>
          </div>
          <div className="summary-row">
            <div>Peor</div>
            <div>{analysisData.cases.worst.simplified}</div>
            <div>{analysisResult?.spaceComplexity || 'O(1)'}</div>
          </div>
          <div className="summary-row">
            <div>Promedio</div>
            <div>{analysisData.cases.average.simplified}</div>
            <div>{analysisResult?.spaceComplexity || 'O(1)'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityAnalysis;