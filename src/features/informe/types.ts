export interface EquipmentModelOption {
  value: string
  label: string
}

export interface CommonFailureOption {
  value: string
  label: string
}

export interface ReportPhoto {
  id: string
  dataUrl: string
  name: string
}

export interface ReportFormData {
  modeloEquipo: string
  modeloPersonalizado: string
  clienteId: number | null
  empresa: string
  fecha: string
  numeroSerie: string
  fallasComunes: string[]
  fallasPersonalizadas: string[]
  descripcionProblema: string
  solucionAplicada: string
  fotos: ReportPhoto[]
}
