import { apiGet, apiPostJson } from '@/lib/apiClient'
import type { Cliente } from '@/features/clientes/types'

export const listClientes = (): Promise<Cliente[]> => apiGet<Cliente[]>('/api/clientes')

export const createCliente = (nombre: string): Promise<Cliente> =>
  apiPostJson<Cliente>('/api/clientes', { nombre })
