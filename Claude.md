# Project: React + TypeScript + Vite Application

## Build and Development Commands
- `npm run dev` — Inicia el servidor de desarrollo local (Vite)
- `npm run build` — Crea el build de producción en la carpeta /dist
- `npm run preview` — Previsualiza localmente el build de producción
- `npm run lint` — Ejecuta el linter (ESLint + Prettier)
- `npm run typecheck` — Ejecuta la verificación de tipos estáticos (`tsc --noEmit`)
- Nota: Siempre ejecuta `npm run typecheck && npm run lint` antes de dar por terminado un cambio.

## Architecture & Directory Structure
- `src/components/` — Componentes compartidos y reutilizables (UI atómica)
- `src/features/` — Módulos aislados por dominio o funcionalidad (ej. auth, dashboard)
- `src/hooks/` — Custom hooks globales de React
- `src/context/` — Proveedores de contexto globales
- `src/utils/` — Funciones utilitarias puras y helpers de TypeScript
- Aliases: Usa el prefijo `@/` configurado en Vite para imports absolutos (ej. `@/components/Button`)

## Coding Rules & Conventions
- **Componentes:** Usa exclusivamente componentes funcionales y declaraciones `export const ComponentName = ...` (evita default exports).
- **TypeScript:** Tipado estricto. Prohibido usar `any`. Prefiere `interface` sobre `type` para props y payloads de datos.
- **Estado:** Utiliza `useState` solo para UI local. Para lógica compleja, extrae el comportamiento a un custom hook.
- **Estilos:** Usa clases de Tailwind CSS directamente en el JSX. Mantén el diseño responsivo usando enfoques mobile-first.

## Verification Checklist
- Verifica que las props expuestas tengan tipos explícitos en TypeScript.
- Asegúrate de limpiar los listeners o suscripciones dentro de los bloques `useEffect`.
- No añadas dependencias externas al package.json sin preguntar primero.
