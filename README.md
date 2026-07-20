# PaginaInformes

Internal web app for creating and tracking lab/repair reports ("informes de laboratorio"). Users register clients, generate a PDF report for an inspected/repaired device, and track each report's status (`Pendiente` / `Finalizado`). Generated PDFs are stored on disk, organized in a per-client folder.

> Read this in [Spanish (Español)](./README.es.md).

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite, styled with Tailwind CSS
- **Backend:** Express 5 (TypeScript, run via `tsx`)
- **Database:** SQLite via `better-sqlite3`
- **PDF generation:** `@react-pdf/renderer`
- **File uploads:** `multer`

## Project Structure

```
src/
  components/         Shared, reusable UI components
  features/
    clientes/          Client management (list, create)
    informe/            New report form, PDF generation logic
    informes/            Report list/tracking view
  lib/                 API client and small helpers
server/
  index.ts             Express app entrypoint (serves API + built frontend)
  db.ts                SQLite connection and schema
  fileStorage.ts       Client folder / filename helpers
  routes/              Express routers (clientes, informes)
```

Imports use the `@/` alias for `src/` (e.g. `@/components/Field`).

## Data & File Storage

On startup, the server creates its SQLite database and report folders under:

```
~/Documents/Informes de laboratorio/
```

- `informes.db` — SQLite database (`clientes`, `informes` tables)
- One subfolder per client, containing that client's generated report PDFs

## API Overview

All endpoints are served under `/api`:

| Method | Path                        | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| GET    | `/api/clientes`              | List clients                         |
| POST   | `/api/clientes`              | Create a client                      |
| GET    | `/api/informes`               | List reports (filter by `estado`, `clienteId`) |
| POST   | `/api/informes`               | Create a report (multipart, includes generated PDF) |
| PATCH  | `/api/informes/:id/estado`     | Update a report's status             |
| GET    | `/api/informes/:id/pdf`        | Download a report's PDF              |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

### Development

Runs the Vite dev server and the Express API concurrently (API on port `4000`, frontend proxies `/api` to it):

```bash
npm run dev
```

### Production Build

```bash
npm run build   # builds the frontend into /dist
npm run start   # runs the Express server, which also serves /dist
```

### Other Scripts

```bash
npm run preview     # preview the production build locally
npm run lint         # run ESLint
npm run typecheck     # run TypeScript in --noEmit mode (tsc -b)
```

Always run `npm run typecheck && npm run lint` before considering a change finished.

## Coding Conventions

- Functional components only, declared as `export const ComponentName = ...` (no default exports)
- Strict TypeScript; `any` is not allowed; prefer `interface` over `type` for props and data payloads
- `useState` for local UI state only; extract complex logic into custom hooks
- Tailwind CSS utility classes directly in JSX, mobile-first responsive design

See [`Claude.md`](./Claude.md) for the full project guidelines used by AI coding assistants working on this repo.
