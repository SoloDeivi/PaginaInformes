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
