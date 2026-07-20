import { useEffect, useState } from 'react'
import { Field } from '@/components/Field'
import { inputClassName } from '@/components/inputStyles'
import { createCliente, listClientes } from '@/features/clientes/api'
import type { Cliente } from '@/features/clientes/types'

interface ClienteSelectProps {
  clienteId: number | null
  onChange: (clienteId: number, nombre: string) => void
}

export const ClienteSelect = ({ clienteId, onChange }: ClienteSelectProps) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listClientes()
      .then((data) => {
        if (active) setClientes(data)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'No se pudieron cargar los clientes.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleCreate = async (): Promise<void> => {
    const nombre = nuevoNombre.trim()
    if (nombre.length === 0) return
    setError(null)
    try {
      const cliente = await createCliente(nombre)
      setClientes((previous) => [...previous, cliente].sort((a, b) => a.nombre.localeCompare(b.nombre)))
      onChange(cliente.id, cliente.nombre)
      setNuevoNombre('')
      setIsCreating(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el cliente.')
    }
  }

  return (
    <Field label="Empresa" htmlFor="cliente" required>
      <div className="flex flex-col gap-2">
        {!isCreating ? (
          <div className="flex gap-2">
            <select
              id="cliente"
              className={inputClassName}
              value={clienteId ?? ''}
              disabled={isLoading}
              onChange={(event) => {
                const id = Number(event.target.value)
                const cliente = clientes.find((item) => item.id === id)
                if (cliente) onChange(cliente.id, cliente.nombre)
              }}
            >
              <option value="" disabled>
                {isLoading ? 'Cargando clientes...' : 'Selecciona un cliente'}
              </option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              + Nuevo
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              autoFocus
              className={inputClassName}
              placeholder="Nombre del nuevo cliente"
              value={nuevoNombre}
              onChange={(event) => setNuevoNombre(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void handleCreate()
                }
              }}
            />
            <button
              type="button"
              onClick={() => void handleCreate()}
              className="shrink-0 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false)
                setNuevoNombre('')
              }}
              className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        )}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    </Field>
  )
}
