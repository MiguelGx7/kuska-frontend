import { api } from './cliente'

// Lista paginada. Filtros: rol, estado, search, page.
export async function listarUsuarios(params) {
  const { data } = await api.get('admin/usuarios/', { params })
  return data
}

// Incluye estado, bloqueado_hasta y último ingreso.
export async function obtenerUsuario(id) {
  const { data } = await api.get(`admin/usuarios/${id}/`)
  return data
}

// Solo correo y teléfono. Se envía únicamente lo que cambió.
export async function corregirUsuario(id, cambios) {
  const { data } = await api.patch(`admin/usuarios/${id}/`, cambios)
  return data
}

// estado: Activo | Inactivo. Al reactivar puede volver a Bloqueado si tiene un bloqueo vigente.
export async function cambiarEstadoUsuario(id, estado) {
  const { data } = await api.post(`admin/usuarios/${id}/cambiar-estado/`, { estado })
  return data
}

// Muestra, sin aplicar nada, lo que pasaría con la acción.
// accion: advertencia | bloqueo_temporal | bloqueo_permanente | inactivar
export async function obtenerImpacto(id, accion) {
  const { data } = await api.get(`admin/usuarios/${id}/impacto/`, { params: { accion } })
  return data
}
