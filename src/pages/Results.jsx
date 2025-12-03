import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import RecursiveTreeViewer from '../components/RecursiveTreeViewer';
import { getFibonacciMockData, generateFibonacciTreeData } from '../data/fibonacciMock';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisResult: initialResult, inputData } = location.state || {};
  const [analysisResult, setAnalysisResult] = useState(initialResult);

  useEffect(() => {
    if (!initialResult) {
      navigate('/analyzer', { replace: true });
    }
  }, [initialResult, navigate]);

  if (!initialResult) {
    return null;
  }

  const handleNewAnalysis = () => {
    navigate('/analyzer');
  };

  const handleNChange = (newN) => {
    // Solo actualizar si es un análisis mockeado (recursivo)
    if (inputData?.isMocked) {
      const newMockData = getFibonacciMockData(newN);
      setAnalysisResult(newMockData);
    }
  };

  const pseudocode = analysisResult.validation?.codigo_corregido || analysisResult.pseudocode || '';
  const lineCount = pseudocode ? pseudocode.split('\n').length : 0;
  const isRecursive = analysisResult.type === 'recursivo' || inputData?.isMocked;

  // Función para convertir expresiones matemáticas a LaTeX
  const parseSumToLatex = (text) => {
    if (!text) return '';
    
    // Función para limpiar paréntesis innecesarios
    const cleanParentheses = (str) => {
      str = str.trim();
      if (str.startsWith('(') && str.endsWith(')')) {
        let count = 0;
        let canRemove = true;
        for (let i = 0; i < str.length - 1; i++) {
          if (str[i] === '(') count++;
          if (str[i] === ')') count--;
          if (count === 0) {
            canRemove = false;
            break;
          }
        }
        if (canRemove) {
          return cleanParentheses(str.slice(1, -1));
        }
      }
      return str;
    };
    
    // Función para encontrar el cierre de paréntesis correcto
    const findMatchingParen = (str, startIdx) => {
      let count = 1;
      for (let i = startIdx + 1; i < str.length; i++) {
        if (str[i] === '(') count++;
        if (str[i] === ')') count--;
        if (count === 0) return i;
      }
      return -1;
    };
    
    // Función recursiva para procesar sumatorias anidadas
    const processSums = (str) => {
      let result = str;
      let changed = true;
      let iterations = 0;
      const maxIterations = 10;
      
      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;
        
        for (let i = 0; i < result.length - 4; i++) {
          if (result.substring(i, i + 4) === 'Sum(') {
            const sumStart = i;
            const firstParen = i + 3;
            let parenCount = 1;
            let commaPos = -1;
            let secondParenStart = -1;
            
            for (let j = firstParen + 1; j < result.length && parenCount > 0; j++) {
              if (result[j] === '(') parenCount++;
              if (result[j] === ')') parenCount--;
              
              if (result[j] === ',' && parenCount === 1 && commaPos === -1) {
                commaPos = j;
                for (let k = j + 1; k < result.length; k++) {
                  if (result[k] === '(') {
                    secondParenStart = k;
                    break;
                  } else if (result[k] !== ' ') {
                    break;
                  }
                }
              }
            }
            
            if (commaPos !== -1 && secondParenStart !== -1) {
              const secondParenEnd = findMatchingParen(result, secondParenStart);
              if (secondParenEnd !== -1) {
                let sumEnd = secondParenEnd + 1;
                while (sumEnd < result.length && result[sumEnd] === ' ') sumEnd++;
                if (sumEnd < result.length && result[sumEnd] === ')') {
                  sumEnd++;
                }
                
                const expression = cleanParentheses(result.substring(firstParen + 1, commaPos).trim());
                const limitsContent = result.substring(secondParenStart + 1, secondParenEnd);
                
                const limitsParts = [];
                let currentPart = '';
                let depth = 0;
                for (let c of limitsContent) {
                  if (c === '(') depth++;
                  else if (c === ')') depth--;
                  else if (c === ',' && depth === 0) {
                    limitsParts.push(currentPart.trim());
                    currentPart = '';
                    continue;
                  }
                  currentPart += c;
                }
                if (currentPart) limitsParts.push(currentPart.trim());
                
                if (limitsParts.length === 3) {
                  const variable = limitsParts[0];
                  const start = cleanParentheses(limitsParts[1]);
                  const end = cleanParentheses(limitsParts[2]);
                  
                  const latexSum = `\\sum_{${variable}=${start}}^{${end}} ${expression}`;
                  
                  result = result.substring(0, sumStart) + latexSum + result.substring(sumEnd);
                  changed = true;
                  break;
                }
              }
            }
          }
        }
      }
      
      return result;
    };
    
    try {
      let latex = processSums(text);
      
      latex = latex
        // Potencias: 2**n → 2^{n}, n**2 → n^{2}, etc.
        .replace(/(\w+)\s*\*\*\s*(\w+)/g, '$1^{$2}')
        .replace(/(\d+)\s*\*\*\s*\(([^)]+)\)/g, '$1^{$2}')
        .replace(/(\w+)\s*\*\*\s*\(([^)]+)\)/g, '$1^{$2}')
        // Multiplicación: * → \cdot (pero no dentro de **)
        .replace(/(?<!\*)\*(?!\*)/g, ' \\cdot ')
        // Funciones matemáticas
        .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
        .replace(/log\(([^)]+)\)/g, '\\log($1)')
        .replace(/ln\(([^)]+)\)/g, '\\ln($1)')
        .replace(/max\(([^)]+)\)/g, '\\max($1)')
        .replace(/min\(([^)]+)\)/g, '\\min($1)')
        // División: / → \frac{numerador}{denominador}
        .replace(/(\w+)\s*\/\s*(\w+)/g, '\\frac{$1}{$2}')
        .replace(/\s+/g, ' ')
        .trim();
      
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false
      });
    } catch (error) {
      console.error('Error rendering math:', error);
      return text;
    }
  };

  const renderMath = (expression) => {
    return parseSumToLatex(expression);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex flex-col gap-3">
            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Resultados del Análisis
            </p>
            <p className="text-[#9d9db8] text-base font-normal leading-normal">
              Análisis detallado de la complejidad temporal y espacial de su algoritmo.
            </p>
          </div>
          <button
            onClick={handleNewAnalysis}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 h-fit"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nuevo Análisis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Pseudocódigo Analizado */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  Pseudocódigo Analizado
                </h2>
                <span className="text-[#9d9db8] text-sm">
                  {lineCount} línea{lineCount !== 1 ? 's' : ''} de código
                </span>
              </div>
              <div className="rounded-xl bg-[#1c1c26] border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden">
                <MonacoEditor
                  height="400px"
                  language="plaintext"
                  value={pseudocode}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 4,
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                />
              </div>
            </div>

            {/* Costos por Línea de Código - Solo mostrar si NO es recursivo */}
            {!isRecursive && analysisResult.costs?.per_line && analysisResult.costs.per_line.length > 0 && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Costos por Línea de Código
                </h2>
                <div className="overflow-x-auto bg-[#1c1c26] rounded-xl border border-white/10">
                  <table className="min-w-full text-sm text-left text-[#9d9db8]">
                    <thead className="bg-white/5 text-xs text-white uppercase sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-3" scope="col">Línea</th>
                        <th className="px-6 py-3" scope="col">Código</th>
                        <th className="px-6 py-3" scope="col">Mejor Caso</th>
                        <th className="px-6 py-3" scope="col">Caso Promedio</th>
                        <th className="px-6 py-3" scope="col">Peor Caso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {analysisResult.costs.per_line.map((line, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'}>
                          <td className="px-6 py-4 font-mono">{line.line_number}</td>
                          <td className="px-6 py-4 font-mono text-xs max-w-xs">
                            <code className="text-[#9d9db8]">{line.code}</code>
                          </td>
                          <td className="px-6 py-4">
                            <div dangerouslySetInnerHTML={{ __html: renderMath(line.cost.best) }} />
                          </td>
                          <td className="px-6 py-4">
                            <div dangerouslySetInnerHTML={{ __html: renderMath(line.cost.avg) }} />
                          </td>
                          <td className="px-6 py-4">
                            <div dangerouslySetInnerHTML={{ __html: renderMath(line.cost.worst) }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Análisis Recursivo */}
            {isRecursive && analysisResult.solution?.recurrence && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Análisis de Recurrencia
                </h2>
                
                {/* Método Utilizado */}
                <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-primary/30">
                  <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">school</span>
                    Método de Resolución
                  </h3>
                  <p className="text-[#9d9db8] text-base">
                    {analysisResult.solution.method}
                  </p>
                </div>

                {/* Pasos de Resolución */}
                {analysisResult.solution.steps && analysisResult.solution.steps.length > 0 && (
                  <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">format_list_numbered</span>
                      Pasos de Resolución
                    </h3>
                    <div className="space-y-4">
                      {analysisResult.solution.steps.map((step, idx) => (
                        <div key={idx} className="p-4 bg-[#0D0D1A] rounded-lg border border-white/10">
                          <h4 className="text-primary font-semibold mb-2">{step.step}</h4>
                          <p className="text-[#9d9db8] text-sm mb-3">{step.explanation}</p>
                          {step.formula && (
                            <div className="p-3 bg-[#1c1c26] rounded-lg border border-primary/20">
                              <div 
                                className="text-white text-lg font-katex"
                                dangerouslySetInnerHTML={{ __html: renderMath(step.formula) }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relación de Recurrencia */}
                <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                  <h3 className="text-white font-bold text-lg mb-4">Relación de Recurrencia</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-[#0D0D1A] rounded-lg border border-white/10">
                      <p className="text-sm text-[#9d9db8] mb-2">Forma General:</p>
                      <div 
                        className="text-white text-xl font-katex"
                        dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.solution.recurrence.original) }}
                      />
                    </div>
                    <div className="p-4 bg-[#0D0D1A] rounded-lg border border-white/10">
                      <p className="text-sm text-[#9d9db8] mb-2">Casos Base:</p>
                      <div className="space-y-2">
                        {analysisResult.solution.recurrence.base_cases.map((baseCase, idx) => (
                          <div 
                            key={idx}
                            className="text-white text-lg font-katex"
                            dangerouslySetInnerHTML={{ __html: renderMath(baseCase) }}
                          />
                        ))}
                      </div>
                    </div>
                    {analysisResult.solution.recurrence.explanation && (
                      <p className="text-[#9d9db8] text-sm mt-3">
                        {analysisResult.solution.recurrence.explanation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Árbol de Recursión */}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-4">Árbol de Recursión</h3>
                  <RecursiveTreeViewer 
                    initialN={analysisResult.solution.recursive_tree?.n_value || 4}
                    initialMermaid={analysisResult.solution.recursive_tree?.mermaid}
                    totalCalls={analysisResult.solution.recursive_tree?.total_calls || 0}
                    onNChange={handleNChange}
                  />
                </div>
              </div>
            )}

            {/* Funciones de Costo Total - Solo mostrar si NO es recursivo */}
            {!isRecursive && analysisResult.solution?.exact && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Funciones de Costo Total T(n)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisResult.solution.exact.best && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <p className="text-blue-400 font-semibold mb-2">Mejor Caso</p>
                      <div 
                        className="text-white text-2xl font-katex tracking-wider"
                        dangerouslySetInnerHTML={{ __html: renderMath('T(n) = ' + analysisResult.solution.exact.best) }}
                      />
                    </div>
                  )}
                  {analysisResult.solution.exact.avg && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                      <p className="text-purple-400 font-semibold mb-2">Caso Promedio</p>
                      <div 
                        className="text-white text-2xl font-katex tracking-wider"
                        dangerouslySetInnerHTML={{ __html: renderMath('T(n) = ' + analysisResult.solution.exact.avg) }}
                      />
                    </div>
                  )}
                  {analysisResult.solution.exact.worst && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <p className="text-red-400 font-semibold mb-2">Peor Caso</p>
                      <div 
                        className="text-white text-2xl font-katex tracking-wider"
                        dangerouslySetInnerHTML={{ __html: renderMath('T(n) = ' + analysisResult.solution.exact.worst) }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Resumen del Algoritmo */}
            {analysisResult.summary && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Resumen del Algoritmo
                </h2>
                <div className="flex flex-col gap-4 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <span className="material-symbols-outlined">summarize</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">Análisis General</h3>
                  </div>
                  <p className="text-[#9d9db8] text-base font-normal leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Límites Asintóticos */}
            {analysisResult.solution?.bounds && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Límites Asintóticos
                </h2>
                <div className="flex flex-col gap-4">
                  {analysisResult.solution.bounds.omega && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/50">
                      <p className="text-sm text-green-300 mb-1">Mejor Límite (Ω)</p>
                      <div 
                        className="text-white text-3xl font-katex"
                        dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.solution.bounds.omega) }}
                      />
                    </div>
                  )}
                  {analysisResult.solution.bounds.theta && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/50">
                      <p className="text-sm text-blue-300 mb-1">Límite Ajustado (Θ)</p>
                      <div 
                        className="text-white text-3xl font-katex"
                        dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.solution.bounds.theta) }}
                      />
                    </div>
                  )}
                  {analysisResult.solution.bounds.big_o && (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/50">
                      <p className="text-sm text-purple-300 mb-1">Peor Límite (O)</p>
                      <div 
                        className="text-white text-3xl font-katex"
                        dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.solution.bounds.big_o) }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
