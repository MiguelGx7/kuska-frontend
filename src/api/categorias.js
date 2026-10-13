import { api } from './cliente'

// Lista paginada (incluye las inactivas). Filtros: activa, search, page.
export async function listarCategorias(params) {
  const { data } = await api.get('admin/categorias/', { params })
  return data
}

// datos: { nombre, descripcion? }
export async function crearCategoria(datos) {
  const { data } = await api.post('admin/categorias/', datos)
  return data
}

// cambios: { nombre?, descripcion?, activa? }. Inactivarla impide usarla en alimentos nuevos.
export async function actualizarCategoria(id, cambios) {
  const { data } = await api.patch(`admin/categorias/${id}/`, cambios)
  return data
}

// Responde 400 si algún alimento la usa.
export async function eliminarCategoria(id) {
  await api.delete(`admin/categorias/${id}/`)
}
