import '../styles/DataValidationWarning.css';

const DataValidationWarning = ({ analysisResult }) => {
  const warnings = [];

  // Validar que los resultados finales de best, avg, worst sean diferentes
  if (analysisResult?.solution?.exact) {
    const { best, avg, worst } = analysisResult.solution.exact;
    if (best === avg && avg === worst) {
      warnings.push({
        type: 'suspicious',
        message: '⚠️ Los tres casos (mejor, promedio, peor) tienen la misma complejidad exacta. Esto puede ser correcto para algunos algoritmos, pero es inusual.'
      });
    }
  }

  // Validar Big-O consistencia
  if (analysisResult?.solution?.big_o) {
    const { best, avg, worst } = analysisResult.solution.big_o;
    if (best && avg && worst) {
      // Extraer solo la parte numérica de O(...)
      const extractComplexity = (bigO) => bigO.replace(/O\(|\)/g, '');
      const bestComp = extractComplexity(best);
      const avgComp = extractComplexity(avg);
      const worstComp = extractComplexity(worst);
      
      if (bestComp === avgComp && avgComp === worstComp) {
        warnings.push({
          type: 'info',
          message: '📊 Los tres casos tienen la misma notación Big-O. Esto es común en algoritmos con complejidad constante en todos los casos.'
        });
      }
    }
  }

  // Validar consistencia entre pasos finales y resultados exactos
  if (analysisResult?.solution?.steps_by_line && analysisResult?.solution?.exact) {
    const cases = ['best', 'avg', 'worst'];
    
    cases.forEach(caseType => {
      const caseSteps = analysisResult.solution.steps_by_line.filter(s => s.case === caseType);
      const finalStep = caseSteps[caseSteps.length - 1];
      const exactValue = analysisResult.solution.exact[caseType];
      
      if (finalStep && exactValue) {
        const finalExpression = finalStep.expression.replace('T(n) = ', '').trim();
        
        // Comparación más flexible (ignorar espacios)
        if (finalExpression !== exactValue && 
            finalExpression.replace(/\s/g, '') !== exactValue.replace(/\s/g, '')) {
          warnings.push({
            type: 'warning',
            message: `⚠️ Inconsistencia en ${caseType === 'best' ? 'mejor caso' : caseType === 'avg' ? 'caso promedio' : 'peor caso'}: el paso final muestra "${finalExpression}" pero el resultado exacto es "${exactValue}".`
          });
        }
      }
    });
  }

  // Validar que existan costos por línea
  if (!analysisResult?.costs?.per_line || analysisResult.costs.per_line.length === 0) {
    warnings.push({
      type: 'error',
      message: '❌ No se encontraron costos por línea. El análisis puede estar incompleto.'
    });
  }

  // Validar que existan pasos de solución
  if (!analysisResult?.solution?.steps_by_line || analysisResult.solution.steps_by_line.length === 0) {
    warnings.push({
      type: 'error',
      message: '❌ No se encontraron pasos de solución. El análisis puede estar incompleto.'
    });
  }

  if (warnings.length === 0) return null;

  return (
    <div className="data-validation-warnings">
      <h4>🔍 Validación de Resultados</h4>
      <div className="warnings-list">
        {warnings.map((warning, index) => (
          <div key={index} className={`warning-item ${warning.type}`}>
            <span className="warning-message">{warning.message}</span>
          </div>
        ))}
      </div>
      <p className="validation-note">
        <strong>Nota:</strong> Estas son verificaciones automáticas de consistencia. 
        Si ves advertencias, por favor revisa los resultados manualmente para asegurar su corrección.
      </p>
    </div>
  );
};

export default DataValidationWarning;
