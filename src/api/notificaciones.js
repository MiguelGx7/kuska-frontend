import { api } from './cliente'

// Lista paginada del usuario actual, de la más nueva a la más vieja.
// Incluye no_leidas (total del usuario, sin importar filtros).
export async function listarNotificaciones(params) {
  const { data } = await api.get('notificaciones/', { params })
  return data
}

// Cantidad de notificaciones sin leer del usuario actual.
export async function contarNoLeidas() {
  const { no_leidas } = await listarNotificaciones({ leida: false })
  return no_leidas
}
