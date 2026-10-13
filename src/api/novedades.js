import { api } from './cliente'

// Cantidad de novedades en estado Pendiente (campo "count" de la lista paginada).
export async function contarPendientes() {
  const { data } = await api.get('admin/novedades/', { params: { estado: 'Pendiente' } })
  return data.count
}
