import { api } from './cliente'

// Cantidad de notificaciones sin leer del usuario actual.
export async function contarNoLeidas() {
  const { data } = await api.get('notificaciones/', { params: { leida: false } })
  return data.no_leidas
}
