import { useState } from 'react'
import { Field } from '@/components/Field'
import { inputClassName } from '@/components/inputStyles'
import { ClienteSelect } from '@/features/clientes/components/ClienteSelect'
import { EquipmentModelField } from '@/features/informe/components/EquipmentModelField'
import { FailuresChecklist } from '@/features/informe/components/FailuresChecklist'
import { PhotoUploader } from '@/features/informe/components/PhotoUploader'
import { useReportForm } from '@/features/informe/hooks/useReportForm'
import {
  buildReportFilename,
  generateReportPdfBlob,
  triggerBrowserDownload,
} from '@/features/informe/pdf/downloadReportPdf'
import { createInforme } from '@/features/informes/api'

interface SavedReport {
  clienteNombre: string
  blob: Blob
  filename: string
}

export const ReportForm = () => {
  const {
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
  } = useReportForm()

  const [isGenerating, setIsGenerating] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedReport, setSavedReport] = useState<SavedReport | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!isValid || isGenerating || formData.clienteId === null) return

    setIsGenerating(true)
    setSubmitError(null)
    try {
      const blob = await generateReportPdfBlob(formData, resolvedModelo)
      const filename = buildReportFilename(formData, resolvedModelo)
      await createInforme({
        clienteId: formData.clienteId,
        modeloEquipo: resolvedModelo,
        numeroSerie: formData.numeroSerie,
        fecha: formData.fecha,
        fallasComunes: formData.fallasComunes,
        fallasPersonalizadas: formData.fallasPersonalizadas,
        descripcionProblema: formData.descripcionProblema,
        solucionAplicada: formData.solucionAplicada,
        pdfBlob: blob,
        pdfFilename: filename,
      })
      setSavedReport({ clienteNombre: formData.empresa, blob, filename })
      resetForm()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo guardar el informe.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
      className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10"
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Informe técnico de laboratorio</h1>
        <p className="text-sm text-slate-500">
          Completa los datos del equipo y las fallas detectadas para generar el informe en PDF.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-900">Datos generales</h2>

        <EquipmentModelField
          modeloEquipo={formData.modeloEquipo}
          modeloPersonalizado={formData.modeloPersonalizado}
          onModeloEquipoChange={(value) => setField('modeloEquipo', value)}
          onModeloPersonalizadoChange={(value) => setField('modeloPersonalizado', value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ClienteSelect clienteId={formData.clienteId} onChange={setCliente} />

          <Field label="Fecha del informe" htmlFor="fecha" required>
            <input
              id="fecha"
              type="date"
              className={inputClassName}
              value={formData.fecha}
              onChange={(event) => setField('fecha', event.target.value)}
            />
          </Field>

          <Field label="Número de serie" htmlFor="numeroSerie" required>
            <input
              id="numeroSerie"
              type="text"
              className={inputClassName}
              placeholder="Ej. 501CQK1234"
              value={formData.numeroSerie}
              onChange={(event) => setField('numeroSerie', event.target.value)}
            />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-900">Fallas detectadas</h2>
        <FailuresChecklist
          fallasComunes={formData.fallasComunes}
          fallasPersonalizadas={formData.fallasPersonalizadas}
          customFailureDraft={customFailureDraft}
          onToggleFailure={toggleFailure}
          onCustomFailureDraftChange={setCustomFailureDraft}
          onAddCustomFailure={addCustomFailure}
          onRemoveCustomFailure={removeCustomFailure}
        />
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-900">Diagnóstico</h2>

        <Field label="Descripción detallada del problema" htmlFor="descripcionProblema" required>
          <textarea
            id="descripcionProblema"
            className={inputClassName}
            rows={4}
            placeholder="Describe los problemas detectados durante la inspección"
            value={formData.descripcionProblema}
            onChange={(event) => setField('descripcionProblema', event.target.value)}
          />
        </Field>

        <Field label="Solución aplicada" htmlFor="solucionAplicada" required>
          <textarea
            id="solucionAplicada"
            className={inputClassName}
            rows={4}
            placeholder="Describe la solución o reparación aplicada"
            value={formData.solucionAplicada}
            onChange={(event) => setField('solucionAplicada', event.target.value)}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5">
        <h2 className="text-base font-semibold text-slate-900">Evidencia fotográfica</h2>
        <PhotoUploader
          fotos={formData.fotos}
          onAddPhoto={(file) => {
            void addPhoto(file)
          }}
          onRemovePhoto={removePhoto}
          isProcessing={isProcessingPhoto}
          error={photoError}
        />
      </section>

      {savedReport ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-700">
            Informe guardado para <strong>{savedReport.clienteNombre}</strong>.
          </p>
          <button
            type="button"
            onClick={() => triggerBrowserDownload(savedReport.blob, savedReport.filename)}
            className="rounded-md border border-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            Descargar copia
          </button>
        </div>
      ) : null}

      <div className="flex flex-col items-end gap-2">
        {!isValid ? (
          <p className="text-sm text-red-500">Completa los campos obligatorios (*) para generar el informe.</p>
        ) : null}
        {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
        <button
          type="submit"
          disabled={!isValid || isGenerating}
          className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isGenerating ? 'Guardando informe...' : 'Generar informe PDF'}
        </button>
      </div>
    </form>
  )
}
