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

export async function obtenerSolicitud(id) {
  const { data } = await api.get(`admin/solicitudes/${id}/`)
  return data
}

// Las acciones devuelven la solicitud actualizada (p. ej. con fecha_limite_recogida al aprobar).

export async function aprobarSolicitud(id) {
  const { data } = await api.post(`admin/solicitudes/${id}/aprobar/`)
  return data
}

export async function rechazarSolicitud(id, motivoRechazo) {
  const { data } = await api.post(`admin/solicitudes/${id}/rechazar/`, {
    motivo_rechazo: motivoRechazo,
  })
  return data
}

// La entrega es total; la observación es opcional.
export async function entregarSolicitud(id, observacion) {
  const { data } = await api.post(
    `admin/solicitudes/${id}/entregar/`,
    observacion ? { observacion } : {},
  )
  return data
}

// Solo si la confirmación está Reclamada. No sanciona: eso se hace aparte.
export async function responderReclamo(id, respuestaAdmin) {
  const { data } = await api.post(`admin/solicitudes/${id}/revisar-reclamo/`, {
    respuesta_admin: respuestaAdmin,
  })
  return data
}
