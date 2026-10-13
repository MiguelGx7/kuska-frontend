import { api } from './cliente'

// Totales, series de los últimos 12 meses y series por categoría.
export async function obtenerDashboard() {
  const { data } = await api.get('dashboard/admin/')
  return data
}
