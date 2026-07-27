import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import Database from 'better-sqlite3'

export const ensureDir = (dirPath: string): void => {
  fs.mkdirSync(dirPath, { recursive: true })
}

export const getStorageRoot = (): string => path.join(os.homedir(), 'Documents', 'Informes de laboratorio')

ensureDir(getStorageRoot())

export const db = new Database(path.join(getStorageRoot(), 'informes.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    carpeta TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS informes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    modelo_equipo TEXT NOT NULL,
    numero_serie TEXT NOT NULL,
    freq_error TEXT NOT NULL DEFAULT '',
    potencia TEXT NOT NULL DEFAULT '',
    desviacion_audio TEXT NOT NULL DEFAULT '',
    sensibilidad TEXT NOT NULL DEFAULT '',
    fecha TEXT NOT NULL,
    fallas_comunes TEXT NOT NULL DEFAULT '[]',
    fallas_personalizadas TEXT NOT NULL DEFAULT '[]',
    descripcion_problema TEXT NOT NULL,
    solucion_aplicada TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente','Finalizado')),
    archivo_nombre TEXT NOT NULL,
    archivo_ruta TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const existingColumns = new Set(
  (db.prepare('PRAGMA table_info(informes)').all() as { name: string }[]).map((column) => column.name),
)
const newColumns = ['freq_error', 'potencia', 'desviacion_audio', 'sensibilidad']
for (const column of newColumns) {
  if (!existingColumns.has(column)) {
    db.exec(`ALTER TABLE informes ADD COLUMN ${column} TEXT NOT NULL DEFAULT ''`)
  }
}
