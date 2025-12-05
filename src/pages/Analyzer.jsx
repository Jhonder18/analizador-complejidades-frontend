import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import LoadingAnimation from '../components/LoadingAnimation';
import { analyzeComplexity } from '../services/api';
// Mock deshabilitado - usando backend real
// import { getFibonacciMockData, isFibonacciCode } from '../data/fibonacciMock';

const Analyzer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('natural');
  const [naturalInput, setNaturalInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [algorithmType, setAlgorithmType] = useState('iterativo');
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar ejemplo desde la navegación
  useEffect(() => {
    if (location.state?.exampleCode) {
      setActiveTab('code');
      setCodeInput(location.state.exampleCode);
      // Limpiar el state después de cargar
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleAnalyze = async () => {
    const inputValue = activeTab === 'natural' ? naturalInput : codeInput;
    
    if (!inputValue.trim()) {
      setError('Por favor ingresa código o descripción para analizar');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Análisis con la API real (mock deshabilitado)
      const result = await analyzeComplexity({
        input: inputValue,
        text: inputValue,
        language_hint: 'es'
      });
      
      console.log('Analysis result:', result);
      
      navigate('/results', {
        state: {
          analysisResult: result,
          inputData: {
            type: activeTab,
            value: inputValue,
            algorithmType: result.mode || algorithmType,
            isMocked: false
          }
        }
      });
    } catch (err) {
      setError('Error al analizar el código: ' + (err.message || 'Error desconocido'));
      console.error('Analysis error:', err);
      setLoading(false);
    }
  };

  const handleClear = () => {
    setError(null);
    setNaturalInput('');
    setCodeInput('');
  };

  const getAvailableExamples = () => {
    if (algorithmType === 'iterativo') {
      return [
        { value: '', label: 'Selecciona un ejemplo' },
        { value: 'busqueda-lineal', label: 'Búsqueda Lineal' },
        { value: 'ordenamiento', label: 'Ordenamiento Burbuja' },
        { value: 'seleccion', label: 'Ordenamiento por Selección' },
        { value: 'maximo', label: 'Encontrar Máximo' },
        { value: 'contar-pares', label: 'Contar Números Pares' },
        { value: 'par-suma', label: 'Buscar Par que Sume Objetivo' }
      ];
    } else {
      return [
        { value: '', label: 'Selecciona un ejemplo' },
        { value: 'fibonacci', label: 'Fibonacci (Demo)' },
        { value: 'factorial', label: 'Factorial' },
        { value: 'busqueda-binaria', label: 'Búsqueda Binaria' },
        { value: 'torre-hanoi', label: 'Torre de Hanoi' }
      ];
    }
  };

  const loadExample = (exampleType) => {
    if (!exampleType) return;

    const examples = {
      'busqueda-lineal': 'Dame el algoritmo de búsqueda lineal',
      'ordenamiento': 'Dame el algoritmo de ordenamiento burbuja',
      'seleccion': 'Dame el algoritmo de ordenamiento por selección',
      'maximo': 'Dame el algoritmo para encontrar el máximo en un array',
      'contar-pares': 'Dame el algoritmo para contar números pares en un array',
      'par-suma': 'Dame el algoritmo para buscar un par de números que sumen un objetivo',
      'fibonacci': 'Dame el algoritmo de Fibonacci recursivo',
      'factorial': 'Dame el algoritmo de factorial recursivo',
      'busqueda-binaria': 'Dame el algoritmo de búsqueda binaria recursiva',
      'torre-hanoi': 'Dame el algoritmo de las Torres de Hanoi'
    };

    const codeExamples = {
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
      'ordenamiento': `burbuja(A, n)
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
      'maximo': `encontrar_maximo(A, n)
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
      'par-suma': `buscar_par_suma(A, n, objetivo)
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
end`,
      'fibonacci': `fibonacci(n)
begin
    if (n <= 1) then
    begin
        return n
    end
    else
    begin
        return fibonacci(n-1) + fibonacci(n-2)
    end
end`,
      'factorial': `factorial(n)
begin
    if (n = 0 or n = 1) then
    begin
        return 1
    end
    else
    begin
        return n * factorial(n-1)
    end
end`,
      'busqueda-binaria': `busqueda_binaria(A, inicio, fin, x)
begin
    if (inicio > fin) then
    begin
        return -1
    end
    medio 🡨 (inicio + fin) / 2
    if (A[medio] = x) then
    begin
        return medio
    end
    else if (A[medio] > x) then
    begin
        return busqueda_binaria(A, inicio, medio-1, x)
    end
    else
    begin
        return busqueda_binaria(A, medio+1, fin, x)
    end
end`,
      'torre-hanoi': `hanoi(n, origen, destino, auxiliar)
begin
    if (n = 1) then
    begin
        mover disco de origen a destino
        return
    end
    hanoi(n-1, origen, auxiliar, destino)
    mover disco de origen a destino
    hanoi(n-1, auxiliar, destino, origen)
end`
    };

    if (activeTab === 'natural') {
      setNaturalInput(examples[exampleType] || '');
    } else {
      setCodeInput(codeExamples[exampleType] || '');
    }
  };

  return (
    <>
      {loading && <LoadingAnimation message="Analizando complejidad..." />}

      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Page Heading */}
          <div className="flex flex-col gap-3 text-center mb-8">
            <p className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">
              Analizador de Complejidades
            </p>
            <p className="text-slate-400 text-base font-normal leading-normal max-w-2xl">
              Ingresa un algoritmo en código o lenguaje natural para obtener su análisis de complejidad
            </p>
          </div>

          {/* Editor Panel */}
          <div className="relative w-full rounded-lg bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-primary/10 p-6 sm:p-8">
            <div className="absolute inset-0 rounded-lg bg-primary/5 blur-xl -z-10"></div>
            
            <div className="flex flex-col space-y-6">
              {/* Tabs */}
              <div className="border-b border-white/10">
                <div className="flex gap-4 sm:gap-8">
                  <button
                    onClick={() => setActiveTab('natural')}
                    className="relative flex flex-col items-center justify-center pb-[13px] pt-2"
                  >
                    <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === 'natural' ? 'text-white' : 'text-slate-400'
                    }`}>
                      Lenguaje Natural
                    </p>
                    {activeTab === 'natural' && (
                      <div className="absolute bottom-0 h-1 w-full rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary)]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="relative flex flex-col items-center justify-center pb-[13px] pt-2"
                  >
                    <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                      activeTab === 'code' ? 'text-white' : 'text-slate-400'
                    }`}>
                      Pseudocódigo
                    </p>
                    {activeTab === 'code' && (
                      <div className="absolute bottom-0 h-1 w-full rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary)]"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Examples Section - All in one line */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Tipo de Algoritmo */}
                  <div className="flex items-center gap-3">
                    <label className="text-white text-sm font-semibold whitespace-nowrap">
                      Tipo de ejemplos:
                    </label>
                    <div className="relative">
                      <select
                        value={algorithmType}
                        onChange={(e) => setAlgorithmType(e.target.value)}
                        className="appearance-none bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-white/20 text-white rounded-lg px-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/50 transition-all cursor-pointer shadow-lg"
                        style={{
                          backgroundImage: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
                          color: 'white'
                        }}
                      >
                        <option value="iterativo" style={{ background: '#1a1a2e', color: 'white' }}>Iterativo</option>
                        <option value="recursivo" style={{ background: '#1a1a2e', color: 'white' }}>Recursivo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Separador vertical */}
                  <div className="h-8 w-px bg-white/20"></div>

                  {/* Ejemplos Selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-white text-sm font-semibold whitespace-nowrap">
                      Ejemplos:
                    </label>
                    <div className="relative min-w-[250px]">
                      <select
                        onChange={(e) => loadExample(e.target.value)}
                        className="appearance-none w-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-2 border-white/20 text-white rounded-lg px-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary hover:border-primary/50 transition-all cursor-pointer shadow-lg"
                        style={{
                          backgroundImage: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
                          color: 'white'
                        }}
                      >
                        {getAvailableExamples().map((example) => (
                          <option 
                            key={example.value} 
                            value={example.value}
                            style={{ background: '#1a1a2e', color: 'white' }}
                          >
                            {example.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/60">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex flex-col gap-4">

                {/* Input Field */}
                {activeTab === 'natural' ? (
                  <textarea
                    value={naturalInput}
                    onChange={(e) => setNaturalInput(e.target.value)}
                    className="form-textarea w-full rounded bg-[#111121] border border-white/20 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder:text-slate-500 min-h-[200px] p-4 mt-2"
                    placeholder="Describe tu algoritmo en lenguaje natural..."
                  />
                ) : (
                  <div className="mt-2 rounded overflow-hidden border border-white/20">
                    <MonacoEditor
                      height="300px"
                      language="plaintext"
                      value={codeInput}
                      onChange={(value) => setCodeInput(value || '')}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
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
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full h-12 px-6 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                  <span className="truncate">Limpiar</span>
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || (!naturalInput.trim() && !codeInput.trim())}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full h-12 px-8 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity shadow-[0_0_20px_theme(colors.primary/50%)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  <span className="truncate">{loading ? 'Analizando...' : 'Analizar'}</span>
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center text-xs text-slate-500 border-t border-white/10 px-6 py-2 mt-8">
              <span>Tipo de entrada: {activeTab === 'natural' ? 'Lenguaje Natural' : 'Pseudocódigo'}</span>
              <span>Motor: LLM + Parser</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Analyzer;