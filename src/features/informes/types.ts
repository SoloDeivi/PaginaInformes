export type EstadoInforme = 'Pendiente' | 'Finalizado'

export interface Informe {
  id: number
  clienteId: number
  clienteNombre: string
  modeloEquipo: string
  numeroSerie: string
  fecha: string
  fallasComunes: string[]
  fallasPersonalizadas: string[]
  descripcionProblema: string
  solucionAplicada: string
  estado: EstadoInforme
  archivoNombre: string
  createdAt: string
  updatedAt: string
}
