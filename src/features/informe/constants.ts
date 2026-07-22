import type { CommonFailureOption, EquipmentModelOption } from '@/features/informe/types'
import placeholderLogo from '@/assets/placeholder.png'

export const OTROS_VALUE = 'otros'

// Logo mostrado en la esquina superior izquierda del informe PDF.
// Para cambiarlo, importa otra imagen desde src/assets y reasigna esta constante.
export const REPORT_LOGO = placeholderLogo

export const EQUIPMENT_MODELS: EquipmentModelOption[] = [
  { value: 'APX900', label: 'APX900' },
  { value: 'APX1000', label: 'APX1000' },
  { value: 'APX2000', label: 'APX2000' },
  { value: 'APX2500', label: 'APX2500' },
  { value: 'DEP550e', label: 'DEP550e' },
  { value: 'XTS2500', label: 'XTS2500' },
  { value: 'XTL1500', label: 'XTL1500' },
  { value: 'XTL2500', label: 'XTL2500' },
  { value: OTROS_VALUE, label: 'Otros' },
]

export const COMMON_FAILURES: CommonFailureOption[] = [
  { value: 'potenciometro', label: 'Potenciómetro' },
  { value: 'perillas', label: 'Perillas' },
  { value: 'selector_canales', label: 'Selector de canales' },
  { value: 'malla_parlante', label: 'Malla parlante' },
  { value: 'bateria', label: 'Batería' },
  { value: 'antena', label: 'Antena' },
  { value: 'pines_bateria', label: 'Pines de batería' },
  { value: 'carcasa', label: 'Carcasa' },
  { value: 'parlante_kit_flex', label: 'Parlante kit flex' },
  { value: 'flexible_pantalla', label: 'Flexible de pantalla' },
  { value: 'pantalla', label: 'Pantalla' },
  { value: 'teclado', label: 'Teclado' },
  { value: 'placa_controladora', label: 'Placa controladora de pantalla/teclado' },
  { value: 'conector_rf', label: 'Conector RF' },
  { value: 'name_plate', label: 'Name plate' },
  { value: 'oring_impermeable', label: 'O-ring impermeable' },
  { value: 'flexible_apx', label: 'Flexible APX' },
]

export const MAX_PHOTOS = 2
