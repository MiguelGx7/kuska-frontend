import { api } from './cliente'

// Fila única con los plazos y límites de las reglas de negocio.
export async function obtenerConfiguracion() {
  const { data } = await api.get('admin/configuracion/')
  return data
}
