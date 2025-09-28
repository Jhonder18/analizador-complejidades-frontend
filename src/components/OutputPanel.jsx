import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import ComplexityAnalysis from './ComplexityAnalysis';

const OutputPanel = ({ analysisResult, loading }) => {
  const [activeTab, setActiveTab] = useState('complexity');
  const { isDark } = useTheme();

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
          Complejidad
        </button>
        <button
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Análisis Completo
        </button>
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Detalles
        </button>
      </div>

      <div className="output-content">
        {activeTab === 'complexity' && (
          <div className="complexity-results">
            <div className="complexity-item">
              <h3>Complejidad Temporal</h3>
              <p className="complexity-value">{analysisResult.timeComplexity || 'N/A'}</p>
            </div>
            <div className="complexity-item">
              <h3>Complejidad Espacial</h3>
              <p className="complexity-value">{analysisResult.spaceComplexity || 'N/A'}</p>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <ComplexityAnalysis analysisResult={analysisResult} />
        )}

        {activeTab === 'details' && (
          <div className="analysis-details">
            <h3>Código Analizado</h3>
            {analysisResult.inputCode && (
              <div className="code-display">
                <MonacoEditor
                  height="250px"
                  language={analysisResult.language || 'javascript'}
                  value={analysisResult.inputCode}
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
            
            <div className="analysis-explanation">
              <h4>Explicación del Análisis</h4>
              <p>{analysisResult.explanation || 'Sin detalles disponibles'}</p>
            </div>

            {analysisResult.metadata && (
              <div className="analysis-metadata-details">
                <h4>Metadatos del Análisis</h4>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <strong>Tipo de Algoritmo:</strong>
                    <span>{analysisResult.algorithmType || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Confianza:</strong>
                    <span>{analysisResult.confidence ? `${(analysisResult.confidence * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Líneas de Código:</strong>
                    <span>{analysisResult.metadata.linesOfCode || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Caracteres:</strong>
                    <span>{analysisResult.metadata.charactersCount || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Tiempo de Análisis:</strong>
                    <span>{analysisResult.analysisTime || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Lenguaje:</strong>
                    <span>{analysisResult.language?.toUpperCase() || 'N/A'}</span>
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