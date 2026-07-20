import { useMemo } from 'react'
import { getInformePdfUrl } from '@/features/informes/api'
import { useInformesList } from '@/features/informes/hooks/useInformesList'
import type { EstadoInforme, Informe } from '@/features/informes/types'

const ESTADO_FILTERS: Array<EstadoInforme | 'Todos'> = ['Todos', 'Pendiente', 'Finalizado']

const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}

const estadoBadgeClass = (estado: EstadoInforme): string =>
  estado === 'Finalizado'
    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'

interface ClienteGroup {
  clienteId: number
  clienteNombre: string
  informes: Informe[]
}

const groupByCliente = (informes: Informe[]): ClienteGroup[] => {
  const groups = new Map<number, ClienteGroup>()
  for (const informe of informes) {
    const group = groups.get(informe.clienteId)
    if (group) {
      group.informes.push(informe)
    } else {
      groups.set(informe.clienteId, {
        clienteId: informe.clienteId,
        clienteNombre: informe.clienteNombre,
        informes: [informe],
      })
    }
  }
  return [...groups.values()].sort((a, b) => a.clienteNombre.localeCompare(b.clienteNombre))
}

export const InformesList = () => {
  const { informes, clientes, isLoading, error, estadoFilter, clienteFilter, setEstadoFilter, setClienteFilter, toggleEstado } =
    useInformesList()

  const groups = useMemo(() => groupByCliente(informes), [informes])
  const totalPendientes = informes.filter((informe) => informe.estado === 'Pendiente').length
  const totalFinalizados = informes.filter((informe) => informe.estado === 'Finalizado').length

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-slate-900">Informes por empresa</h1>
        <p className="text-sm text-slate-500">Consulta el estado de cada informe, agrupado por empresa.</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {ESTADO_FILTERS.map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setEstadoFilter(estado)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                estadoFilter === estado
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {estado}
            </button>
          ))}
        </div>

        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          value={clienteFilter}
          onChange={(event) =>
            setClienteFilter(event.target.value === 'Todos' ? 'Todos' : Number(event.target.value))
          }
        >
          <option value="Todos">Todas las empresas</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 text-sm">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
          {informes.length} informe{informes.length === 1 ? '' : 's'}
        </span>
        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
          {totalPendientes} pendiente{totalPendientes === 1 ? '' : 's'}
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
          {totalFinalizados} finalizado{totalFinalizados === 1 ? '' : 's'}
        </span>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {isLoading ? (
        <p className="py-6 text-center text-slate-400">Cargando informes...</p>
      ) : groups.length === 0 ? (
        <p className="py-6 text-center text-slate-400">No hay informes que coincidan con los filtros.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => {
            const pendientes = group.informes.filter((informe) => informe.estado === 'Pendiente').length
            const finalizados = group.informes.filter((informe) => informe.estado === 'Finalizado').length
            return (
              <section key={group.clienteId} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <h2 className="text-base font-semibold text-slate-900">{group.clienteNombre}</h2>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700">
                      {pendientes} pendiente{pendientes === 1 ? '' : 's'}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
                      {finalizados} finalizado{finalizados === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-white text-left text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-2">Modelo</th>
                        <th className="px-4 py-2">N° Serie</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Estado</th>
                        <th className="px-4 py-2">Archivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {group.informes.map((informe) => (
                        <tr key={informe.id}>
                          <td className="px-4 py-2.5 text-slate-700">{informe.modeloEquipo}</td>
                          <td className="px-4 py-2.5 text-slate-700">{informe.numeroSerie}</td>
                          <td className="px-4 py-2.5 text-slate-700">{formatDate(informe.fecha)}</td>
                          <td className="px-4 py-2.5">
                            <button
                              type="button"
                              onClick={() => void toggleEstado(informe)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${estadoBadgeClass(informe.estado)}`}
                            >
                              {informe.estado}
                            </button>
                          </td>
                          <td className="px-4 py-2.5">
                            <a
                              href={getInformePdfUrl(informe.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-600 hover:underline"
                            >
                              Descargar
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
