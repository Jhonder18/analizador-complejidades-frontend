# Guía de Contribución

¡Gracias por tu interés en contribuir al Analizador de Complejidades Algorítmicas! 🎉

## 📋 Código de Conducta

Este proyecto se adhiere al [Contributor Covenant](https://www.contributor-covenant.org/). Se espera que todos los participantes sigan este código de conducta.

## 🚀 Cómo Contribuir

### Reportar Bugs 🐛

1. **Verifica** que el bug no haya sido reportado antes
2. **Usa** la plantilla de issue para bugs
3. **Incluye** pasos para reproducir el error
4. **Añade** capturas de pantalla si es relevante

### Sugerir Funcionalidades 💡

1. **Abre** un issue con la etiqueta "enhancement"
2. **Describe** claramente la funcionalidad propuesta
3. **Explica** por qué sería útil para los usuarios
4. **Considera** la complejidad de implementación

### Pull Requests 🔄

#### Antes de Enviar

- [ ] Fork el repositorio
- [ ] Crea una rama desde `main`
- [ ] Sigue las convenciones de código
- [ ] Añade tests si aplica
- [ ] Actualiza la documentación
- [ ] Verifica que todos los tests pasen

#### Proceso

1. **Fork** el proyecto
2. **Crea** tu rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 🏗️ Configuración de Desarrollo

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Configuración Inicial

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/analizador-complejidades-frontend.git
cd analizador-complejidades-frontend

# Añadir upstream remote
git remote add upstream https://github.com/Jhonder18/analizador-complejidades-frontend.git

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### Mantenerse Actualizado

```bash
# Obtener cambios del repositorio original
git fetch upstream
git checkout main
git merge upstream/main
```

## 📝 Estándares de Código

### Estilo de Código

- **ESLint**: Seguimos la configuración ESLint del proyecto
- **Prettier**: Usa Prettier para formateo automático
- **Convenciones**: PascalCase para componentes, camelCase para funciones

### Estructura de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(ámbito): descripción

feat(editor): añade syntax highlighting para Python
fix(analysis): corrige cálculo de complejidad espacial
docs(readme): actualiza guía de instalación
style(css): mejora responsive design
refactor(components): simplifica estructura de OutputPanel
test(analyzer): añade tests unitarios para complexityService
```

### Tipos de Commit

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de estilo (CSS, formateo)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en watch mode
npm run test:watch
```

### Escribir Tests

- Usa Jest y React Testing Library
- Coloca tests en `src/__tests__/` o junto al componente con `.test.js`
- Asegúrate de que todos los tests pasen antes de hacer PR

Ejemplo:
```javascript
// Editor.test.jsx
import { render, screen } from '@testing-library/react';
import { Editor } from '../components/Editor';

test('renders code editor', () => {
  render(<Editor />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── __tests__/      # Tests de componentes
│   └── *.jsx
├── contexts/           # React Context
├── pages/             # Páginas principales
├── services/          # Lógica de negocio
├── hooks/             # Custom hooks
├── utils/             # Utilidades
└── assets/           # Recursos estáticos
```

## 🎨 Guía de UI/UX

### Principios de Diseño

- **Simplicidad**: Interfaz clara e intuitiva
- **Consistencia**: Patrones visuales coherentes
- **Accesibilidad**: Soporte para lectores de pantalla
- **Responsive**: Funciona en todos los dispositivos

### Componentes

- Usa componentes funcionales con hooks
- Implementa PropTypes para validación
- Documenta props complejas
- Mantén componentes pequeños y enfocados

## 🚀 Deployment

El proyecto se despliega automáticamente desde `main` usando GitHub Actions.

### Proceso de Release

1. Los cambios se mergean a `main`
2. CI/CD ejecuta tests y build
3. Se despliega automáticamente si todo pasa
4. Se crea tag de versión siguiendo semver

## 📞 Comunicación

### Canales

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Email**: jhonder.dev@gmail.com para temas sensibles

### Tiempos de Respuesta

- **Issues**: 2-3 días laborables
- **Pull Requests**: 3-5 días laborables
- **Preguntas**: 1-2 días laborables

## 🏷️ Etiquetas de Issues

| Etiqueta | Descripción |
|----------|-------------|
| `bug` | Algo no funciona correctamente |
| `enhancement` | Nueva funcionalidad o mejora |
| `documentation` | Mejoras en documentación |
| `good first issue` | Bueno para nuevos contribuidores |
| `help wanted` | Se busca ayuda externa |
| `priority-high` | Alta prioridad |
| `wontfix` | No se trabajará en esto |

## 📚 Recursos Útiles

### Documentación

- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/)

### Herramientas

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [VS Code Extensions](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)

## 🎉 Reconocimientos

Los contribuidores serán listados en:
- README principal
- Página de contributors en GitHub
- Release notes cuando aplique

---

¡Gracias por contribuir al proyecto! 🙏