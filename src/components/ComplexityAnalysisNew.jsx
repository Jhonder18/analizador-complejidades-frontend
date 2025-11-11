import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ComplexityAnalysisNew.css';

const ComplexityAnalysis = ({ analysisResult }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const { isDark } = useTheme();

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderASTNode = (node, level = 0, parentKey = '') => {
    if (!node || typeof node !== 'object') return null;

    const nodeId = `${parentKey}-${node.type || 'node'}-${level}`;
    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.body || node.functions || node.params || node.statements || 
                        node.then_block || node.else_block || node.left || node.right ||
                        node.start || node.end || node.cond || node.target || node.value;

    return (
      <div key={nodeId} className="ast-node" style={{ marginLeft: `${level * 20}px` }}>
        <div className="ast-node-header" onClick={() => hasChildren && toggleNode(nodeId)}>
          {hasChildren && (
            <span className="ast-node-toggle">{isExpanded ? '▼' : '▶'}</span>
          )}
          <span className="ast-node-type">{node.type || 'Unknown'}</span>
          {node.name && <span className="ast-node-name"> • {node.name}</span>}
          {node.op && <span className="ast-node-op"> • op: {node.op}</span>}
          {node.value !== undefined && <span className="ast-node-value"> • value: {JSON.stringify(node.value)}</span>}
          {node.var && <span className="ast-node-var"> • var: {node.var}</span>}
        </div>

        {isExpanded && hasChildren && (
          <div className="ast-node-children">
            {node.functions?.map((func, idx) => renderASTNode(func, level + 1, `${nodeId}-func-${idx}`))}
            {node.body && renderASTNode(node.body, level + 1, `${nodeId}-body`)}
            {node.params?.map((param, idx) => (
              <div key={`${nodeId}-param-${idx}`} className="ast-param" style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <span className="ast-param-label">param:</span> {param.name || JSON.stringify(param)}
              </div>
            ))}
            {node.statements?.map((stmt, idx) => renderASTNode(stmt, level + 1, `${nodeId}-stmt-${idx}`))}
            {node.then_block && (
              <div key={`${nodeId}-then`} className="ast-block" style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>then:</strong>
                {renderASTNode(node.then_block, level + 2, `${nodeId}-then`)}
              </div>
            )}
            {node.else_block && (
              <div key={`${nodeId}-else`} className="ast-block" style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>else:</strong>
                {renderASTNode(node.else_block, level + 2, `${nodeId}-else`)}
              </div>
            )}
            {node.cond && renderASTNode(node.cond, level + 1, `${nodeId}-cond`)}
            {node.start && (
              <div key={`${nodeId}-start`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>start:</strong>
                {renderASTNode(node.start, level + 2, `${nodeId}-start`)}
              </div>
            )}
            {node.end && (
              <div key={`${nodeId}-end`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>end:</strong>
                {renderASTNode(node.end, level + 2, `${nodeId}-end`)}
              </div>
            )}
            {node.left && (
              <div key={`${nodeId}-left`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>left:</strong>
                {renderASTNode(node.left, level + 2, `${nodeId}-left`)}
              </div>
            )}
            {node.right && (
              <div key={`${nodeId}-right`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>right:</strong>
                {renderASTNode(node.right, level + 2, `${nodeId}-right`)}
              </div>
            )}
            {node.target && (
              <div key={`${nodeId}-target`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>target:</strong>
                {renderASTNode(node.target, level + 2, `${nodeId}-target`)}
              </div>
            )}
            {node.value && typeof node.value === 'object' && (
              <div key={`${nodeId}-value`} style={{ marginLeft: `${(level + 1) * 20}px` }}>
                <strong>value:</strong>
                {renderASTNode(node.value, level + 2, `${nodeId}-value`)}
              </div>
            )}
            {node.array && renderASTNode(node.array, level + 1, `${nodeId}-array`)}
            {node.index && renderASTNode(node.index, level + 1, `${nodeId}-index`)}
          </div>
        )}
      </div>
    );
  };

  // Si hay AST del backend, mostrarlo
  if (analysisResult?.ast) {
    const { ast, metadata } = analysisResult.ast;

    return (
      <div className="complexity-analysis">
        <div className="analysis-header">
          <h3>🌳 Árbol de Sintaxis Abstracta (AST)</h3>
          <p>Estructura del algoritmo analizado</p>
        </div>

        {/* Metadata del AST */}
        {metadata && (
          <div className="ast-metadata">
            <h4>📊 Información del AST</h4>
            <div className="metadata-grid">
              <div className="metadata-item">
                <strong>Funciones:</strong>
                <span>{metadata.functions || 0}</span>
              </div>
              <div className="metadata-item">
                <strong>Nodos Totales:</strong>
                <span>{metadata.total_nodes || 0}</span>
              </div>
              <div className="metadata-item">
                <strong>Éxito:</strong>
                <span className={analysisResult.ast.success ? 'status-success' : 'status-error'}>
                  {analysisResult.ast.success ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Árbol AST Visual */}
        {ast && (
          <div className="ast-tree">
            <h4>🌲 Estructura del Árbol</h4>
            <p className="ast-hint">Haz clic en los nodos con ▶ para expandir</p>
            <div className="ast-tree-container">
              {renderASTNode(ast, 0, 'root')}
            </div>
          </div>
        )}

        {/* AST en JSON */}
        <div className="ast-json-section">
          <h4>📝 Representación JSON</h4>
          <div className="ast-json-editor">
            <MonacoEditor
              height="400px"
              language="json"
              value={JSON.stringify(ast, null, 2)}
              theme={isDark ? "vs-dark" : "vs-light"}
              options={{
                readOnly: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 13,
                lineNumbers: 'on',
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Fallback si no hay AST
  return (
    <div className="complexity-analysis">
      <div className="analysis-header">
        <h3>Análisis AST No Disponible</h3>
        <p>No se pudo generar el árbol de sintaxis abstracta para este código.</p>
      </div>
    </div>
  );
};

export default ComplexityAnalysis;
