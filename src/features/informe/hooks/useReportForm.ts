import { useState } from 'react'
import { MAX_PHOTOS, OTROS_VALUE } from '@/features/informe/constants'
import type { ReportFormData, ReportPhoto } from '@/features/informe/types'
import { compressImageToDataUrl } from '@/features/informe/utils/imageCompression'
import { generateId } from '@/lib/generateId'

const todayIsoDate = (): string => new Date().toISOString().slice(0, 10)

const createInitialFormData = (): ReportFormData => ({
  modeloEquipo: '',
  modeloPersonalizado: '',
  clienteId: null,
  empresa: '',
  fecha: todayIsoDate(),
  numeroSerie: '',
  fallasComunes: [],
  fallasPersonalizadas: [],
  descripcionProblema: '',
  solucionAplicada: '',
  fotos: [],
})

export interface UseReportFormResult {
  formData: ReportFormData
  customFailureDraft: string
  setField: <K extends keyof ReportFormData>(field: K, value: ReportFormData[K]) => void
  setCliente: (clienteId: number, nombre: string) => void
  toggleFailure: (value: string) => void
  setCustomFailureDraft: (value: string) => void
  addCustomFailure: () => void
  removeCustomFailure: (value: string) => void
  addPhoto: (file: File) => Promise<void>
  removePhoto: (id: string) => void
  photoError: string | null
  isProcessingPhoto: boolean
  resolvedModelo: string
  isValid: boolean
  resetForm: () => void
}

export const useReportForm = (): UseReportFormResult => {
  const [formData, setFormData] = useState<ReportFormData>(createInitialFormData)
  const [customFailureDraft, setCustomFailureDraft] = useState('')
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)

  const setField = <K extends keyof ReportFormData>(field: K, value: ReportFormData[K]): void => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const setCliente = (clienteId: number, nombre: string): void => {
    setFormData((previous) => ({ ...previous, clienteId, empresa: nombre }))
  }

  const toggleFailure = (value: string): void => {
    setFormData((previous) => {
      const alreadySelected = previous.fallasComunes.includes(value)
      const fallasComunes = alreadySelected
        ? previous.fallasComunes.filter((item) => item !== value)
        : [...previous.fallasComunes, value]
      return { ...previous, fallasComunes }
    })
  }

  const addCustomFailure = (): void => {
    const trimmed = customFailureDraft.trim()
    if (trimmed.length === 0) return
    setFormData((previous) => ({
      ...previous,
      fallasPersonalizadas: [...previous.fallasPersonalizadas, trimmed],
    }))
    setCustomFailureDraft('')
  }

  const removeCustomFailure = (value: string): void => {
    setFormData((previous) => ({
      ...previous,
      fallasPersonalizadas: previous.fallasPersonalizadas.filter((item) => item !== value),
    }))
  }

  const addPhoto = async (file: File): Promise<void> => {
    if (formData.fotos.length >= MAX_PHOTOS) return
    setPhotoError(null)
    setIsProcessingPhoto(true)
    try {
      const dataUrl = await compressImageToDataUrl(file)
      const photo: ReportPhoto = { id: generateId(), dataUrl, name: file.name }
      setFormData((previous) => ({ ...previous, fotos: [...previous.fotos, photo] }))
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'No se pudo procesar la foto.')
    } finally {
      setIsProcessingPhoto(false)
    }
  }

  const removePhoto = (id: string): void => {
    setFormData((previous) => ({
      ...previous,
      fotos: previous.fotos.filter((photo) => photo.id !== id),
    }))
  }

  const resetForm = (): void => {
    setFormData(createInitialFormData())
    setCustomFailureDraft('')
  }

  const resolvedModelo =
    formData.modeloEquipo === OTROS_VALUE ? formData.modeloPersonalizado.trim() : formData.modeloEquipo

  const isValid =
    resolvedModelo.length > 0 &&
    formData.clienteId !== null &&
    formData.fecha.length > 0 &&
    formData.numeroSerie.trim().length > 0 &&
    formData.descripcionProblema.trim().length > 0 &&
    formData.solucionAplicada.trim().length > 0

  return {
    formData,
    customFailureDraft,
    setField,
    setCliente,
    toggleFailure,
    setCustomFailureDraft,
    addCustomFailure,
    removeCustomFailure,
    addPhoto,
    removePhoto,
    photoError,
    isProcessingPhoto,
    resolvedModelo,
    isValid,
    resetForm,
  }
}
