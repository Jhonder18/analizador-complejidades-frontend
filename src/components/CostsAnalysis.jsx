import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import '../styles/CostsAnalysis.css';

export const CostsAnalysis = ({ costs, pseudocode }) => {
  const [viewMode] = useState('per-line'); // Solo mostrar 'per-line'
  const { theme } = useTheme();

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

  if (!costs) {
    return (
      <div className="costs-analysis">
        <p className="no-data">No hay análisis de costos disponible</p>
      </div>
    );
  }

  const { per_line, total } = costs;

  return (
    <div className="costs-analysis">
      <div className="costs-header">
        <h3>💰 Análisis de Costos por Línea</h3>
      </div>

      {/* Vista de Pseudocódigo */}
      {pseudocode && (
        <div className="pseudocode-section">
          <h4>📋 Pseudocódigo Analizado</h4>
          <div className="monaco-wrapper">
            <Editor
              height="300px"
              language="plaintext"
              value={pseudocode}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: 'on',
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      )}

      {/* Costos por Línea */}
      {per_line && per_line.length > 0 && (
        <div className="costs-section">
          <h4>📊 Costos por Línea de Código</h4>
          <div className="costs-table-wrapper">
            <table className="costs-table">
              <thead>
                <tr>
                  <th>Línea</th>
                  <th>Código</th>
                  <th>Operaciones</th>
                  <th>Mejor Caso</th>
                  <th>Caso Promedio</th>
                  <th>Peor Caso</th>
                </tr>
              </thead>
              <tbody>
                {per_line.map((line, index) => (
                  <tr key={index}>
                    <td className="line-number">{line.line_number}</td>
                    <td className="code-cell">
                      <code>{line.code}</code>
                    </td>
                    <td className="operations-cell">
                      {line.operations.map((op, i) => (
                        <span key={i} className="operation-badge">{op}</span>
                      ))}
                    </td>
                    <td className="cost-cell best">
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(line.cost.best) }} />
                    </td>
                    <td className="cost-cell avg">
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(line.cost.avg) }} />
                    </td>
                    <td className="cost-cell worst">
                      <div dangerouslySetInnerHTML={{ __html: parseSumToLatex(line.cost.worst) }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* Costo Total */}
      {total && (
        <div className="total-cost">
          <h4>🎯 Costo Total del Algoritmo</h4>
          <div className="total-costs-grid">
            <div className="total-item best">
              <span className="total-label">Mejor Caso:</span>
              <div className="total-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(total.best) }} />
            </div>
            <div className="total-item avg">
              <span className="total-label">Caso Promedio:</span>
              <div className="total-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(total.avg) }} />
            </div>
            <div className="total-item worst">
              <span className="total-label">Peor Caso:</span>
              <div className="total-value" dangerouslySetInnerHTML={{ __html: parseSumToLatex(total.worst) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostsAnalysis;
