# 🧮 Analizador de Complejidades Algorítmicas

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?style=for-the-badge&logo=vite)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-4.7.0-007acc?style=for-the-badge&logo=visual-studio-code)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Una aplicación web moderna para analizar la complejidad algorítmica con editor de código integrado**

[🚀 Demo en Vivo](#demo) • [📖 Documentación](#documentación) • [🔧 Instalación](#instalación) • [🤝 Contribuir](#contribuir)

</div>

---

## 📝 Descripción

El **Analizador de Complejidades Algorítmicas** es una herramienta educativa y profesional diseñada para ayudar a estudiantes y desarrolladores a comprender y analizar la complejidad temporal y espacial de algoritmos. La aplicación proporciona un entorno interactivo con editor de código integrado y análisis detallado de rendimiento.

### ✨ Características Principales

- 🖥️ **Editor de Código Avanzado**: Monaco Editor (mismo editor de VS Code) con syntax highlighting
- 📊 **Análisis Detallado**: Evaluación completa de complejidad temporal y espacial
- 🎯 **Casos de Prueba**: Análisis de mejor caso, caso promedio y peor caso
- 🔍 **Pseudocódigo**: Generación automática con análisis de costos por línea
- 🌙 **Tema Oscuro/Claro**: Interfaz adaptable con persistencia de preferencias
- 🤖 **IA Integrada**: Botón "Arreglar con IA" para optimización automática de código
- 📱 **Responsive Design**: Funciona perfectamente en desktop, tablet y móvil
- ⚡ **Rendimiento Optimizado**: Construido con Vite para carga ultrarrápida

## 🎥 Demo

### Vista Principal
```
┌─────────────────────────────────────────────────────────────┐
│  🧮 Analizador de Complejidades         🌙 [Tema] [Idioma]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📝 Editor de Código                                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ def bubble_sort(arr):                                   │ │
│  │     n = len(arr)                                        │ │
│  │     for i in range(n):                                  │ │
│  │         for j in range(0, n-i-1):                       │ │
│  │             if arr[j] > arr[j+1]:                       │ │
│  │                 arr[j], arr[j+1] = arr[j+1], arr[j]     │ │
│  │     return arr                                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  📊 Análisis de Complejidad                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ⏱️  Temporal: O(n²)   💾 Espacial: O(1)                │ │
│  │ 📈 Mejor caso: O(n)   📊 Caso promedio: O(n²)          │ │
│  │ 📉 Peor caso: O(n²)                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/Jhonder18/analizador-complejidades-frontend.git
cd analizador-complejidades-frontend

# Instalar dependencias (opción 1 - recomendada)
npm install

# Instalar dependencias (opción 2 - manual)
npm install @monaco-editor/react@^4.7.0 react@^19.1.1 react-dom@^19.1.1 react-router-dom@^7.9.3

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Automáticos

**Windows:**
```cmd
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

Para más opciones de instalación, consulta [`dependencies.txt`](./dependencies.txt) o [`README-INSTALLATION.md`](./README-INSTALLATION.md).

## 🎯 Uso

### 1. **Análisis Básico**
```bash
1. Abre http://localhost:5173
2. Escribe o pega tu código en el editor
3. Presiona "Analizar" para obtener resultados instantáneos
```

### 2. **Ejemplos Incluidos**
La aplicación incluye ejemplos predefinidos:
- Ordenamiento burbuja
- Búsqueda binaria  
- Algoritmos de grafos
- Estructuras de datos básicas

### 3. **Funciones Avanzadas**
- **Arreglar con IA**: Optimiza automáticamente tu código
- **Exportar Resultados**: Guarda el análisis en formato PDF/JSON
- **Comparar Algoritmos**: Analiza múltiples implementaciones lado a lado

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Editor.jsx       # Editor Monaco integrado
│   ├── ComplexityAnalysis.jsx  # Motor de análisis
│   └── OutputPanel.jsx  # Panel de resultados
├── contexts/            # Context API
│   └── ThemeContext.jsx # Gestión de temas
├── pages/              # Páginas principales  
│   └── Analyzer.jsx    # Página principal del analizador
├── services/           # Lógica de negocio
│   └── complexityService.js # Servicio de análisis
└── assets/            # Recursos estáticos
```

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.1.1 | Framework frontend |
| **Vite** | 7.1.7 | Build tool y dev server |
| **Monaco Editor** | 4.7.0 | Editor de código |
| **React Router** | 7.9.3 | Enrutamiento |
| **ESLint** | 9.36.0 | Linting y calidad de código |

## 📊 Características Técnicas

### Análisis de Complejidad
- ⏱️ **Temporal**: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n), O(n!)
- 💾 **Espacial**: Análisis de memoria utilizada
- 📈 **Casos**: Mejor, promedio y peor caso
- 🔍 **Pseudocódigo**: Generación automática con costos por línea

### Editor de Código
- 🎨 **Syntax Highlighting** para múltiples lenguajes
- 🔧 **IntelliSense** y autocompletado
- 🎯 **Detección de Errores** en tiempo real
- 📝 **Múltiples Temas** (claro, oscuro, high contrast)

### Rendimiento
- ⚡ **Carga Rápida**: < 2s tiempo inicial de carga
- 🔄 **Hot Reload**: Cambios instantáneos durante desarrollo
- 📱 **Responsive**: Optimizado para todos los dispositivos
- 🎛️ **Lazy Loading**: Carga componentes bajo demanda

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo (http://localhost:5173)
npm run build        # Build de producción
npm run preview      # Previsualizar build de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores automáticamente

# Utilidades
npm run clean        # Limpiar dist/ y node_modules/
npm run deps:check   # Verificar dependencias desactualizadas
```

## 🌐 Browsers Soportados

| Browser | Versión Mínima |
|---------|----------------|
| Chrome | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Edge | 88+ |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [guía de contribución](CONTRIBUTING.md).

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Desarrollo Local

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/analizador-complejidades-frontend.git

# Instalar dependencias
npm install

# Crear rama de desarrollo
git checkout -b mi-nueva-feature

# Iniciar desarrollo
npm run dev
```

## 📋 Roadmap

### 🎯 Próximas Funcionalidades

- [ ] **Análisis de Memoria**: Visualización detallada del uso de memoria
- [ ] **Grafos de Complejidad**: Representación visual de crecimiento
- [ ] **Comparador de Algoritmos**: Análisis lado a lado
- [ ] **Exportar Reportes**: PDF, JSON, HTML
- [ ] **API Backend**: Análisis más profundo con IA
- [ ] **Colaboración**: Compartir análisis con otros usuarios
- [ ] **Móvil**: Aplicación nativa React Native

### 🔧 Mejoras Técnicas

- [ ] **Tests Unitarios**: Cobertura completa con Jest
- [ ] **E2E Testing**: Cypress para pruebas de interfaz
- [ ] **PWA**: Progressive Web App con offline support
- [ ] **Docker**: Containerización para deployment
- [ ] **CI/CD**: Pipeline automatizado
- [ ] **Monorepo**: Separar frontend/backend

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Jhonder Pacheco**
- GitHub: [@Jhonder18](https://github.com/Jhonder18)
- Email: jhonder.dev@gmail.com
- LinkedIn: [Jhonder Pacheco](https://linkedin.com/in/jhonder-pacheco)

## 🙏 Agradecimientos

- **Monaco Editor** por el increíble editor de código
- **React Team** por el framework
- **Vite Team** por la herramienta de build ultrarrápida
- **Comunidad Open Source** por las librerías utilizadas

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 📧 **Email**: jhonder.dev@gmail.com
- 🐛 **Issues**: [Reportar bug](https://github.com/Jhonder18/analizador-complejidades-frontend/issues)
- 💬 **Discussions**: [Discusiones del proyecto](https://github.com/Jhonder18/analizador-complejidades-frontend/discussions)

---

<div align="center">

**⭐ ¡No olvides dar una estrella si te gusta el proyecto! ⭐**

Made with ❤️ by [Jhonder Pacheco](https://github.com/Jhonder18)

</div>
