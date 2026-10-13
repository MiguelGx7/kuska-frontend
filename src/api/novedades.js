import { api } from './cliente'

// Lista paginada. Filtros: estado, donacion (id), donante (id), page.
export async function listarNovedades(params) {
  const { data } = await api.get('admin/novedades/', { params })
  return data
}

// Cantidad de novedades que cumplen los filtros (campo "count").
export async function contarNovedades(params) {
  const { count } = await listarNovedades(params)
  return count
}

// Cantidad de novedades en estado Pendiente.
export function contarPendientes() {
  return contarNovedades({ estado: 'Pendiente' })
}

export async function obtenerNovedad(id) {
  const { data } = await api.get(`admin/novedades/${id}/`)
  return data
}

// Retira lo afectado, ajusta las solicitudes en curso y avisa. La respuesta es opcional.
export async function aceptarNovedad(id, respuestaAdmin) {
  const { data } = await api.post(
    `admin/novedades/${id}/aceptar/`,
    respuestaAdmin ? { respuesta_admin: respuestaAdmin } : {},
  )
  return data
}

// Lo afectado vuelve a estar disponible. La respuesta es obligatoria.
export async function rechazarNovedad(id, respuestaAdmin) {
  const { data } = await api.post(`admin/novedades/${id}/rechazar/`, {
    respuesta_admin: respuestaAdmin,
  })
  return data
}
