import { useState, useImperativeHandle, forwardRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import AIFixButton from './AIFixButton';

const Editor = forwardRef(({ onCodeChange }, ref) => {
  const [activeTab, setActiveTab] = useState('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [algorithmType, setAlgorithmType] = useState('iterativo'); // 'iterativo' o 'recursivo'

  // Exponer función clear al componente padre
  useImperativeHandle(ref, () => ({
    clear: () => {
      setNaturalInput('');
      setCodeInput('');
      setSelectedLanguage('python');
      setAlgorithmType('iterativo');
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
      type: 'pseudocode', 
      value: value || ''
    });
  };

  // Ejemplos de pseudocódigo en formato .lark
  const getPseudocodeExamples = (exampleType) => {
    const iterativeExamples = {
      'busqueda-lineal': `busqueda_lineal(A, n, x)
begin
    for i 🡨 1 to n do
    begin
        if (A[i] = x) then
        begin
            return i
        end
    end
    return -1
end`,

      'burbuja': `burbuja(A, n)
begin
    for i 🡨 1 to n-1 do
    begin
        for j 🡨 1 to n-i do
        begin
            if (A[j] > A[j+1]) then
            begin
                temp 🡨 A[j]
                A[j] 🡨 A[j+1]
                A[j+1] 🡨 temp
            end
        end
    end
end`,

      'insercion': `insercion(A, n)
begin
    for i 🡨 2 to n do
    begin
        clave 🡨 A[i]
        j 🡨 i - 1
        while (j > 0 and A[j] > clave) do
        begin
            A[j+1] 🡨 A[j]
            j 🡨 j - 1
        end
        A[j+1] 🡨 clave
    end
end`,

      'seleccion': `seleccion(A, n)
begin
    for i 🡨 1 to n-1 do
    begin
        minimo 🡨 i
        for j 🡨 i+1 to n do
        begin
            if (A[j] < A[minimo]) then
            begin
                minimo 🡨 j
            end
        end
        if (minimo != i) then
        begin
            temp 🡨 A[i]
            A[i] 🡨 A[minimo]
            A[minimo] 🡨 temp
        end
    end
end`,

      'suma-matriz': `suma_matriz(A, n, m)
begin
    suma 🡨 0
    for i 🡨 1 to n do
    begin
        for j 🡨 1 to m do
        begin
            suma 🡨 suma + A[i][j]
        end
    end
    return suma
end`,

      'buscar-while': `buscar_while(A, n, x)
begin
    i 🡨 1
    encontrado 🡨 false
    while (i <= n and not encontrado) do
    begin
        if (A[i] = x) then
        begin
            encontrado 🡨 true
        end
        i 🡨 i + 1
    end
    if (encontrado) then
    begin
        return i - 1
    end
    else
    begin
        return -1
    end
end`,

      'multiplicar-matrices': `multiplicar_matrices(A, B, n, m, p)
begin
    for i 🡨 1 to n do
    begin
        for j 🡨 1 to p do
        begin
            C[i][j] 🡨 0
            for k 🡨 1 to m do
            begin
                C[i][j] 🡨 C[i][j] + A[i][k] * B[k][j]
            end
        end
    end
    return C
end`,

      'encontrar-maximo': `encontrar_maximo(A, n)
begin
    maximo 🡨 A[1]
    for i 🡨 2 to n do
    begin
        if (A[i] > maximo) then
        begin
            maximo 🡨 A[i]
        end
    end
    return maximo
end`,

      'contar-pares': `contar_pares(A, n)
begin
    contador 🡨 0
    for i 🡨 1 to n do
    begin
        if (A[i] mod 2 = 0) then
        begin
            contador 🡨 contador + 1
        end
    end
    return contador
end`,

      'buscar-par-suma': `buscar_par_suma(A, n, objetivo)
begin
    for i 🡨 1 to n-1 do
    begin
        for j 🡨 i+1 to n do
        begin
            if (A[i] + A[j] = objetivo) then
            begin
                return true
            end
        end
    end
    return false
end`
    };

    const recursiveExamples = {
      // Por ahora vacío, se completará después
    };

    return algorithmType === 'iterativo' 
      ? (iterativeExamples[exampleType] || '')
      : (recursiveExamples[exampleType] || '');
  };

  // Ejemplos de descripción en lenguaje natural
  const getNaturalExamples = (exampleType) => {
    const iterativeExamples = {
      'busqueda-lineal': `Dame el algoritmo de búsqueda lineal`,
      'burbuja': `Dame el algoritmo de ordenamiento burbuja`,
      'insercion': `Dame el algoritmo de ordenamiento por inserción`,
      'seleccion': `Dame el algoritmo de ordenamiento por selección`,
      'suma-matriz': `Dame el algoritmo de suma de elementos en una matriz`,
      'buscar-while': `Dame el algoritmo de búsqueda con while`,
      'multiplicar-matrices': `Dame el algoritmo de multiplicación de matrices`,
      'encontrar-maximo': `Dame el algoritmo para encontrar el máximo en un array`,
      'contar-pares': `Dame el algoritmo para contar números pares en un array`,
      'buscar-par-suma': `Dame el algoritmo para buscar un par de números que sumen un objetivo`
    };

    const recursiveExamples = {
      // Por ahora vacío
    };

    return algorithmType === 'iterativo' 
      ? (iterativeExamples[exampleType] || '')
      : (recursiveExamples[exampleType] || '');
  };

  const loadExample = (exampleType) => {
    if (activeTab === 'natural') {
      const example = getNaturalExamples(exampleType);
      setNaturalInput(example);
      onCodeChange && onCodeChange({ 
        type: 'natural', 
        value: example
      });
    } else {
      const example = getPseudocodeExamples(exampleType);
      if (example) {
        setCodeInput(example);
        onCodeChange && onCodeChange({ 
          type: 'pseudocode', 
          value: example
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
          Pseudocódigo (.lark)
        </button>
      </div>

      {/* Algorithm Type Selector */}
      <div className="algorithm-type-selector">
        <label htmlFor="algorithm-type-select">Tipo de Algoritmo: </label>
        <select 
          id="algorithm-type-select"
          value={algorithmType} 
          onChange={(e) => setAlgorithmType(e.target.value)}
          className="algorithm-type-dropdown"
        >
          <option value="iterativo">Iterativo</option>
          <option value="recursivo">Recursivo</option>
        </select>
      </div>

      {/* Examples Section */}
      <div className="examples-section">
        <div className="examples-header">
          <h4>Ejemplos Predefinidos {algorithmType === 'iterativo' ? '(Iterativos)' : '(Recursivos)'}:</h4>
        </div>
        {algorithmType === 'iterativo' ? (
          <div className="examples-buttons">
            <button 
              className="example-btn" 
              onClick={() => loadExample('busqueda-lineal')}
              title="Búsqueda Lineal - O(n)"
            >
              Búsqueda Lineal
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('burbuja')}
              title="Ordenamiento Burbuja - O(n²)"
            >
              Burbuja
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('insercion')}
              title="Ordenamiento por Inserción - O(n²)"
            >
              Inserción
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('seleccion')}
              title="Ordenamiento por Selección - O(n²)"
            >
              Selección
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('suma-matriz')}
              title="Suma de Matriz - O(n*m)"
            >
              Suma Matriz
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('buscar-while')}
              title="Búsqueda con While - O(n)"
            >
              Búsqueda While
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('multiplicar-matrices')}
              title="Multiplicación de Matrices - O(n³)"
            >
              Mult. Matrices
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('encontrar-maximo')}
              title="Encontrar Máximo - O(n)"
            >
              Máximo
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('contar-pares')}
              title="Contar Pares - O(n)"
            >
              Contar Pares
            </button>
            <button 
              className="example-btn" 
              onClick={() => loadExample('buscar-par-suma')}
              title="Buscar Par de Suma - O(n²)"
            >
              Par Suma
            </button>
          </div>
        ) : (
          <div className="examples-placeholder">
            <p>Los ejemplos recursivos estarán disponibles próximamente...</p>
          </div>
        )}
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
              language="plaintext"
              value={codeInput}
              onChange={handleMonacoChange}
              theme="vs-dark"
              onMount={(editor, monaco) => {
                // Registrar lenguaje personalizado para pseudocódigo
                monaco.languages.register({ id: 'pseudocode' });
                
                // Definir tokens para resaltado de sintaxis
                monaco.languages.setMonarchTokensProvider('pseudocode', {
                  keywords: [
                    'begin', 'end', 'if', 'then', 'else', 'for', 'to', 'do',
                    'while', 'repeat', 'until', 'return', 'CALL', 'procedimiento',
                    'accion', 'and', 'or', 'not', 'div', 'mod', 'Clase'
                  ],
                  
                  operators: [
                    '🡨', '=', '==', '!=', '≠', '<>', '<', '>', '≤', '>=', '≥', '<=',
                    '+', '-', '*', '/', '┌', '┐', '└', '┘'
                  ],
                  
                  constants: ['T', 'F', 'NULL'],
                  
                  tokenizer: {
                    root: [
                      // Comentarios con ►
                      [/►.*$/, 'comment'],
                      
                      // Palabras clave
                      [/\b(begin|end|if|then|else|for|to|do|while|repeat|until|return|CALL|procedimiento|accion|and|or|not|div|mod|Clase)\b/, 'keyword'],
                      
                      // Constantes
                      [/\b(T|F|NULL)\b/, 'constant'],
                      
                      // Números
                      [/\b\d+\.?\d*\b/, 'number'],
                      
                      // Operador de asignación especial
                      [/🡨/, 'operator.special'],
                      
                      // Operadores
                      [/[=<>!≤≥≠+\-*\/┌┐└┘]/, 'operator'],
                      
                      // Nombres de funciones
                      [/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/, 'function'],
                      
                      // Identificadores
                      [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, 'identifier'],
                      
                      // Acceso a arrays
                      [/\[|\]/, 'bracket'],
                      
                      // Paréntesis
                      [/[()]/, 'delimiter.parenthesis'],
                    ]
                  }
                });
                
                // Definir tema personalizado
                monaco.editor.defineTheme('pseudocode-theme', {
                  base: 'vs-dark',
                  inherit: true,
                  rules: [
                    { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
                    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                    { token: 'operator.special', foreground: 'D16969', fontStyle: 'bold' },
                    { token: 'operator', foreground: 'D4D4D4' },
                    { token: 'function', foreground: 'DCDCAA' },
                    { token: 'constant', foreground: '4FC1FF' },
                    { token: 'number', foreground: 'B5CEA8' },
                    { token: 'identifier', foreground: '9CDCFE' },
                  ],
                  colors: {}
                });
                
                // Aplicar el lenguaje personalizado
                monaco.editor.setModelLanguage(editor.getModel(), 'pseudocode');
                monaco.editor.setTheme('pseudocode-theme');
              }}
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
                tabSize: 4,
                insertSpaces: true,
                renderLineHighlight: 'all',
                selectOnLineNumbers: true,
                mouseWheelZoom: true,
                cursorBlinking: 'blink',
                cursorStyle: 'line',
                suggest: {
                  showKeywords: true,
                  showSnippets: true
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default Editor;