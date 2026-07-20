import { Router } from 'express'
import { db } from '../db.ts'
import { ensureClienteFolder, sanitizeFolderName } from '../fileStorage.ts'

interface ClienteRow {
  id: number
  nombre: string
  carpeta: string
  created_at: string
}

const toCliente = (row: ClienteRow) => ({
  id: row.id,
  nombre: row.nombre,
  carpeta: row.carpeta,
  createdAt: row.created_at,
})

export const clientesRouter = Router()

clientesRouter.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM clientes ORDER BY nombre ASC').all() as ClienteRow[]
  res.json(rows.map(toCliente))
})

clientesRouter.post('/', (req, res) => {
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim() : ''
  if (nombre.length === 0) {
    res.status(400).json({ error: 'El nombre del cliente es obligatorio.' })
    return
  }

  const existing = db.prepare('SELECT id FROM clientes WHERE nombre = ?').get(nombre)
  if (existing) {
    res.status(409).json({ error: 'Ya existe un cliente con ese nombre.' })
    return
  }

  const carpeta = sanitizeFolderName(nombre)
  ensureClienteFolder(carpeta)

  const result = db.prepare('INSERT INTO clientes (nombre, carpeta) VALUES (?, ?)').run(nombre, carpeta)
  const row = db.prepare('SELECT * FROM clientes WHERE id = ?').get(result.lastInsertRowid) as ClienteRow
  res.status(201).json(toCliente(row))
})
