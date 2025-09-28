import { useState, useRef } from 'react';
import Editor from '../components/Editor';
import OutputPanel from '../components/OutputPanel';
import DiagramViewer from '../components/DiagramViewer';
import Loader from '../components/Loader';
import { analyzeComplexity } from '../services/api';

const Analyzer = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentInput, setCurrentInput] = useState({ type: '', value: '', language: 'python' });
  const editorRef = useRef();

  const handleCodeChange = (inputData) => {
    setCurrentInput(inputData);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!currentInput.value.trim()) {
      setError('Por favor ingresa código o descripción para analizar');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeComplexity({
        input: currentInput.value,
        type: currentInput.type,
        language: currentInput.language || 'python'
      });
      
      setAnalysisResult(result);
    } catch (err) {
      setError('Error al analizar el código: ' + (err.message || 'Error desconocido'));
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAnalysisResult(null);
    setError(null);
    setCurrentInput({ type: '', value: '', language: 'python' });
    editorRef.current?.clear();
  };

  return (
    <div className="analyzer-page">
      <div className="analyzer-header">
        <h1>Analizador de Complejidades</h1>
        <p>Ingresa tu algoritmo en código o lenguaje natural para obtener su análisis de complejidad</p>
      </div>

      <div className="analyzer-layout">
        {/* Panel superior - Editor */}
        <div className="analyzer-panel editor-panel">
          <div className="panel-header">
            <h2>Editor</h2>
            <div className="panel-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleAnalyze}
                disabled={loading || !currentInput.value.trim()}
              >
                {loading ? 'Analizando...' : 'Analizar'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleClear}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
          
          <Editor onCodeChange={handleCodeChange} ref={editorRef} />
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Panel inferior - Resultados */}
        {(loading || analysisResult) && (
          <div className="analyzer-panel results-panel">
            <div className="panel-header">
              <h2>Resultados del Análisis</h2>
            </div>
            
            {loading ? (
              <Loader message="Analizando complejidad..." />
            ) : (
              <div className="results-content">
                <OutputPanel 
                  analysisResult={analysisResult} 
                  loading={loading} 
                />
                
                {analysisResult && analysisResult.diagram && (
                  <div className="diagram-section">
                    <DiagramViewer 
                      diagramData={analysisResult.diagram}
                      type={analysisResult.diagramType || 'json'}
                    />
                  </div>
                )}

                {/* Información adicional del análisis */}
                {analysisResult && (
                  <div className="analysis-summary">
                    <h3>Resumen del Análisis</h3>
                    <div className="analysis-metadata">
                      <span><strong>Tipo de entrada:</strong> {currentInput.type === 'natural' ? 'Lenguaje Natural' : 'Código'}</span>
                      {currentInput.type === 'code' && (
                        <span><strong>Lenguaje:</strong> {currentInput.language?.toUpperCase() || 'N/A'}</span>
                      )}
                      <span><strong>Tiempo de análisis:</strong> {analysisResult.analysisTime || 'N/A'}</span>
                      <span><strong>Algoritmos detectados:</strong> {analysisResult.detectedAlgorithms?.length || 0}</span>
                      <span><strong>Confianza:</strong> {analysisResult.confidence ? `${(analysisResult.confidence * 100).toFixed(1)}%` : 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;