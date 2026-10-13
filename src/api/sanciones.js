import { api } from './cliente'

// Lista paginada. Filtros: usuario (id), tipo, vigente, search, page.
export async function listarSanciones(params) {
  const { data } = await api.get('admin/sanciones/', { params })
  return data
}

// datos: { usuario, tipo, motivo, solicitud?, donacion? }. Devuelve la sanción (con fecha_fin).
export async function crearSancion(datos) {
  const { data } = await api.post('admin/sanciones/', datos)
  return data
}
