import { api } from './cliente'

// Cantidad de solicitudes en estado Pendiente (campo "count" de la lista paginada).
export async function contarPendientes() {
  const { data } = await api.get('admin/solicitudes/', { params: { estado: 'Pendiente' } })
  return data.count
}
