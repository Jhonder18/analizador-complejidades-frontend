const Docs = () => {
  return (
    <div className="docs-page">
      <div className="docs-container">
        <aside className="docs-sidebar">
          <nav className="docs-nav">
            <h3>Contenido</h3>
            <ul>
              <li><a href="#introduccion">Introducción</a></li>
              <li><a href="#teoria">Teoría de Complejidad</a></li>
              <li><a href="#uso">Cómo Usar</a></li>
              <li><a href="#ejemplos">Ejemplos</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>
        </aside>

        <main className="docs-content">
          <section id="introduccion" className="docs-section">
            <h1>Documentación</h1>
            <p>
              Bienvenido a la documentación del Analizador de Complejidades de Algoritmos. 
              Esta herramienta te permite analizar la complejidad temporal y espacial de algoritmos 
              tanto a partir de código fuente como de descripciones en lenguaje natural.
            </p>
          </section>

          <section id="teoria" className="docs-section">
            <h2>Teoría de Complejidad</h2>
            
            <h3>Complejidad Temporal</h3>
            <p>
              La complejidad temporal mide cuánto tiempo tarda un algoritmo en ejecutarse 
              en función del tamaño de la entrada (n).
            </p>
            
            <div className="complexity-table">
              <h4>Notaciones Comunes:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Notación</th>
                    <th>Nombre</th>
                    <th>Ejemplo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>O(1)</td>
                    <td>Constante</td>
                    <td>Acceso a array por índice</td>
                  </tr>
                  <tr>
                    <td>O(log n)</td>
                    <td>Logarítmica</td>
                    <td>Búsqueda binaria</td>
                  </tr>
                  <tr>
                    <td>O(n)</td>
                    <td>Lineal</td>
                    <td>Búsqueda secuencial</td>
                  </tr>
                  <tr>
                    <td>O(n log n)</td>
                    <td>Linearítmica</td>
                    <td>Merge sort, Quick sort</td>
                  </tr>
                  <tr>
                    <td>O(n²)</td>
                    <td>Cuadrática</td>
                    <td>Bubble sort, Selection sort</td>
                  </tr>
                  <tr>
                    <td>O(2ⁿ)</td>
                    <td>Exponencial</td>
                    <td>Fibonacci recursivo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Complejidad Espacial</h3>
            <p>
              La complejidad espacial mide cuánta memoria adicional utiliza un algoritmo 
              en función del tamaño de la entrada.
            </p>
          </section>

          <section id="uso" className="docs-section">
            <h2>Cómo Usar la Herramienta</h2>
            
            <h3>1. Seleccionar Modo de Entrada</h3>
            <ul>
              <li><strong>Lenguaje Natural:</strong> Describe tu algoritmo en palabras</li>
              <li><strong>Código:</strong> Pega directamente tu código fuente</li>
            </ul>

            <h3>2. Ingresar Algoritmo</h3>
            <p>Según el modo seleccionado:</p>
            <div className="code-example">
              <h4>Ejemplo en Lenguaje Natural:</h4>
              <pre>
{`"Tengo un algoritmo que recorre un arreglo de números 
y para cada elemento, busca si existe otro elemento 
que sumado con él dé como resultado un número objetivo"`}
              </pre>
            </div>

            <div className="code-example">
              <h4>Ejemplo en Código (Python):</h4>
              <pre>
{`def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`}
              </pre>
            </div>

            <h3>3. Analizar y Revisar Resultados</h3>
            <p>El sistema proporcionará:</p>
            <ul>
              <li>Complejidad temporal y espacial</li>
              <li>Explicación detallada del análisis</li>
              <li>Visualizaciones (cuando sea aplicable)</li>
            </ul>
          </section>

          <section id="ejemplos" className="docs-section">
            <h2>Ejemplos</h2>
            
            <div className="example-card">
              <h3>Búsqueda Lineal</h3>
              <div className="example-content">
                <div className="example-code">
                  <h4>Código:</h4>
                  <pre>
{`def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`}
                  </pre>
                </div>
                <div className="example-analysis">
                  <h4>Análisis:</h4>
                  <ul>
                    <li><strong>Complejidad Temporal:</strong> O(n)</li>
                    <li><strong>Complejidad Espacial:</strong> O(1)</li>
                    <li><strong>Explicación:</strong> En el peor caso, debemos revisar todos los elementos del arreglo</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="example-card">
              <h3>Ordenamiento Burbuja</h3>
              <div className="example-content">
                <div className="example-code">
                  <h4>Código:</h4>
                  <pre>
{`def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`}
                  </pre>
                </div>
                <div className="example-analysis">
                  <h4>Análisis:</h4>
                  <ul>
                    <li><strong>Complejidad Temporal:</strong> O(n²)</li>
                    <li><strong>Complejidad Espacial:</strong> O(1)</li>
                    <li><strong>Explicación:</strong> Dos bucles anidados que recorren el arreglo</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="api" className="docs-section">
            <h2>API Reference</h2>
            
            <h3>Endpoint de Análisis</h3>
            <div className="api-endpoint">
              <code>POST /api/analyze</code>
            </div>
            
            <h4>Parámetros de Entrada:</h4>
            <pre className="api-example">
{`{
  "input": "string",     // Código o descripción
  "type": "code|natural", // Tipo de entrada
  "language": "python|javascript|java|cpp" // Opcional
}`}
            </pre>

            <h4>Respuesta:</h4>
            <pre className="api-example">
{`{
  "timeComplexity": "O(n²)",
  "spaceComplexity": "O(1)",
  "explanation": "Análisis detallado...",
  "analysisTime": "1.2s",
  "detectedAlgorithms": ["bubble_sort"],
  "diagram": { ... } // Opcional
}`}
            </pre>
          </section>

          <section id="faq" className="docs-section">
            <h2>Preguntas Frecuentes</h2>
            
            <div className="faq-item">
              <h3>¿Qué lenguajes de programación soporta?</h3>
              <p>
                Actualmente soportamos Python, JavaScript, Java y C++. 
                También puedes usar lenguaje natural para describir algoritmos.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Qué tan preciso es el análisis?</h3>
              <p>
                El análisis utiliza técnicas de análisis estático y machine learning 
                para proporcionar estimaciones precisas de complejidad en la mayoría de casos comunes.
              </p>
            </div>

            <div className="faq-item">
              <h3>¿Puedo analizar algoritmos recursivos?</h3>
              <p>
                Sí, la herramienta puede analizar algoritmos recursivos y calcular 
                su complejidad usando el teorema maestro y otros métodos de análisis.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Docs;