export const ROL_ADMIN = 'Administrador'

// La API no tiene "nombre": se arma con nombres + apellidos.
export function nombreCompleto(usuario) {
  if (!usuario) return ''
  return [usuario.nombres, usuario.apellidos].filter(Boolean).join(' ')
}

export function iniciales(usuario) {
  const letras = [usuario?.nombres, usuario?.apellidos]
    .map((parte) => parte?.trim()?.[0] ?? '')
    .join('')
  return letras.toUpperCase() || 'A'
}
