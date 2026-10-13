import { api } from './cliente'

// Cantidad de donaciones en estado Pendiente (campo "count" de la lista paginada).
export async function contarPendientes() {
  const { data } = await api.get('admin/donaciones/', { params: { estado: 'Pendiente' } })
  return data.count
}
