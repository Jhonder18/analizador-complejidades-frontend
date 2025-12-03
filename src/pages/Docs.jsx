const Docs = () => {
  return (
    <div className="flex h-full grow flex-row bg-background-dark">
      <aside className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-64 flex-shrink-0 border-r border-solid border-white/10 p-4 lg:flex lg:flex-col">
        <div className="flex h-full flex-col justify-between py-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-white text-base font-medium leading-normal px-3">Contenido</h1>
            <div className="flex flex-col gap-1">
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/20" href="#introduccion">
                <span className="material-symbols-outlined fill text-primary">description</span>
                <p className="text-white text-sm font-medium leading-normal">Introducción</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" href="#teoria">
                <span className="material-symbols-outlined text-white/80">timeline</span>
                <p className="text-white/80 text-sm font-medium leading-normal">Teoría de Complejidad</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" href="#uso">
                <span className="material-symbols-outlined text-white/80">integration_instructions</span>
                <p className="text-white/80 text-sm font-medium leading-normal">Cómo Usar</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" href="#ejemplos">
                <span className="material-symbols-outlined text-white/80">code_blocks</span>
                <p className="text-white/80 text-sm font-medium leading-normal">Ejemplos</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors" href="#faq">
                <span className="material-symbols-outlined text-white/80">quiz</span>
                <p className="text-white/80 text-sm font-medium leading-normal">FAQ</p>
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap gap-2 pb-4">
            <a className="text-[#9d9db8] text-sm font-medium leading-normal hover:text-white" href="#">Docs</a>
            <span className="text-[#9d9db8] text-sm font-medium leading-normal">/</span>
            <span className="text-white text-sm font-medium leading-normal">Introducción</span>
          </div>
          <article className="prose prose-invert prose-p:text-white/80 prose-headings:text-white max-w-none text-white/80">
            <section id="introduccion">
              <div className="flex flex-col gap-3 pb-8 border-b border-white/10 mb-8">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] !mb-3">
                  Introducción al Analizador de Complejidades
                </h1>
                <p className="text-[#9d9db8] text-lg font-normal leading-normal !mt-0">
                  Analiza la complejidad temporal y espacial de tus algoritmos utilizando el poder de los LLMs.
                </p>
              </div>
              <p>
                Bienvenido a la documentación del Analizador de Complejidades de Algoritmos. Nuestra herramienta aprovecha modelos de lenguaje avanzados para proporcionarte un análisis detallado de la eficiencia de tu código, ayudándote a entender y optimizar tus algoritmos de manera intuitiva.
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8">¿Qué es la Complejidad Algorítmica?</h2>
              <p>
                La complejidad algorítmica es una medida de cuántos recursos (tiempo y espacio) necesita un algoritmo para resolver un problema. Se expresa comúnmente utilizando la notación Big O, que describe el comportamiento del algoritmo a medida que el tamaño de la entrada crece.
              </p>
              
              <div className="my-8 rounded-xl border border-primary/30 bg-primary/20 p-6 flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl mt-1">lightbulb</span>
                <div>
                  <h3 className="text-white font-bold text-lg m-0">Nota Importante</h3>
                  <p className="text-white/90 text-base !m-0">
                    Nuestro analizador proporciona una estimación basada en LLMs. Siempre es buena práctica verificar los resultados y entender los principios fundamentales de la complejidad.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mt-8">Ejemplo de Código: Bubble Sort</h2>
              <p>
                A continuación se muestra un ejemplo de cómo puedes analizar un algoritmo simple como Bubble Sort.
              </p>
              
              <div className="relative group my-8">
                <pre className="bg-[#0D0D1A] rounded-xl p-4 border border-white/10"><code className="text-sm text-white/90">{`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`}</code></pre>
                <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-base">content_copy</span>
                </button>
              </div>
              
              <p>Al pasar este código a nuestro analizador, el resultado sería:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Complejidad Temporal:</strong>{' '}
                  <code className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded-md text-sm">O(n²)</code>
                </li>
                <li>
                  <strong>Complejidad Espacial:</strong>{' '}
                  <code className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded-md text-sm">O(1)</code>
                </li>
              </ul>
              
              <h2 className="text-2xl font-bold text-white mt-8">Diagrama de Flujo</h2>
              <p>Para visualizar el proceso, aquí hay un diagrama de flujo simplificado de cómo funciona nuestro servicio:</p>
              <div className="my-8 flex justify-center items-center bg-[#0D0D1A] border border-dashed border-white/20 rounded-xl p-8 min-h-60">
                <div className="text-center text-white/50">
                  <span className="material-symbols-outlined text-5xl">schema</span>
                  <p className="mt-2 text-sm">Diagrama del proceso de análisis</p>
                </div>
              </div>
            </section>

            <section id="teoria" className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Teoría de Complejidad</h2>
              
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">Complejidad Temporal</h3>
              <p>
                La complejidad temporal mide cuánto tiempo tarda un algoritmo en ejecutarse en función del tamaño de la entrada (n).
              </p>
              
              <div className="my-8">
                <h4 className="text-xl font-semibold text-white mb-4">Notaciones Comunes:</h4>
                <div className="overflow-x-auto bg-[#0D0D1A] rounded-xl border border-white/10">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-white/5 text-white uppercase border-b border-white/10">
                      <tr>
                        <th className="px-6 py-3">Notación</th>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Ejemplo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(1)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Constante</td>
                        <td className="px-6 py-4 text-white/80">Acceso a array por índice</td>
                      </tr>
                      <tr className="bg-white/5 hover:bg-white/10">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(log n)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Logarítmica</td>
                        <td className="px-6 py-4 text-white/80">Búsqueda binaria</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(n)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Lineal</td>
                        <td className="px-6 py-4 text-white/80">Búsqueda secuencial</td>
                      </tr>
                      <tr className="bg-white/5 hover:bg-white/10">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(n log n)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Linearítmica</td>
                        <td className="px-6 py-4 text-white/80">Merge sort, Quick sort</td>
                      </tr>
                      <tr className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(n²)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Cuadrática</td>
                        <td className="px-6 py-4 text-white/80">Bubble sort, Selection sort</td>
                      </tr>
                      <tr className="bg-white/5 hover:bg-white/10">
                        <td className="px-6 py-4">
                          <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(2ⁿ)</code>
                        </td>
                        <td className="px-6 py-4 text-white/80">Exponencial</td>
                        <td className="px-6 py-4 text-white/80">Fibonacci recursivo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">Complejidad Espacial</h3>
              <p>
                La complejidad espacial mide cuánta memoria adicional utiliza un algoritmo en función del tamaño de la entrada.
              </p>
            </section>

            <section id="uso" className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Cómo Usar la Herramienta</h2>
              
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">1. Seleccionar Modo de Entrada</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-white">Lenguaje Natural:</strong> Describe tu algoritmo en palabras</li>
                <li><strong className="text-white">Pseudocódigo:</strong> Escribe tu algoritmo en formato de pseudocódigo estructurado</li>
              </ul>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">2. Ingresar Algoritmo</h3>
              <p>Según el modo seleccionado:</p>
              
              <div className="my-6">
                <h4 className="text-xl font-semibold text-white mb-3">Ejemplo en Lenguaje Natural:</h4>
                <div className="relative group">
                  <pre className="bg-[#0D0D1A] rounded-xl p-4 border border-white/10"><code className="text-sm text-white/90">{`"Tengo un algoritmo que recorre un arreglo de números 
y para cada elemento, busca si existe otro elemento 
que sumado con él dé como resultado un número objetivo"`}</code></pre>
                  <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-base">content_copy</span>
                  </button>
                </div>
              </div>

              <div className="my-6">
                <h4 className="text-xl font-semibold text-white mb-3">Ejemplo en Pseudocódigo:</h4>
                <div className="relative group">
                  <pre className="bg-[#0D0D1A] rounded-xl p-4 border border-white/10"><code className="text-sm text-white/90 font-mono">{`buscar_par_suma(A, n, objetivo)
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
end`}</code></pre>
                  <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-base">content_copy</span>
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">3. Analizar y Revisar Resultados</h3>
              <p>El sistema proporcionará:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Complejidad temporal y espacial</li>
                <li>Explicación detallada del análisis</li>
                <li>Visualizaciones (cuando sea aplicable)</li>
              </ul>
            </section>

            <section id="ejemplos" className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Ejemplos</h2>
              
              <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6 mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Búsqueda Lineal</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Pseudocódigo:</h4>
                    <div className="relative group">
                      <pre className="bg-[#0D0D1A] rounded-lg p-4 border border-white/10"><code className="text-sm text-white/90 font-mono">{`busqueda_lineal(A, n, x)
begin
    for i 🡨 1 to n do
    begin
        if (A[i] = x) then
        begin
            return i
        end
    end
    return -1
end`}</code></pre>
                      <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-base">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Análisis:</h4>
                    <ul className="space-y-3">
                      <li>
                        <strong className="text-white">Complejidad Temporal:</strong>{' '}
                        <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(n)</code>
                      </li>
                      <li>
                        <strong className="text-white">Complejidad Espacial:</strong>{' '}
                        <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(1)</code>
                      </li>
                      <li>
                        <strong className="text-white">Explicación:</strong>{' '}
                        <span className="text-white/80">Recorre el arreglo secuencialmente hasta encontrar el elemento buscado.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ordenamiento Burbuja</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Pseudocódigo:</h4>
                    <div className="relative group">
                      <pre className="bg-[#0D0D1A] rounded-lg p-4 border border-white/10"><code className="text-sm text-white/90 font-mono">{`burbuja(A, n)
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
end`}</code></pre>
                      <button className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-base">content_copy</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Análisis:</h4>
                    <ul className="space-y-3">
                      <li>
                        <strong className="text-white">Complejidad Temporal:</strong>{' '}
                        <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(n²)</code>
                      </li>
                      <li>
                        <strong className="text-white">Complejidad Espacial:</strong>{' '}
                        <code className="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">O(1)</code>
                      </li>
                      <li>
                        <strong className="text-white">Explicación:</strong>{' '}
                        <span className="text-white/80">Dos bucles anidados comparan elementos adyacentes y los intercambian.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <a
                  href="/examples"
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all shadow-lg shadow-primary/30"
                >
                  <span className="material-symbols-outlined">code_blocks</span>
                  Ver más ejemplos
                </a>
              </div>
            </section>

            <section id="faq" className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
              
              <div className="space-y-6">
                <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    ¿Cómo funciona el analizador?
                  </h3>
                  <p className="text-white/80">
                    Nuestro analizador utiliza modelos de lenguaje avanzados (LLMs) basados en agentes de IA que comprenden tanto código como lenguaje natural. Estos agentes analizan la estructura algorítmica, identifican patrones de complejidad y generan explicaciones detalladas del comportamiento temporal y espacial.
                  </p>
                </div>

                <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    ¿Qué formatos de entrada acepta?
                  </h3>
                  <p className="text-white/80">
                    Puedes ingresar algoritmos en pseudocódigo o describirlos en lenguaje natural. El sistema LLM está entrenado para comprender múltiples formas de expresar algoritmos y extraer su complejidad computacional independientemente del formato.
                  </p>
                </div>

                <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    ¿Puedo analizar algoritmos recursivos?
                  </h3>
                  <p className="text-white/80">
                    Sí, nuestro sistema basado en LLMs puede analizar tanto algoritmos iterativos como recursivos. Los agentes de IA identifican las relaciones de recurrencia y aplican métodos como el teorema maestro para determinar la complejidad.
                  </p>
                </div>

                <div className="bg-[#1c1c26] rounded-xl border border-white/10 p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    ¿Qué tan preciso es el análisis?
                  </h3>
                  <p className="text-white/80">
                    Los LLMs proporcionan análisis muy precisos en la mayoría de casos comunes. Sin embargo, para algoritmos muy complejos o poco convencionales, siempre recomendamos validar los resultados con análisis manual o pruebas empíricas.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
              <p className="text-sm text-white/50">¿Fue útil esta página?</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-base">thumb_up</span> Sí
                </button>
                <button className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-base">thumb_down</span> No
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default Docs;