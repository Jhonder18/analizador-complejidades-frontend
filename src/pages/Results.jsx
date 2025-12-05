import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import katex from 'katex';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import RecursiveTreeViewer from '../components/RecursiveTreeViewer';

// Inicializar Mermaid para tema oscuro
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#fff',
    primaryBorderColor: '#818cf8',
    lineColor: '#6b7280',
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#312e81',
    background: '#0f0f23',
    mainBkg: '#1e1b4b',
    secondBkg: '#312e81',
    textColor: '#e0e7ff',
    fontSize: '12px',
    nodeTextColor: '#fff'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 20,
    nodeSpacing: 50,
    rankSpacing: 60
  }
});

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysisResult: initialResult, inputData } = location.state || {};
  const [analysisResult, setAnalysisResult] = useState(initialResult);
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (!initialResult) {
      navigate('/analyzer', { replace: true });
    }
  }, [initialResult, navigate]);

  // Renderizar diagrama Mermaid cuando esté disponible
  useEffect(() => {
    const renderMermaidDiagram = async () => {
      const diagram = analysisResult?.mermaid_diagram || analysisResult?.recursion_tree?.mermaid_diagram;
      if (diagram && mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = '';
          const id = `mermaid-${Date.now()}`;
          const { svg } = await mermaid.render(id, diagram);
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          mermaidRef.current.innerHTML = '<p class="text-red-400 p-4">Error al renderizar el diagrama</p>';
        }
      }
    };
    
    if (analysisResult) {
      renderMermaidDiagram();
    }
  }, [analysisResult]);

  if (!initialResult) {
    return null;
  }

  const handleNewAnalysis = () => {
    navigate('/analyzer');
  };

  // Handler para cambio de N en el árbol recursivo (para el componente legacy)
  const handleNChange = (newN) => {
    console.log('N changed to:', newN);
    // En la versión actual, el árbol se renderiza en el servidor
    // Este handler puede usarse para futuras implementaciones interactivas
  };

  const pseudocode = analysisResult.pseudocode || '';
  const lineCount = pseudocode ? pseudocode.split('\n').filter(l => l.trim()).length : 0;
  const isRecursive = analysisResult.mode === 'recursivo' || 
                      analysisResult.recurrence || 
                      analysisResult.recursion_tree;

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
    
    // Función recursiva para procesar sumatorias anidadas (de adentro hacia afuera)
    const processSums = (str) => {
      let result = str;
      let maxIterations = 20;
      
      for (let iteration = 0; iteration < maxIterations; iteration++) {
        let found = false;
        
        // Buscar la sumatoria más interna (sin otras sumatorias en su expresión)
        for (let i = result.length - 1; i >= 0; i--) {
          if (result.substring(i, i + 4).toLowerCase() === 'sum(') {
            const sumStart = i;
            const contentStart = i + 4;
            
            // Encontrar el cierre del paréntesis
            const closingParen = findMatchingParen(result, contentStart - 1);
            
            if (closingParen === -1) continue;
            
            const fullContent = result.substring(contentStart, closingParen);
            
            // Verificar si esta sumatoria no contiene otras sumatorias
            if (fullContent.toLowerCase().includes('sum(')) continue;
            
            // Dividir argumentos por comas respetando paréntesis
            const args = [];
            let currentArg = '';
            let depth = 0;
            
            for (let c of fullContent) {
              if (c === '(') depth++;
              else if (c === ')') depth--;
              
              if (c === ',' && depth === 0) {
                args.push(currentArg.trim());
                currentArg = '';
              } else {
                currentArg += c;
              }
            }
            if (currentArg) args.push(currentArg.trim());
            
            // Puede venir en dos formatos:
            // Formato 1: sum(expresión, variable, inicio, fin)
            // Formato 2: sum(expresión, (variable, inicio, fin))
            let expression, variable, start, end;
            
            if (args.length === 4) {
              // Formato 1: sum(expr, var, inicio, fin)
              expression = cleanParentheses(args[0]);
              variable = cleanParentheses(args[1]);
              start = cleanParentheses(args[2]);
              end = cleanParentheses(args[3]);
            } else if (args.length === 2) {
              // Formato 2: sum(expr, (var, inicio, fin))
              expression = cleanParentheses(args[0]);
              const limitsStr = cleanParentheses(args[1]);
              const limits = limitsStr.split(',').map(s => s.trim());
              if (limits.length === 3) {
                variable = cleanParentheses(limits[0]);
                start = cleanParentheses(limits[1]);
                end = cleanParentheses(limits[2]);
              }
            }
            
            if (expression && variable && start && end) {
              // Generar LaTeX
              const latexSum = `\\sum_{${variable}=${start}}^{${end}} \\left(${expression}\\right)`;
              
              // Reemplazar
              result = result.substring(0, sumStart) + latexSum + result.substring(closingParen + 1);
              found = true;
              break;
            }
          }
        }
        
        // Si no encontramos más sumatorias, terminar
        if (!found) break;
      }
      
      return result;
    };
    
    try {
      let latex = processSums(text);
      
      // Manejar subíndices especiales como T(sub b)urbuja
      // Buscar patrón: letra(sub x)texto → letra_{xtexto}
      const subPattern = /(\w+)\(sub\s+(\w+)\)(\w+)/gi;
      latex = latex.replace(subPattern, (match, base, subChar, restText) => {
        return `${base}_{${subChar}${restText}}`;
      });
      
      latex = latex
        // Subíndices normales: variable(sub texto) → variable_{texto}
        .replace(/(\w+)\(sub\s+([^)]+)\)/gi, '$1_{$2}')
        // Convertir subíndices sin llaves a formato con llaves: T_burbuja → T_{burbuja}
        .replace(/(\w+)_([a-zA-Z]{2,})/g, '$1_{$2}')
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
        displayMode: true
      });
    } catch (error) {
      console.error('Error rendering math:', error);
      return text;
    }
  };

  const renderMath = (expression) => {
    console.log('Original expression:', expression);
    const result = parseSumToLatex(expression);
    console.log('Rendered result:', result);
    return result;
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
            {!isRecursive && analysisResult.costos_peor && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Costos por Línea de Código
                </h2>
                <div className="overflow-x-auto bg-[#1c1c26] rounded-xl border border-white/10">
                  <table className="min-w-full text-sm text-left text-[#9d9db8]">
                    <thead className="bg-white/5 text-xs text-white uppercase sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-3 w-20" scope="col">Instrucción</th>
                        <th className="px-6 py-3" scope="col">Código</th>
                        <th className="px-6 py-3" scope="col">Mejor Caso</th>
                        <th className="px-6 py-3" scope="col">Peor Caso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {analysisResult.costos_peor.lineas.map((linea, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'hover:bg-white/5' : 'bg-white/5 hover:bg-white/10'}>
                          <td className="px-6 py-4 font-mono text-center">{idx + 1}</td>
                          <td className="px-6 py-4 font-mono text-xs">
                            <code className="text-[#9d9db8] whitespace-pre-wrap break-words">{linea}</code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm" dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.costos_mejor?.costos[idx] || '0') }} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm" dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.costos_peor.costos[idx]) }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Análisis Recursivo - Usando estructura real del backend */}
            {isRecursive && analysisResult.recurrence && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Análisis de Recurrencia
                </h2>
                
                {/* Ecuación de Recurrencia */}
                <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-primary/30">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">functions</span>
                    Ecuación de Recurrencia
                  </h3>
                  <div className="p-4 bg-[#0D0D1A] rounded-lg border border-white/10 mb-4">
                    <div 
                      className="text-white text-xl font-katex text-center"
                      dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.recurrence.raw) }}
                    />
                  </div>
                  
                  {/* Casos Base */}
                  {analysisResult.recurrence.base_cases && analysisResult.recurrence.base_cases.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-[#9d9db8] mb-2">Casos Base:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.recurrence.base_cases.map((bc, idx) => (
                          <div key={idx} className="px-4 py-2 bg-[#0D0D1A] rounded-lg border border-white/10">
                            <span className="text-white text-lg">{bc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Clasificación */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium">
                      {analysisResult.recurrence.classification}
                    </span>
                    {analysisResult.recurrence.parameters?.recurrence_type && (
                      <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium capitalize">
                        {analysisResult.recurrence.parameters.recurrence_type.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Método de Resolución */}
                {analysisResult.recurrence.methods_tried && analysisResult.recurrence.methods_tried.length > 0 && (
                  <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">school</span>
                      Método: {analysisResult.recurrence.best_method?.replace(/_/g, ' ').toUpperCase()}
                    </h3>
                    
                    {analysisResult.recurrence.methods_tried.filter(m => m.applicable).map((method, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="space-y-2">
                          {method.steps.map((step, stepIdx) => (
                            <div key={stepIdx} className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10 flex items-start gap-3">
                              <span className="text-primary font-bold text-sm mt-0.5">{stepIdx + 1}.</span>
                              <p className="text-[#9d9db8] text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-400">check_circle</span>
                          <div>
                            <span className="text-green-300 text-sm">Resultado:</span>
                            <span className="text-green-400 font-bold text-lg ml-2">{method.result}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Solución Final */}
                {analysisResult.recurrence.final_solution && (
                  <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30">
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-400">verified</span>
                      Solución Final
                    </h3>
                    <div className="text-center">
                      <span className="text-green-400 text-3xl font-bold">{analysisResult.recurrence.final_solution}</span>
                    </div>
                  </div>
                )}

                {/* Árbol de Recursión por Niveles */}
                {analysisResult.recursion_tree && (
                  <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">account_tree</span>
                      Árbol de Recursión
                    </h3>
                    
                    {/* Estadísticas del árbol */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10 text-center">
                        <p className="text-xs text-[#9d9db8] mb-1">Altura</p>
                        <p className="text-white font-bold">{analysisResult.recursion_tree.height}</p>
                      </div>
                      <div className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10 text-center">
                        <p className="text-xs text-[#9d9db8] mb-1">Total Nodos</p>
                        <p className="text-white font-bold text-sm">{analysisResult.recursion_tree.total_nodes}</p>
                      </div>
                      <div className="p-3 bg-primary/20 rounded-lg border border-primary/30 text-center">
                        <p className="text-xs text-primary/80 mb-1">Costo Total</p>
                        <p className="text-primary font-bold">{analysisResult.recursion_tree.total_cost}</p>
                      </div>
                    </div>
                    
                    {/* Tabla de niveles */}
                    {analysisResult.recursion_tree.levels && (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full text-sm text-left text-[#9d9db8]">
                          <thead className="bg-white/5 text-xs text-white uppercase">
                            <tr>
                              <th className="px-4 py-2">Nivel</th>
                              <th className="px-4 py-2"># Nodos</th>
                              <th className="px-4 py-2">Tamaño</th>
                              <th className="px-4 py-2">Costo/Nodo</th>
                              <th className="px-4 py-2">Costo Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {analysisResult.recursion_tree.levels.map((level, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? '' : 'bg-white/5'}>
                                <td className="px-4 py-2 font-mono text-primary">{level.level}</td>
                                <td className="px-4 py-2 font-mono">{level.num_nodes}</td>
                                <td className="px-4 py-2 font-mono">{level.problem_size}</td>
                                <td className="px-4 py-2 font-mono">{level.cost_per_node}</td>
                                <td className="px-4 py-2 font-mono text-blue-400">{level.total_level_cost}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {/* Diagrama Mermaid */}
                    <div className="mt-4">
                      <p className="text-sm text-[#9d9db8] mb-2">Visualización del Árbol:</p>
                      <div 
                        ref={mermaidRef} 
                        className="bg-[#0D0D1A] rounded-lg border border-white/10 p-4 overflow-x-auto min-h-[200px] flex items-center justify-center"
                      >
                        <p className="text-gray-500">Cargando diagrama...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Análisis de Espacio */}
                {analysisResult.space_analysis && (
                  <div className="mb-6 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">memory</span>
                      Análisis de Espacio
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10">
                        <p className="text-xs text-[#9d9db8] mb-1">Profundidad Recursión</p>
                        <p className="text-white font-bold">{analysisResult.space_analysis.recursion_depth}</p>
                      </div>
                      <div className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10">
                        <p className="text-xs text-[#9d9db8] mb-1">Tamaño Stack Frame</p>
                        <p className="text-white font-bold">{analysisResult.space_analysis.stack_frame_size}</p>
                      </div>
                      <div className="p-3 bg-[#0D0D1A] rounded-lg border border-white/10">
                        <p className="text-xs text-[#9d9db8] mb-1">Espacio Auxiliar</p>
                        <p className="text-white font-bold">{analysisResult.space_analysis.auxiliary_space}</p>
                      </div>
                      <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                        <p className="text-xs text-purple-300 mb-1">Espacio Total</p>
                        <p className="text-purple-400 font-bold">{analysisResult.space_analysis.total_space}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Razonamiento Detallado */}
                {analysisResult.razonamiento && analysisResult.razonamiento.length > 0 && (
                  <div className="mb-6">
                    <details className="p-6 rounded-xl bg-[#1c1c26] border border-white/10">
                      <summary className="text-white font-bold text-lg cursor-pointer flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">psychology</span>
                        Ver Razonamiento Completo
                      </summary>
                      <div className="mt-4 p-4 bg-[#0D0D1A] rounded-lg border border-white/10 font-mono text-sm max-h-80 overflow-y-auto">
                        {analysisResult.razonamiento.map((linea, idx) => {
                          // Colorear según el tipo de línea
                          let className = "text-[#9d9db8]";
                          if (linea.includes('═══')) className = "text-primary font-bold mt-2";
                          else if (linea.startsWith('✓')) className = "text-green-400";
                          else if (linea.startsWith('•')) className = "text-blue-400 ml-4";
                          else if (linea.startsWith('→')) className = "text-yellow-400";
                          else if (linea.includes('---')) className = "text-purple-400 font-semibold";
                          
                          return (
                            <p key={idx} className={className}>
                              {linea || '\u00A0'}
                            </p>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}

            {/* Análisis Recursivo Legacy - Para datos mockeados o estructura vieja */}
            {isRecursive && !analysisResult.recurrence && analysisResult.solution?.recurrence && (
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

            {/* Sumatorias y Ecuaciones - Solo mostrar si NO es recursivo */}
            {!isRecursive && analysisResult.sumatoria && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Sumatoria de Complejidad
                </h2>
                <div className="p-6 rounded-xl bg-[#1c1c26] border border-primary/30">
                  <div 
                    className="text-white text-2xl font-katex tracking-wider text-center"
                    dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.sumatoria) }}
                  />
                </div>
              </div>
            )}

            {/* Ecuaciones Resueltas */}
            {!isRecursive && analysisResult.ecuaciones && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Ecuaciones Resueltas
                </h2>
                <div className="space-y-4">
                  {/* Mejor Caso */}
                  {analysisResult.ecuaciones.big_Omega_temporal && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-green-500/30">
                      <h3 className="text-green-400 font-bold text-lg mb-3">Mejor Caso (Ω)</h3>
                      <div className="p-4 bg-[#0D0D1A] rounded-lg">
                        <div className="text-white text-lg" dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.ecuaciones.big_Omega_temporal) }} />
                      </div>
                    </div>
                  )}
                  {/* Caso Promedio */}
                  {analysisResult.ecuaciones.big_Theta_temporal && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-blue-500/30">
                      <h3 className="text-blue-400 font-bold text-lg mb-3">Caso Promedio (Θ)</h3>
                      <div className="p-4 bg-[#0D0D1A] rounded-lg">
                        <div className="text-white text-lg" dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.ecuaciones.big_Theta_temporal) }} />
                      </div>
                    </div>
                  )}
                  {/* Peor Caso */}
                  {analysisResult.ecuaciones.big_O_temporal && (
                    <div className="p-6 rounded-xl bg-[#1c1c26] border border-purple-500/30">
                      <h3 className="text-purple-400 font-bold text-lg mb-3">Peor Caso (O)</h3>
                      <div className="p-4 bg-[#0D0D1A] rounded-lg">
                        <div className="text-white text-lg" dangerouslySetInnerHTML={{ __html: renderMath(analysisResult.ecuaciones.big_O_temporal) }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Notación Asintótica */}
            {analysisResult.notation && (
              <div>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
                  Notación Asintótica
                </h2>
                <div className="space-y-6">
                  {/* Complejidad Temporal */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-3">Temporal</h3>
                    <div className="flex flex-col gap-3">
                      {analysisResult.notation?.big_Omega_temporal && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/50">
                          <p className="text-sm text-green-300 mb-1">Mejor Caso (Ω)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_Omega_temporal}
                          </div>
                        </div>
                      )}
                      {analysisResult.notation?.big_Theta_temporal && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/50">
                          <p className="text-sm text-blue-300 mb-1">Caso Promedio (Θ)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_Theta_temporal}
                          </div>
                        </div>
                      )}
                      {analysisResult.notation?.big_O_temporal && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/50">
                          <p className="text-sm text-purple-300 mb-1">Peor Caso (O)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_O_temporal}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Complejidad Espacial */}
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-3">Espacial</h3>
                    <div className="flex flex-col gap-3">
                      {analysisResult.notation?.big_Omega_espacial && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/50">
                          <p className="text-sm text-green-300 mb-1">Mejor Caso (Ω)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_Omega_espacial}
                          </div>
                        </div>
                      )}
                      {analysisResult.notation?.big_Theta_espacial && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/50">
                          <p className="text-sm text-blue-300 mb-1">Caso Promedio (Θ)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_Theta_espacial}
                          </div>
                        </div>
                      )}
                      {analysisResult.notation?.big_O_espacial && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/50">
                          <p className="text-sm text-purple-300 mb-1">Peor Caso (O)</p>
                          <div className="text-white text-2xl font-bold">
                            {analysisResult.notation.big_O_espacial}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Análisis Detallado - Al final, ocupando todo el ancho */}
        {analysisResult.result && (
          <div className="mt-8">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
              Análisis Detallado
            </h2>
            <div className="flex flex-col gap-4 p-6 rounded-xl bg-[#1c1c26] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 text-primary p-2 rounded-full">
                  <span className="material-symbols-outlined">summarize</span>
                </div>
                <h3 className="text-white font-bold text-lg">Resultado del Análisis</h3>
              </div>
              <div className="text-[#9d9db8] text-base font-normal leading-relaxed prose prose-invert max-w-none markdown-content">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-5 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-white mt-4 mb-2" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-white mt-3 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 text-[#9d9db8]" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4" {...props} />,
                    li: ({node, ...props}) => <li className="text-[#9d9db8] ml-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-blue-300" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className="bg-[#0D0D1A] px-2 py-1 rounded text-blue-300 font-mono text-sm" {...props} />
                      ) : (
                        <code className="block bg-[#0D0D1A] p-4 rounded-lg text-blue-300 font-mono text-sm overflow-x-auto" {...props} />
                      ),
                    pre: ({node, ...props}) => <pre className="mb-3" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-[#9d9db8] my-3" {...props} />,
                  }}
                >
                  {analysisResult.result}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
