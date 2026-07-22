import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { COMMON_FAILURES, REPORT_LOGO } from '@/features/informe/constants'
import type { ReportFormData } from '@/features/informe/types'

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 42,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 10,
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 10,
    objectFit: 'contain',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  headerMeta: {
    textAlign: 'right',
    fontSize: 9,
    color: '#475569',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    color: '#0f172a',
    marginTop: 2,
  },
  failuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  failureChip: {
    fontSize: 9,
    color: '#0f172a',
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginRight: 6,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1e293b',
  },
  photosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoWrapper: {
    width: '48%',
  },
  photo: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 4,
  },
  photoCaption: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 42,
    right: 42,
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
})

const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

const resolveFailureLabels = (report: ReportFormData): string[] => {
  const commonLabels = report.fallasComunes.map(
    (value) => COMMON_FAILURES.find((failure) => failure.value === value)?.label ?? value,
  )
  return [...commonLabels, ...report.fallasPersonalizadas]
}

interface ReportPdfDocumentProps {
  report: ReportFormData
  resolvedModelo: string
}

export const ReportPdfDocument = ({ report, resolvedModelo }: ReportPdfDocumentProps) => {
  const failureLabels = resolveFailureLabels(report)

  return (
    <Document title={`Informe tecnico - ${resolvedModelo} - ${report.numeroSerie}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={REPORT_LOGO} style={styles.logo} />
            <View>
              <Text style={styles.title}>Informe Técnico de Laboratorio</Text>
              <Text style={styles.subtitle}>Equipos de radiocomunicación</Text>
            </View>
          </View>
          <View style={styles.headerMeta}>
            <Text>{report.empresa}</Text>
            <Text>{formatDate(report.fecha)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del equipo</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Modelo</Text>
              <Text style={styles.infoValue}>{resolvedModelo}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Número de serie</Text>
              <Text style={styles.infoValue}>{report.numeroSerie}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{report.empresa}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha del informe</Text>
              <Text style={styles.infoValue}>{formatDate(report.fecha)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fallas detectadas</Text>
          {failureLabels.length > 0 ? (
            <View style={styles.failuresList}>
              {failureLabels.map((label) => (
                <Text key={label} style={styles.failureChip}>
                  {label}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.bodyText}>No se registraron fallas de la lista predefinida.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción del problema</Text>
          <Text style={styles.bodyText}>{report.descripcionProblema}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Solución aplicada</Text>
          <Text style={styles.bodyText}>{report.solucionAplicada}</Text>
        </View>

        {report.fotos.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidencia fotográfica</Text>
            <View style={styles.photosRow}>
              {report.fotos.map((photo, index) => (
                <View key={photo.id} style={styles.photoWrapper}>
                  <Image src={photo.dataUrl} style={styles.photo} />
                  <Text style={styles.photoCaption}>Foto {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Text style={styles.footer} fixed>
          Informe generado automáticamente el {formatDate(new Date().toISOString().slice(0, 10))} · {report.empresa}
        </Text>
      </Page>
    </Document>
  )
}
