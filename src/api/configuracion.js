import { api } from './cliente'

// Fila única con los plazos y límites de las reglas de negocio.
export async function obtenerConfiguracion() {
  const { data } = await api.get('admin/configuracion/')
  return data
}

// Envía solo los campos que cambiaron. Devuelve la configuración completa actualizada.
export async function actualizarConfiguracion(cambios) {
  const { data } = await api.patch('admin/configuracion/', cambios)
  return data
}
