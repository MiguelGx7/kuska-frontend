import { api } from './cliente'

// Lista paginada de solicitudes: { count, next, previous, results }.
export async function listarSolicitudes(params) {
  const { data } = await api.get('admin/solicitudes/', { params })
  return data
}

// Cantidad de solicitudes que cumplen los filtros (campo "count").
export async function contarSolicitudes(params) {
  const { count } = await listarSolicitudes(params)
  return count
}

// Cantidad de solicitudes en estado Pendiente.
export function contarPendientes() {
  return contarSolicitudes({ estado: 'Pendiente' })
}
