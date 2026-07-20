import { useCallback, useEffect, useState } from 'react'
import { listClientes } from '@/features/clientes/api'
import type { Cliente } from '@/features/clientes/types'
import { listInformes, updateEstadoInforme } from '@/features/informes/api'
import type { EstadoInforme, Informe } from '@/features/informes/types'

export interface UseInformesListResult {
  informes: Informe[]
  clientes: Cliente[]
  isLoading: boolean
  error: string | null
  estadoFilter: EstadoInforme | 'Todos'
  clienteFilter: number | 'Todos'
  setEstadoFilter: (estado: EstadoInforme | 'Todos') => void
  setClienteFilter: (clienteId: number | 'Todos') => void
  toggleEstado: (informe: Informe) => Promise<void>
}

export const useInformesList = (): UseInformesListResult => {
  const [informes, setInformes] = useState<Informe[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [estadoFilter, setEstadoFilter] = useState<EstadoInforme | 'Todos'>('Todos')
  const [clienteFilter, setClienteFilter] = useState<number | 'Todos'>('Todos')

  useEffect(() => {
    listClientes()
      .then(setClientes)
      .catch(() => {
        // el filtro de empresas queda vacío si esta carga falla; el listado principal sigue funcionando
      })
  }, [])

  const load = useCallback((): void => {
    listInformes({
      estado: estadoFilter === 'Todos' ? undefined : estadoFilter,
      clienteId: clienteFilter === 'Todos' ? undefined : clienteFilter,
    })
      .then((data) => {
        setInformes(data)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los informes.')
      })
      .finally(() => setIsLoading(false))
  }, [estadoFilter, clienteFilter])

  useEffect(() => {
    load()
  }, [load])

  const changeEstadoFilter = (estado: EstadoInforme | 'Todos'): void => {
    setIsLoading(true)
    setEstadoFilter(estado)
  }

  const changeClienteFilter = (clienteId: number | 'Todos'): void => {
    setIsLoading(true)
    setClienteFilter(clienteId)
  }

  const toggleEstado = async (informe: Informe): Promise<void> => {
    const nuevoEstado: EstadoInforme = informe.estado === 'Pendiente' ? 'Finalizado' : 'Pendiente'
    setInformes((previous) => previous.map((item) => (item.id === informe.id ? { ...item, estado: nuevoEstado } : item)))
    try {
      await updateEstadoInforme(informe.id, nuevoEstado)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado.')
      load()
    }
  }

  return {
    informes,
    clientes,
    isLoading,
    error,
    estadoFilter,
    clienteFilter,
    setEstadoFilter: changeEstadoFilter,
    setClienteFilter: changeClienteFilter,
    toggleEstado,
  }
}
