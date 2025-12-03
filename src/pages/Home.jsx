import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      <div className="flex flex-1 justify-center py-5">
        <div className="flex w-full flex-col max-w-6xl px-4">
          
          {/* Hero Section */}
          <main className="w-full">
            <div className="py-16 sm:py-24">
              <div className="relative flex min-h-[480px] flex-col gap-6 overflow-hidden bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] opacity-80 z-0 rounded-xl"></div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                      Analizador de Complejidades de Algoritmos
                    </h1>
                    <h2 className="text-white/80 text-base sm:text-lg font-normal leading-normal max-w-2xl mx-auto">
                      Analiza automáticamente la complejidad temporal y espacial de tus algoritmos utilizando modelos de lenguaje avanzados.
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link 
                      to="/analyzer"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 sm:h-14 px-6 sm:px-8 bg-white text-gray-900 text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-transform hover:scale-105"
                    >
                      <span className="truncate">Empezar Análisis</span>
                    </Link>
                    <Link
                      to="/docs"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 sm:h-14 px-6 sm:px-8 bg-transparent border-2 border-white text-white text-base font-bold leading-normal tracking-wide hover:bg-white/10 transition-all hover:scale-105"
                    >
                      <span className="truncate">Ver Documentación</span>
                    </Link>
                  </div>
                  
                  {/* Feature Chips */}
                  <div className="flex gap-3 pt-6 flex-wrap justify-center">
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 backdrop-blur-sm px-4">
                      <span className="material-symbols-outlined text-white text-base">auto_awesome</span>
                      <p className="text-white text-sm font-medium leading-normal">LLM-powered</p>
                    </div>
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 backdrop-blur-sm px-4">
                      <span className="material-symbols-outlined text-white text-base">chat</span>
                      <p className="text-white text-sm font-medium leading-normal">Natural Language Input</p>
                    </div>
                    <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/10 backdrop-blur-sm px-4">
                      <span className="material-symbols-outlined text-white text-base">settings</span>
                      <p className="text-white text-sm font-medium leading-normal">Análisis Automático</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Section */}
            <section className="py-16 sm:py-24">
              <h2 className="text-center text-3xl font-bold leading-tight tracking-tight px-4 pb-12">
                Características Principales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                <div className="flex flex-1 flex-col gap-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:bg-white/10 transition-all">
                  <div className="text-primary text-3xl">
                    <span className="material-symbols-outlined">auto_fix_high</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Análisis Automático
                    </h3>
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Obtén la complejidad de tu código sin esfuerzo manual.
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:bg-white/10 transition-all">
                  <div className="text-primary text-3xl">
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Lenguaje Natural
                    </h3>
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Describe tu algoritmo en lenguaje natural y obtén el análisis.
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:bg-white/10 transition-all">
                  <div className="text-primary text-3xl">
                    <span className="material-symbols-outlined">bar_chart</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Visualizaciones
                    </h3>
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Comprende los resultados con gráficos y diagramas intuitivos.
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:bg-white/10 transition-all">
                  <div className="text-primary text-3xl">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-white text-lg font-bold leading-tight">
                      Análisis Detallado
                    </h3>
                    <p className="text-white/70 text-sm font-normal leading-normal">
                      Recibe un desglose completo del análisis de complejidad.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* How it Works Section */}
            <section className="py-16 sm:py-24">
              <h2 className="text-center text-3xl font-bold leading-tight tracking-tight px-4 pb-12">
                ¿Cómo funciona?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-2xl">
                    1
                  </div>
                  <h3 className="text-white text-xl font-bold mt-2">Ingresa tu algoritmo</h3>
                  <p className="text-white/70">
                    Pega tu código o descríbelo en lenguaje natural en nuestro editor intuitivo.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-2xl">
                    2
                  </div>
                  <h3 className="text-white text-xl font-bold mt-2">Procesamiento automático</h3>
                  <p className="text-white/70">
                    Nuestra IA analiza la estructura y operaciones para determinar la complejidad.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-2xl">
                    3
                  </div>
                  <h3 className="text-white text-xl font-bold mt-2">Resultados detallados</h3>
                  <p className="text-white/70">
                    Recibe un informe claro con la notación Big O y explicaciones visuales.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;