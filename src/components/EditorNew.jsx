import { useState, useImperativeHandle, forwardRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import AIFixButton from './AIFixButton';

const Editor = forwardRef(({ onCodeChange }, ref) => {
  const [activeTab, setActiveTab] = useState('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  // Exponer función clear al componente padre
  useImperativeHandle(ref, () => ({
    clear: () => {
      setNaturalInput('');
      setCodeInput('');
      setSelectedLanguage('python');
      setActiveTab('natural');
      onCodeChange && onCodeChange({ type: 'natural', value: '', language: 'python' });
    }
  }));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (value) => {
    if (activeTab === 'natural') {
      setNaturalInput(value);
      onCodeChange && onCodeChange({ type: 'natural', value });
    } else {
      setCodeInput(value);
      onCodeChange && onCodeChange({ 
        type: 'code', 
        value, 
        language: selectedLanguage 
      });
    }
  };

  const handleMonacoChange = (value) => {
    setCodeInput(value || '');
    onCodeChange && onCodeChange({ 
      type: 'code', 
      value: value || '', 
      language: selectedLanguage 
    });
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    onCodeChange && onCodeChange({ 
      type: 'code', 
      value: codeInput, 
      language: event.target.value 
    });
  };

  const handleCodeFixed = (fixedCode) => {
    setCodeInput(fixedCode);
    onCodeChange && onCodeChange({ 
      type: 'code', 
      value: fixedCode, 
      language: selectedLanguage 
    });
  };

  const getDefaultCode = (language) => {
    const templates = {
      python: `# Escribe tu código Python aquí
def ejemplo():
    # Tu algoritmo aquí
    pass`,
      javascript: `// Escribe tu código JavaScript aquí
function ejemplo() {
    // Tu algoritmo aquí
}`,
      java: `// Escribe tu código Java aquí
public class Ejemplo {
    public static void main(String[] args) {
        // Tu algoritmo aquí
    }
}`,
      cpp: `// Escribe tu código C++ aquí
#include <iostream>
using namespace std;

int main() {
    // Tu algoritmo aquí
    return 0;
}`,
      c: `// Escribe tu código C aquí
#include <stdio.h>

int main() {
    // Tu algoritmo aquí
    return 0;
}`
    };
    return templates[language] || '';
  };

  return (
    <div className="editor-container">
      {/* Tab Headers */}
      <div className="tab-headers">
        <button
          className={`tab ${activeTab === 'natural' ? 'active' : ''}`}
          onClick={() => handleTabChange('natural')}
        >
          Lenguaje Natural
        </button>
        <button
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => handleTabChange('code')}
        >
          Código
        </button>
      </div>

      {/* Language Selector and AI Fix Button for Code Tab */}
      {activeTab === 'code' && (
        <div className="code-controls">
          <div className="language-selector">
            <label htmlFor="language-select">Lenguaje: </label>
            <select 
              id="language-select"
              value={selectedLanguage} 
              onChange={handleLanguageChange}
              className="language-dropdown"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
          </div>
          <AIFixButton 
            code={codeInput} 
            language={selectedLanguage} 
            onCodeFixed={handleCodeFixed}
          />
        </div>
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'natural' ? (
          <textarea
            value={naturalInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Describe tu algoritmo en lenguaje natural..."
            className="natural-input"
          />
        ) : (
          <div className="monaco-editor-container">
            <MonacoEditor
              height="400px"
              language={selectedLanguage}
              value={codeInput || getDefaultCode(selectedLanguage)}
              onChange={handleMonacoChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                },
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 2,
                insertSpaces: true,
                renderLineHighlight: 'all',
                selectOnLineNumbers: true,
                mouseWheelZoom: true,
                cursorBlinking: 'blink',
                cursorStyle: 'line'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default Editor;