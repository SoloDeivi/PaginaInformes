import { apiGet, apiPatchJson, apiPostForm } from '@/lib/apiClient'
import type { EstadoInforme, Informe } from '@/features/informes/types'

export interface CreateInformeInput {
  clienteId: number
  modeloEquipo: string
  numeroSerie: string
  freqError: string
  potencia: string
  desviacionAudio: string
  sensibilidad: string
  fecha: string
  fallasComunes: string[]
  fallasPersonalizadas: string[]
  descripcionProblema: string
  solucionAplicada: string
  pdfBlob: Blob
  pdfFilename: string
}

export interface InformesFilter {
  clienteId?: number
  estado?: EstadoInforme
}

export const listInformes = (filter: InformesFilter = {}): Promise<Informe[]> => {
  const params = new URLSearchParams()
  if (filter.clienteId != null) params.set('clienteId', String(filter.clienteId))
  if (filter.estado) params.set('estado', filter.estado)
  const query = params.toString()
  return apiGet<Informe[]>(`/api/informes${query ? `?${query}` : ''}`)
}

export const createInforme = (input: CreateInformeInput): Promise<Informe> => {
  const formData = new FormData()
  formData.set('clienteId', String(input.clienteId))
  formData.set('modeloEquipo', input.modeloEquipo)
  formData.set('numeroSerie', input.numeroSerie)
  formData.set('freqError', input.freqError)
  formData.set('potencia', input.potencia)
  formData.set('desviacionAudio', input.desviacionAudio)
  formData.set('sensibilidad', input.sensibilidad)
  formData.set('fecha', input.fecha)
  formData.set('fallasComunes', JSON.stringify(input.fallasComunes))
  formData.set('fallasPersonalizadas', JSON.stringify(input.fallasPersonalizadas))
  formData.set('descripcionProblema', input.descripcionProblema)
  formData.set('solucionAplicada', input.solucionAplicada)
  formData.set('pdf', input.pdfBlob, input.pdfFilename)
  return apiPostForm<Informe>('/api/informes', formData)
}

export const updateEstadoInforme = (id: number, estado: EstadoInforme): Promise<Informe> =>
  apiPatchJson<Informe>(`/api/informes/${id}/estado`, { estado })

export const getInformePdfUrl = (id: number): string => `/api/informes/${id}/pdf`
