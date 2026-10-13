import { api } from './cliente'

// Lista paginada. Filtros: estado, donacion (id), donante (id), page.
export async function listarNovedades(params) {
  const { data } = await api.get('admin/novedades/', { params })
  return data
}

// Cantidad de novedades en estado Pendiente (campo "count" de la lista paginada).
export async function contarPendientes() {
  const { count } = await listarNovedades({ estado: 'Pendiente' })
  return count
}
