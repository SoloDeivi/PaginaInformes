# PaginaInformes

Aplicación web interna para crear y hacer seguimiento de informes de laboratorio. Los usuarios registran clientes, generan un informe en PDF para un equipo inspeccionado/reparado, y hacen seguimiento del estado de cada informe (`Pendiente` / `Finalizado`). Los PDF generados se guardan en disco, organizados en una carpeta por cliente.

> Read this in [English](./README.md).

## Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Vite, con Tailwind CSS
- **Backend:** Express 5 (TypeScript, ejecutado con `tsx`)
- **Base de datos:** SQLite mediante `better-sqlite3`
- **Generación de PDF:** `@react-pdf/renderer`
- **Subida de archivos:** `multer`

## Estructura del Proyecto

```
src/
  components/         Componentes de UI compartidos y reutilizables
  features/
    clientes/          Gestión de clientes (listar, crear)
    informe/            Formulario de nuevo informe, lógica de generación de PDF
    informes/            Listado y seguimiento de informes
  lib/                 Cliente de API y helpers pequeños
server/
  index.ts             Punto de entrada de Express (sirve la API y el frontend compilado)
  db.ts                Conexión y esquema de SQLite
  fileStorage.ts       Helpers de carpetas de cliente / nombres de archivo
  routes/              Routers de Express (clientes, informes)
```

Los imports usan el alias `@/` para `src/` (ej. `@/components/Field`).

## Datos y Almacenamiento de Archivos

Al iniciar, el servidor crea la base de datos SQLite y las carpetas de informes en:

```
~/Documents/Informes de laboratorio/
```

- `informes.db` — base de datos SQLite (tablas `clientes`, `informes`)
- Una subcarpeta por cliente, con los PDF de informes generados para ese cliente

## Resumen de la API

Todos los endpoints se sirven bajo `/api`:

| Método | Ruta                        | Descripción                                    |
| ------ | --------------------------- | ----------------------------------------------- |
| GET    | `/api/clientes`              | Listar clientes                                 |
| POST   | `/api/clientes`              | Crear un cliente                                |
| GET    | `/api/informes`               | Listar informes (filtra por `estado`, `clienteId`) |
| POST   | `/api/informes`               | Crear un informe (multipart, incluye el PDF generado) |
| PATCH  | `/api/informes/:id/estado`     | Actualizar el estado de un informe              |
| GET    | `/api/informes/:id/pdf`        | Descargar el PDF de un informe                  |

## Primeros Pasos

### Requisitos previos

- Node.js (se recomienda la versión LTS)
- npm

### Instalación

```bash
npm install
```

### Desarrollo

Ejecuta el servidor de desarrollo de Vite y la API de Express al mismo tiempo (la API en el puerto `4000`, el frontend redirige `/api` hacia ella):

```bash
npm run dev
```

### Build de Producción

```bash
npm run build   # compila el frontend en /dist
npm run start   # ejecuta el servidor Express, que también sirve /dist
```

### Otros Scripts

```bash
npm run preview     # previsualiza localmente el build de producción
npm run lint         # ejecuta ESLint
npm run typecheck     # ejecuta TypeScript en modo --noEmit (tsc -b)
```

Ejecuta siempre `npm run typecheck && npm run lint` antes de dar por terminado un cambio.

## Convenciones de Código

- Solo componentes funcionales, declarados como `export const ComponentName = ...` (sin exports por defecto)
- TypeScript estricto; `any` no está permitido; se prefiere `interface` sobre `type` para props y payloads de datos
- `useState` solo para estado local de UI; la lógica compleja se extrae a custom hooks
- Clases de utilidad de Tailwind CSS directamente en el JSX, diseño responsivo mobile-first

Consulta [`Claude.md`](./Claude.md) para ver las guías completas del proyecto usadas por los asistentes de IA que trabajan en este repositorio.
