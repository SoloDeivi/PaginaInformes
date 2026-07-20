import { Field } from '@/components/Field'
import { inputClassName } from '@/components/inputStyles'
import { EQUIPMENT_MODELS, OTROS_VALUE } from '@/features/informe/constants'

interface EquipmentModelFieldProps {
  modeloEquipo: string
  modeloPersonalizado: string
  onModeloEquipoChange: (value: string) => void
  onModeloPersonalizadoChange: (value: string) => void
}

export const EquipmentModelField = ({
  modeloEquipo,
  modeloPersonalizado,
  onModeloEquipoChange,
  onModeloPersonalizadoChange,
}: EquipmentModelFieldProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <Field label="Modelo del equipo" htmlFor="modeloEquipo" required>
          <select
            id="modeloEquipo"
            className={inputClassName}
            value={modeloEquipo}
            onChange={(event) => onModeloEquipoChange(event.target.value)}
          >
            <option value="" disabled>
              Selecciona un modelo
            </option>
            {EQUIPMENT_MODELS.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {modeloEquipo === OTROS_VALUE ? (
        <div className="flex-1">
          <Field label="Especifique el modelo" htmlFor="modeloPersonalizado" required>
            <input
              id="modeloPersonalizado"
              type="text"
              className={inputClassName}
              placeholder="Ej. XTS3000"
              value={modeloPersonalizado}
              onChange={(event) => onModeloPersonalizadoChange(event.target.value)}
            />
          </Field>
        </div>
      ) : null}
    </div>
  )
}
