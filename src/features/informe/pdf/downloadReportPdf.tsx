import { pdf } from '@react-pdf/renderer'
import { ReportPdfDocument } from '@/features/informe/pdf/ReportPdfDocument'
import type { ReportFormData } from '@/features/informe/types'

export const sanitizeForFilename = (value: string): string =>
  value
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '') || 'informe'

export const buildReportFilename = (report: ReportFormData, resolvedModelo: string): string =>
  `Informe_${sanitizeForFilename(resolvedModelo)}_${sanitizeForFilename(report.numeroSerie)}.pdf`

export const generateReportPdfBlob = async (report: ReportFormData, resolvedModelo: string): Promise<Blob> =>
  pdf(<ReportPdfDocument report={report} resolvedModelo={resolvedModelo} />).toBlob()

export const triggerBrowserDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
