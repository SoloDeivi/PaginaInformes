import { inputClassName } from '@/components/inputStyles'
import { COMMON_FAILURES } from '@/features/informe/constants'

interface FailuresChecklistProps {
  fallasComunes: string[]
  fallasPersonalizadas: string[]
  customFailureDraft: string
  onToggleFailure: (value: string) => void
  onCustomFailureDraftChange: (value: string) => void
  onAddCustomFailure: () => void
  onRemoveCustomFailure: (value: string) => void
}

export const FailuresChecklist = ({
  fallasComunes,
  fallasPersonalizadas,
  customFailureDraft,
  onToggleFailure,
  onCustomFailureDraftChange,
  onAddCustomFailure,
  onRemoveCustomFailure,
}: FailuresChecklistProps) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">Fallas comunes detectadas</span>

      <div className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMON_FAILURES.map((failure) => (
          <label key={failure.value} className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              className="size-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={fallasComunes.includes(failure.value)}
              onChange={() => onToggleFailure(failure.value)}
            />
            {failure.label}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Otras fallas</span>
        <div className="flex gap-2">
          <input
            type="text"
            className={inputClassName}
            placeholder="Describe una falla adicional"
            value={customFailureDraft}
            onChange={(event) => onCustomFailureDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                onAddCustomFailure()
              }
            }}
          />
          <button
            type="button"
            onClick={onAddCustomFailure}
            className="shrink-0 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Agregar
          </button>
        </div>

        {fallasPersonalizadas.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {fallasPersonalizadas.map((falla) => (
              <li
                key={falla}
                className="flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-800"
              >
                {falla}
                <button
                  type="button"
                  onClick={() => onRemoveCustomFailure(falla)}
                  aria-label={`Quitar falla ${falla}`}
                  className="text-sky-600 hover:text-sky-900"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
