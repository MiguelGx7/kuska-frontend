import { api } from './cliente'

// Lista paginada: { count, next, previous, results }. Filtros: estado, search, page.
export async function listarDonaciones(params) {
  const { data } = await api.get('admin/donaciones/', { params })
  return data
}

// Cantidad de donaciones que cumplen los filtros (campo "count").
export async function contarDonaciones(params) {
  const { count } = await listarDonaciones(params)
  return count
}

// Cantidad de donaciones en estado Pendiente.
export function contarPendientes() {
  return contarDonaciones({ estado: 'Pendiente' })
}

export async function obtenerDonacion(id) {
  const { data } = await api.get(`admin/donaciones/${id}/`)
  return data
}

// El backend vuelve a revisar el vencimiento de cada alimento antes de validar.
export async function validarDonacion(id) {
  const { data } = await api.post(`admin/donaciones/${id}/validar/`)
  return data
}

export async function rechazarDonacion(id, motivoRechazo) {
  const { data } = await api.post(`admin/donaciones/${id}/rechazar/`, {
    motivo_rechazo: motivoRechazo,
  })
  return data
}
