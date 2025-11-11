import katex from 'katex';
import 'katex/dist/katex.min.css';
import '../styles/SolutionSteps.css';

export const SolutionSteps = ({ solution }) => {
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

  if (!solution) {
    return (
      <div className="solution-steps">
        <p className="no-data">No hay pasos de solución disponibles</p>
      </div>
    );
  }

  const { steps_by_line, exact, big_o, bounds } = solution;

  // Usar solo pasos por línea
  const currentSteps = steps_by_line;

  // Agrupar pasos por caso (best, avg, worst)
  const groupedSteps = {
    best: currentSteps?.filter(step => step.case === 'best') || [],
    avg: currentSteps?.filter(step => step.case === 'avg') || [],
    worst: currentSteps?.filter(step => step.case === 'worst') || [],
  };

  // Detectar si los pasos son idénticos entre casos (problema del backend)
  const checkDuplicateSteps = () => {
    if (groupedSteps.best.length === 0 || groupedSteps.avg.length === 0 || groupedSteps.worst.length === 0) {
      return false;
    }
    
    const bestExprs = groupedSteps.best.map(s => s.expression).join('|');
    const avgExprs = groupedSteps.avg.map(s => s.expression).join('|');
    const worstExprs = groupedSteps.worst.map(s => s.expression).join('|');
    
    return bestExprs === avgExprs && avgExprs === worstExprs;
  };

  const hasDuplicates = checkDuplicateSteps();

  // Función para renderizar pasos de un caso
  const renderCaseSteps = (steps, caseType, title, emoji, colorClass) => {
    if (steps.length === 0) return null;

    return (
      <div className={`case-section ${colorClass}`}>
        <h4>{emoji} {title}</h4>
        {hasDuplicates && (
          <div className="duplicate-warning">
            ⚠️ Nota: Los pasos mostrados son idénticos para los tres casos. Esto puede indicar un problema en el análisis del backend.
          </div>
        )}
        <div className="steps-list">
          {steps.map((step, index) => (
            <div key={`${caseType}-${index}`} className="step-item">
              <div className="step-number">Paso {index + 1}</div>
              <div className="step-content">
                <div className="step-description">{step.description}</div>
                <div className="step-expression">
                  <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(step.expression) }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="solution-steps">
      <div className="solution-header">
        <h3>� Pasos de la Solución (Por Línea)</h3>
        {hasDuplicates && (
          <div className="global-duplicate-notice">
            <span className="notice-icon">⚠️</span>
            <span>Los tres casos muestran los mismos pasos</span>
          </div>
        )}
      </div>

      <div className="solution-content">
        {/* Mejor Caso */}
        {renderCaseSteps(groupedSteps.best, 'best', 'Mejor Caso (Best Case)', '✅', 'best-case')}

        {/* Caso Promedio - Solo mostrar si es diferente */}
        {!hasDuplicates && renderCaseSteps(groupedSteps.avg, 'avg', 'Caso Promedio (Average Case)', '📊', 'avg-case')}

        {/* Peor Caso - Solo mostrar si es diferente */}
        {!hasDuplicates && renderCaseSteps(groupedSteps.worst, 'worst', 'Peor Caso (Worst Case)', '❌', 'worst-case')}
      </div>

      {/* Resultados Finales */}
      <div className="final-results">
        <h4>🎯 Resultados Finales</h4>
        
        {exact && (
          <div className="results-section">
            <h5>Expresiones Exactas:</h5>
            <div className="results-grid">
              {exact.best && (
                <div className="result-item best">
                  <span className="result-label">Mejor caso:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(exact.best) }} />
                </div>
              )}
              {exact.avg && (
                <div className="result-item avg">
                  <span className="result-label">Caso promedio:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(exact.avg) }} />
                </div>
              )}
              {exact.worst && (
                <div className="result-item worst">
                  <span className="result-label">Peor caso:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(exact.worst) }} />
                </div>
              )}
            </div>
          </div>
        )}

        {big_o && (
          <div className="results-section">
            <h5>Notación Big-O:</h5>
            <div className="results-grid">
              {big_o.best && (
                <div className="result-item best">
                  <span className="result-label">Mejor caso:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(big_o.best) }} />
                </div>
              )}
              {big_o.avg && (
                <div className="result-item avg">
                  <span className="result-label">Caso promedio:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(big_o.avg) }} />
                </div>
              )}
              {big_o.worst && (
                <div className="result-item worst">
                  <span className="result-label">Peor caso:</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(big_o.worst) }} />
                </div>
              )}
            </div>
          </div>
        )}

        {bounds && (
          <div className="results-section">
            <h5>Límites Asintóticos:</h5>
            <div className="bounds-grid">
              {bounds.omega && (
                <div className="bound-item">
                  <span className="bound-symbol">Ω</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(bounds.omega) }} />
                </div>
              )}
              {bounds.theta && (
                <div className="bound-item">
                  <span className="bound-symbol">Θ</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(bounds.theta) }} />
                </div>
              )}
              {bounds.big_o && (
                <div className="bound-item">
                  <span className="bound-symbol">O</span>
                  <div className="math-expression" dangerouslySetInnerHTML={{ __html: parseSumToLatex(bounds.big_o) }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionSteps;
