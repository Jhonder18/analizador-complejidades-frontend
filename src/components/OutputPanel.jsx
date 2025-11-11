import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import ComplexityAnalysis from './ComplexityAnalysisNew';
import SolutionSteps from './SolutionSteps';
import CostsAnalysis from './CostsAnalysis';
import DataValidationWarning from './DataValidationWarning';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const OutputPanel = ({ analysisResult, loading }) => {
  const [activeTab, setActiveTab] = useState('complexity');
  const { isDark } = useTheme();

  // Función para convertir expresiones matemáticas a LaTeX
  const parseSumToLatex = (text) => {
    if (!text) return '';
    
    // Función para limpiar paréntesis innecesarios
    const cleanParentheses = (str) => {
      // Remover paréntesis externos si toda la expresión está entre paréntesis
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
      
      // Procesar de adentro hacia afuera hasta que no haya más cambios
      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;
        
        // Buscar patrones Sum( manualmente para manejar anidamiento
        for (let i = 0; i < result.length - 4; i++) {
          if (result.substring(i, i + 4) === 'Sum(') {
            // Encontrar el cierre del Sum
            const sumStart = i;
            const firstParen = i + 3; // posición de '(' después de 'Sum'
            let parenCount = 1;
            let commaPos = -1;
            let secondParenStart = -1;
            
            // Buscar la coma que separa expresión de los límites
            for (let j = firstParen + 1; j < result.length && parenCount > 0; j++) {
              if (result[j] === '(') parenCount++;
              if (result[j] === ')') parenCount--;
              
              // La coma principal está cuando parenCount == 1
              if (result[j] === ',' && parenCount === 1 && commaPos === -1) {
                commaPos = j;
                // Buscar el inicio de los límites (variable, inicio, fin)
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
                // Buscar el paréntesis de cierre de Sum() que viene después de secondParenEnd
                let sumEnd = secondParenEnd + 1;
                while (sumEnd < result.length && result[sumEnd] === ' ') sumEnd++;
                if (sumEnd < result.length && result[sumEnd] === ')') {
                  sumEnd++; // Incluir el paréntesis de cierre del Sum
                }
                
                // Extraer las partes
                const expression = cleanParentheses(result.substring(firstParen + 1, commaPos).trim());
                const limitsContent = result.substring(secondParenStart + 1, secondParenEnd);
                
                // Parsear (variable, inicio, fin)
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
                  
                  // Convertir a LaTeX
                  const latexSum = `\\sum_{${variable}=${start}}^{${end}} ${expression}`;
                  
                  result = result.substring(0, sumStart) + latexSum + result.substring(sumEnd);
                  changed = true;
                  break; // Reiniciar el bucle
                }
              }
            }
          }
        }
      }
      
      return result;
    };
    
    try {
      // Primero procesar las sumatorias
      let latex = processSums(text);
      
      // Convertir operadores matemáticos (orden importante!)
      latex = latex
        // Potencias: n**2 → n^{2}
        .replace(/(\w+)\s*\*\*\s*(\d+)/g, '$1^{$2}')
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
        // Limpiar espacios múltiples
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

  if (loading) {
    return (
      <div className="output-panel loading">
        <div className="loading-spinner">Analizando...</div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="output-panel empty">
        <p>Los resultados del análisis aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="output-panel">
      <div className="output-tabs">
        <button
          className={`tab ${activeTab === 'complexity' ? 'active' : ''}`}
          onClick={() => setActiveTab('complexity')}
        >
          📊 Resumen
        </button>
        <button
          className={`tab ${activeTab === 'pseudocode' ? 'active' : ''}`}
          onClick={() => setActiveTab('pseudocode')}
        >
          📝 Pseudocódigo
        </button>
        <button
          className={`tab ${activeTab === 'costs' ? 'active' : ''}`}
          onClick={() => setActiveTab('costs')}
        >
          💰 Costos
        </button>
        <button
          className={`tab ${activeTab === 'solution' ? 'active' : ''}`}
          onClick={() => setActiveTab('solution')}
        >
          📐 Solución
        </button>
        <button
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          🔍 Análisis AST
        </button>
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          ℹ️ Detalles
        </button>
      </div>

      <div className="output-content">
        {activeTab === 'complexity' && (
          <div className="complexity-results">
            {/* Advertencias de Validación */}
            <DataValidationWarning analysisResult={analysisResult} />

            {/* Resumen General */}
            {analysisResult.solution?.big_o && (
              <div className="complexity-summary">
                <h3>🎯 Complejidad Big-O</h3>
                <div className="big-o-grid">
                  <div className="big-o-item best">
                    <span className="case-label">Mejor Caso</span>
                    <div className="big-o-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.big_o.best) }} />
                  </div>
                  <div className="big-o-item avg">
                    <span className="case-label">Caso Promedio</span>
                    <div className="big-o-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.big_o.avg) }} />
                  </div>
                  <div className="big-o-item worst">
                    <span className="case-label">Peor Caso</span>
                    <div className="big-o-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.big_o.worst) }} />
                  </div>
                </div>
              </div>
            )}

            {/* Límites Asintóticos */}
            {analysisResult.solution?.bounds && (
              <div className="bounds-summary">
                <h3>📏 Límites Asintóticos</h3>
                <div className="bounds-display">
                  <div className="bound-box">
                    <span className="bound-symbol">Ω</span>
                    <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.bounds.omega) }} />
                  </div>
                  <div className="bound-box">
                    <span className="bound-symbol">Θ</span>
                    <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.bounds.theta) }} />
                  </div>
                  <div className="bound-box">
                    <span className="bound-symbol">O</span>
                    <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.bounds.big_o) }} />
                  </div>
                </div>
              </div>
            )}

            {/* Expresiones Exactas */}
            {analysisResult.solution?.exact && (
              <div className="exact-summary">
                <h3>🔢 Expresiones Exactas</h3>
                <div className="exact-grid">
                  {analysisResult.solution.exact.best && (
                    <div className="exact-item best">
                      <span className="exact-label">Mejor caso:</span>
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.exact.best) }} />
                    </div>
                  )}
                  {analysisResult.solution.exact.avg && (
                    <div className="exact-item avg">
                      <span className="exact-label">Caso promedio:</span>
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.exact.avg) }} />
                    </div>
                  )}
                  {analysisResult.solution.exact.worst && (
                    <div className="exact-item worst">
                      <span className="exact-label">Peor caso:</span>
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(analysisResult.solution.exact.worst) }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pseudocode' && (
          <div className="pseudocode-tab">
            <h3>📝 Pseudocódigo Generado</h3>
            {analysisResult.validation?.codigo_corregido ? (
              <div className="pseudocode-editor">
                <MonacoEditor
                  height="500px"
                  language="plaintext"
                  value={analysisResult.validation.codigo_corregido}
                  theme={isDark ? "vs-dark" : "vs-light"}
                  options={{
                    readOnly: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 4,
                  }}
                />
              </div>
            ) : (
              <p className="no-data">No hay pseudocódigo disponible</p>
            )}

            {/* Información de Validación */}
            {analysisResult.validation && (
              <div className="validation-info">
                <h4>✅ Información de Validación</h4>
                <div className="validation-grid">
                  <div className="validation-item">
                    <strong>¿Algoritmo Válido?</strong>
                    <span className={analysisResult.validation.era_algoritmo_valido ? 'status-success' : 'status-error'}>
                      {analysisResult.validation.era_algoritmo_valido ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {analysisResult.validation.hints && (
                    <>
                      <div className="validation-item">
                        <strong>Parser Engine:</strong>
                        <span>{analysisResult.validation.hints.parser_engine}</span>
                      </div>
                      <div className="validation-item">
                        <strong>Nodos AST:</strong>
                        <span>{analysisResult.validation.hints.parse_tree_nodes}</span>
                      </div>
                      <div className="validation-item">
                        <strong>Líneas:</strong>
                        <span>{analysisResult.validation.hints.line_count}</span>
                      </div>
                      <div className="validation-item">
                        <strong>Errores:</strong>
                        <span className={analysisResult.validation.hints.total_errors > 0 ? 'status-error' : 'status-success'}>
                          {analysisResult.validation.hints.total_errors}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {analysisResult.validation.normalizaciones && analysisResult.validation.normalizaciones.length > 0 && (
                  <div className="normalizations-list">
                    <h5>🔧 Normalizaciones Aplicadas:</h5>
                    <ul>
                      {analysisResult.validation.normalizaciones.map((norm, index) => (
                        <li key={index}>{norm}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.validation.errores && analysisResult.validation.errores.length > 0 && (
                  <div className="errors-list">
                    <h5>❌ Errores Encontrados:</h5>
                    <ul>
                      {analysisResult.validation.errores.map((error, index) => (
                        <li key={index} className="error-item">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'costs' && (
          <CostsAnalysis 
            costs={analysisResult.costs} 
            pseudocode={analysisResult.validation?.codigo_corregido}
          />
        )}

        {activeTab === 'solution' && (
          <SolutionSteps solution={analysisResult.solution} />
        )}

        {activeTab === 'analysis' && (
          <ComplexityAnalysis analysisResult={analysisResult} />
        )}

        {activeTab === 'details' && (
          <div className="analysis-details">
            <h3>📋 Entrada Original</h3>
            {analysisResult.input_text && (
              <div className="code-display">
                <MonacoEditor
                  height="200px"
                  language="plaintext"
                  value={analysisResult.input_text}
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
            )}

            {/* Información de Validación */}
            {analysisResult.validation && (
              <div className="validation-info">
                <h4>✅ Validación del Código</h4>
                <div className="validation-status">
                  <div className="status-item">
                    <strong>Algoritmo Válido:</strong>
                    <span style={{ color: analysisResult.validation.era_algoritmo_valido ? '#10b981' : '#ef4444' }}>
                      {analysisResult.validation.era_algoritmo_valido ? '✓ Sí' : '✗ No'}
                    </span>
                  </div>
                  
                  {analysisResult.validation.errores && analysisResult.validation.errores.length > 0 && (
                    <div className="validation-errors">
                      <strong>⚠️ Errores encontrados:</strong>
                      <ul>
                        {analysisResult.validation.errores.map((error, idx) => (
                          <li key={idx} className="error-item">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.validation.normalizaciones && analysisResult.validation.normalizaciones.length > 0 && (
                    <div className="validation-normalizations">
                      <strong>🔧 Normalizaciones aplicadas:</strong>
                      <ul>
                        {analysisResult.validation.normalizaciones.map((norm, idx) => (
                          <li key={idx} className="norm-item">{norm}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.validation.hints && (
                    <div className="validation-hints">
                      <strong>💡 Información del Parser:</strong>
                      <div className="hints-grid">
                        <div className="hint-item">
                          <span className="hint-label">Motor:</span>
                          <span>{analysisResult.validation.hints.parser_engine || 'N/A'}</span>
                        </div>
                        <div className="hint-item">
                          <span className="hint-label">Versión Gramática:</span>
                          <span>{analysisResult.validation.hints.grammar_version || 'N/A'}</span>
                        </div>
                        <div className="hint-item">
                          <span className="hint-label">Nodos del Árbol:</span>
                          <span>{analysisResult.validation.hints.parse_tree_nodes || 'N/A'}</span>
                        </div>
                        <div className="hint-item">
                          <span className="hint-label">Longitud del Código:</span>
                          <span>{analysisResult.validation.hints.code_length || 'N/A'} caracteres</span>
                        </div>
                        <div className="hint-item">
                          <span className="hint-label">Líneas de Código:</span>
                          <span>{analysisResult.validation.hints.line_count || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {analysisResult.metadata && (
              <div className="analysis-metadata-details">
                <h4>🔍 Metadatos del Análisis</h4>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <strong>Etapas del Pipeline:</strong>
                    <span>{analysisResult.metadata.pipeline_stages || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Normalización con Gemini:</strong>
                    <span>{analysisResult.metadata.used_gemini_normalization ? 'Sí' : 'No'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Tipo de Entrada:</strong>
                    <span>{analysisResult.metadata.input_type || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Nodos Analizados:</strong>
                    <span>{analysisResult.metadata.total_nodes_analyzed || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Errores:</strong>
                    <span style={{ color: analysisResult.metadata.has_errors ? '#ef4444' : '#10b981' }}>
                      {analysisResult.metadata.has_errors ? 'Sí' : 'No'}
                    </span>
                  </div>
                  <div className="metadata-item">
                    <strong>Normalizaciones Aplicadas:</strong>
                    <span>{analysisResult.metadata.normalizations_applied || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;