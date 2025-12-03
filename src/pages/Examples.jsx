import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Examples = () => {
  const [selectedType, setSelectedType] = useState('iterativo');
  const navigate = useNavigate();

  const iterativeExamples = [
    {
      name: 'Búsqueda Lineal',
      code: `busqueda_lineal(A, n, x)
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
      complexity: 'O(n)',
      description: 'Recorre el arreglo secuencialmente hasta encontrar el elemento.'
    },
    {
      name: 'Ordenamiento Burbuja',
      code: `burbuja(A, n)
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
      complexity: 'O(n²)',
      description: 'Compara elementos adyacentes y los intercambia si están en orden incorrecto.'
    },
    {
      name: 'Ordenamiento por Selección',
      code: `seleccion(A, n)
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
      complexity: 'O(n²)',
      description: 'Encuentra el elemento más pequeño y lo coloca en su posición correcta.'
    },
    {
      name: 'Encontrar Máximo',
      code: `encontrar_maximo(A, n)
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
      complexity: 'O(n)',
      description: 'Recorre el arreglo para encontrar el valor máximo.'
    },
    {
      name: 'Contar Números Pares',
      code: `contar_pares(A, n)
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
      complexity: 'O(n)',
      description: 'Cuenta cuántos números pares hay en el arreglo.'
    },
    {
      name: 'Buscar Par que Sume Objetivo',
      code: `buscar_par_suma(A, n, objetivo)
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
      complexity: 'O(n²)',
      description: 'Busca dos números en el arreglo que sumen un valor objetivo.'
    }
  ];

  const recursiveExamples = [
    {
      name: 'Factorial',
      code: `factorial(n)
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
      complexity: 'O(n)',
      description: 'Calcula el factorial de un número de forma recursiva.'
    },
    {
      name: 'Fibonacci',
      code: `fibonacci(n)
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
      complexity: 'O(2ⁿ)',
      description: 'Calcula el n-ésimo número de Fibonacci recursivamente.'
    },
    {
      name: 'Búsqueda Binaria',
      code: `busqueda_binaria(A, inicio, fin, x)
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
      complexity: 'O(log n)',
      description: 'Busca un elemento en un arreglo ordenado dividiendo el espacio de búsqueda a la mitad.'
    },
    {
      name: 'Torre de Hanoi',
      code: `hanoi(n, origen, destino, auxiliar)
begin
    if (n = 1) then
    begin
        mover disco de origen a destino
        return
    end
    hanoi(n-1, origen, auxiliar, destino)
    mover disco de origen a destino
    hanoi(n-1, auxiliar, destino, origen)
end`,
      complexity: 'O(2ⁿ)',
      description: 'Resuelve el problema de las Torres de Hanoi recursivamente.'
    }
  ];

  const examples = selectedType === 'iterativo' ? iterativeExamples : recursiveExamples;

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background-dark">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-col gap-3 text-center mb-12">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Ejemplos de Algoritmos
          </h1>
          <p className="text-[#9d9db8] text-lg font-normal leading-normal">
            Explora ejemplos de algoritmos iterativos y recursivos en pseudocódigo
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedType('iterativo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedType === 'iterativo'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">sync</span>
              Iterativos ({iterativeExamples.length})
            </span>
          </button>
          <button
            onClick={() => setSelectedType('recursivo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedType === 'recursivo'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">autorenew</span>
              Recursivos ({recursiveExamples.length})
            </span>
          </button>
        </div>

        {/* Examples Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <div
              key={index}
              className="bg-[#1c1c26] rounded-xl border border-white/10 overflow-hidden hover:border-primary/50 transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{example.name}</h3>
                    <p className="text-[#9d9db8] text-sm">{example.description}</p>
                  </div>
                  <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-mono">
                    {example.complexity}
                  </div>
                </div>

                <div className="relative group">
                  <pre className="bg-[#0D0D1A] rounded-lg p-4 border border-white/10 overflow-x-auto">
                    <code className="text-sm text-white/90 font-mono whitespace-pre">
                      {example.code}
                    </code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(example.code)}
                    className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar código"
                  >
                    <span className="material-symbols-outlined text-white text-base">content_copy</span>
                  </button>
                </div>

                <Link
                  to="/analyzer"
                  state={{ exampleCode: example.code }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-colors border border-primary/30"
                >
                  <span className="material-symbols-outlined">analytics</span>
                  Analizar este ejemplo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/docs')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver a Documentación
          </button>
        </div>
      </div>
    </div>
  );
};

export default Examples;
