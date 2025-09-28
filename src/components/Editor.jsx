import { useState, useImperativeHandle, forwardRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '../contexts/ThemeContext';
import AIFixButton from './AIFixButton';

const Editor = forwardRef(({ onCodeChange }, ref) => {
  const [activeTab, setActiveTab] = useState('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const { isDark } = useTheme();

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

  // Ejemplos predefinidos para demostración
  const getExampleCode = (algorithmType, language) => {
    const examples = {
      'selection-sort': {
        python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr`,

        javascript: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
    return arr;
}`
      },

      'bubble-sort': {
        python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,

        javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}`
      },

      'binary-search': {
        python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,

        javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`
      },

      'fibonacci': {
        python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,

        javascript: `function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
      }
    };

    return examples[algorithmType]?.[language] || '';
  };

  // Ejemplos de descripción en lenguaje natural
  const getNaturalExamples = (algorithmType) => {
    const examples = {
      'selection-sort': `Algoritmo de ordenamiento que encuentra el elemento más pequeño en cada iteración y lo coloca en la posición correcta.`,

      'bubble-sort': `Algoritmo que compara elementos adyacentes y los intercambia si están en orden incorrecto hasta que no se necesiten más intercambios.`,

      'binary-search': `Búsqueda en un array ordenado que divide repetidamente el espacio de búsqueda por la mitad comparando con el elemento del medio.`,

      'merge-sort': `Algoritmo divide y vencerás que divide el array recursivamente por la mitad y luego combina los subarrays ordenadamente.`,

      'quick-sort': `Algoritmo que selecciona un pivot, reorganiza el array con elementos menores a la izquierda y mayores a la derecha, aplicando recursión a ambas mitades.`,

      'fibonacci': `Secuencia donde cada número es la suma de los dos anteriores: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).`
    };

    return examples[algorithmType] || '';
  };

  const loadExample = (algorithmType) => {
    if (activeTab === 'natural') {
      const example = getNaturalExamples(algorithmType);
      setNaturalInput(example);
      onCodeChange && onCodeChange({ 
        type: 'natural', 
        value: example, 
        language: selectedLanguage 
      });
    } else {
      const example = getExampleCode(algorithmType, selectedLanguage);
      if (example) {
        setCodeInput(example);
        onCodeChange && onCodeChange({ 
          type: 'code', 
          value: example, 
          language: selectedLanguage 
        });
      }
    }
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

      {/* Language Selector for Code Tab */}
      {activeTab === 'code' && (
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
      )}

      {/* Examples Section */}
      <div className="examples-section">
        <div className="examples-header">
          <h4>Ejemplos Predefinidos:</h4>
        </div>
        <div className="examples-buttons">
          <button 
            className="example-btn" 
            onClick={() => loadExample('selection-sort')}
            title="Cargar ejemplo de Selection Sort"
          >
            Selection Sort
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('bubble-sort')}
            title="Cargar ejemplo de Bubble Sort"
          >
            Bubble Sort
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('binary-search')}
            title="Cargar ejemplo de Binary Search"
          >
            Binary Search
          </button>
          <button 
            className="example-btn" 
            onClick={() => loadExample('fibonacci')}
            title="Cargar ejemplo de Fibonacci"
          >
            Fibonacci
          </button>
        </div>
      </div>

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
              theme={isDark ? "vs-dark" : "vs-light"}
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