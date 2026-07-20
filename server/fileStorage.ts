import path from 'node:path'
import { ensureDir, getStorageRoot } from './db.ts'

export const sanitizeFolderName = (value: string): string =>
  value
    .trim()
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/, '')
    .trim() || 'Cliente'

export const sanitizeFilePart = (value: string): string =>
  value
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '') || 'informe'

export const ensureClienteFolder = (carpeta: string): string => {
  const folderPath = path.join(getStorageRoot(), carpeta)
  ensureDir(folderPath)
  return folderPath
}

export const buildInformeFilename = (modeloEquipo: string, numeroSerie: string, id: number): string =>
  `Informe_${sanitizeFilePart(modeloEquipo)}_${sanitizeFilePart(numeroSerie)}_${id}.pdf`
