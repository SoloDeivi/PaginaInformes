import fs from 'node:fs'
import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { db, getStorageRoot } from '../db.ts'
import { buildInformeFilename, ensureClienteFolder } from '../fileStorage.ts'

const upload = multer({ storage: multer.memoryStorage() })

interface InformeJoinedRow {
  id: number
  cliente_id: number
  cliente_nombre: string
  modelo_equipo: string
  numero_serie: string
  fecha: string
  fallas_comunes: string
  fallas_personalizadas: string
  descripcion_problema: string
  solucion_aplicada: string
  estado: string
  archivo_nombre: string
  archivo_ruta: string
  created_at: string
  updated_at: string
}

const SELECT_JOINED = `
  SELECT i.*, c.nombre AS cliente_nombre
  FROM informes i
  JOIN clientes c ON c.id = i.cliente_id
`

const toInforme = (row: InformeJoinedRow) => ({
  id: row.id,
  clienteId: row.cliente_id,
  clienteNombre: row.cliente_nombre,
  modeloEquipo: row.modelo_equipo,
  numeroSerie: row.numero_serie,
  fecha: row.fecha,
  fallasComunes: JSON.parse(row.fallas_comunes) as string[],
  fallasPersonalizadas: JSON.parse(row.fallas_personalizadas) as string[],
  descripcionProblema: row.descripcion_problema,
  solucionAplicada: row.solucion_aplicada,
  estado: row.estado,
  archivoNombre: row.archivo_nombre,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const parseJsonArray = (value: unknown): string[] => {
  if (typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export const informesRouter = Router()

informesRouter.get('/', (req, res) => {
  const conditions: string[] = []
  const params: (string | number)[] = []

  if (typeof req.query.estado === 'string' && req.query.estado.length > 0) {
    conditions.push('i.estado = ?')
    params.push(req.query.estado)
  }
  if (typeof req.query.clienteId === 'string' && req.query.clienteId.length > 0) {
    conditions.push('i.cliente_id = ?')
    params.push(Number(req.query.clienteId))
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = db
    .prepare(`${SELECT_JOINED} ${where} ORDER BY i.created_at DESC, i.id DESC`)
    .all(...params) as InformeJoinedRow[]

  res.json(rows.map(toInforme))
})

informesRouter.post('/', upload.single('pdf'), (req, res) => {
  const clienteId = Number(req.body?.clienteId)
  const modeloEquipo = typeof req.body?.modeloEquipo === 'string' ? req.body.modeloEquipo.trim() : ''
  const numeroSerie = typeof req.body?.numeroSerie === 'string' ? req.body.numeroSerie.trim() : ''
  const fecha = typeof req.body?.fecha === 'string' ? req.body.fecha : ''
  const descripcionProblema = typeof req.body?.descripcionProblema === 'string' ? req.body.descripcionProblema : ''
  const solucionAplicada = typeof req.body?.solucionAplicada === 'string' ? req.body.solucionAplicada : ''
  const fallasComunes = parseJsonArray(req.body?.fallasComunes)
  const fallasPersonalizadas = parseJsonArray(req.body?.fallasPersonalizadas)

  if (
    !Number.isInteger(clienteId) ||
    modeloEquipo.length === 0 ||
    numeroSerie.length === 0 ||
    fecha.length === 0 ||
    descripcionProblema.length === 0 ||
    solucionAplicada.length === 0 ||
    !req.file
  ) {
    res.status(400).json({ error: 'Faltan campos obligatorios o el archivo PDF.' })
    return
  }

  const cliente = db.prepare('SELECT id, carpeta FROM clientes WHERE id = ?').get(clienteId) as
    | { id: number; carpeta: string }
    | undefined
  if (!cliente) {
    res.status(404).json({ error: 'El cliente indicado no existe.' })
    return
  }

  const insertResult = db
    .prepare(
      `INSERT INTO informes
        (cliente_id, modelo_equipo, numero_serie, fecha, fallas_comunes, fallas_personalizadas,
         descripcion_problema, solucion_aplicada, archivo_nombre, archivo_ruta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '')`,
    )
    .run(
      clienteId,
      modeloEquipo,
      numeroSerie,
      fecha,
      JSON.stringify(fallasComunes),
      JSON.stringify(fallasPersonalizadas),
      descripcionProblema,
      solucionAplicada,
    )

  const informeId = Number(insertResult.lastInsertRowid)
  const folderPath = ensureClienteFolder(cliente.carpeta)
  const filename = buildInformeFilename(modeloEquipo, numeroSerie, informeId)
  fs.writeFileSync(path.join(folderPath, filename), req.file.buffer)

  const archivoRuta = path.join(cliente.carpeta, filename)
  db.prepare("UPDATE informes SET archivo_nombre = ?, archivo_ruta = ?, updated_at = datetime('now') WHERE id = ?").run(
    filename,
    archivoRuta,
    informeId,
  )

  const row = db.prepare(`${SELECT_JOINED} WHERE i.id = ?`).get(informeId) as InformeJoinedRow
  res.status(201).json(toInforme(row))
})

informesRouter.patch('/:id/estado', (req, res) => {
  const id = Number(req.params.id)
  const estado = req.body?.estado
  if (!Number.isInteger(id) || (estado !== 'Pendiente' && estado !== 'Finalizado')) {
    res.status(400).json({ error: "El estado debe ser 'Pendiente' o 'Finalizado'." })
    return
  }

  const result = db
    .prepare("UPDATE informes SET estado = ?, updated_at = datetime('now') WHERE id = ?")
    .run(estado, id)
  if (result.changes === 0) {
    res.status(404).json({ error: 'Informe no encontrado.' })
    return
  }

  const row = db.prepare(`${SELECT_JOINED} WHERE i.id = ?`).get(id) as InformeJoinedRow
  res.json(toInforme(row))
})

informesRouter.get('/:id/pdf', (req, res) => {
  const id = Number(req.params.id)
  const row = db.prepare('SELECT archivo_nombre, archivo_ruta FROM informes WHERE id = ?').get(id) as
    | { archivo_nombre: string; archivo_ruta: string }
    | undefined
  if (!row) {
    res.status(404).json({ error: 'Informe no encontrado.' })
    return
  }

  const absolutePath = path.join(getStorageRoot(), row.archivo_ruta)
  if (!fs.existsSync(absolutePath)) {
    res.status(404).json({ error: 'El archivo PDF no se encuentra en disco.' })
    return
  }

  res.download(absolutePath, row.archivo_nombre)
})
