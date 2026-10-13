// Textos y cálculos compartidos por la lista y el detalle de donaciones.

export const MODALIDAD_CORTA = {
  Recoger: 'Recoger',
  Domicilio: 'Domicilio',
  Ambas: 'Recoger o domicilio',
}

export const MODALIDAD_LARGA = {
  Recoger: 'La recoge el beneficiario',
  Domicilio: 'El donante la lleva',
  Ambas: 'Recoger o domicilio',
}

// Los alimentos con activo = false se retiraron al aceptar una novedad (RN-32): no cuentan.
export function alimentosActivos(donacion) {
  return (donacion?.alimentos ?? []).filter((a) => a.activo !== false)
}

export function textoAlimentos(cantidad) {
  return cantidad === 1 ? '1 alimento' : `${cantidad} alimentos`
}

export function textoDias(n) {
  return n === 1 ? '1 día' : `${n} días`
}

// Foto para la miniatura: la del primer alimento activo; si no tiene, la de cualquiera.
export function fotoPrincipal(donacion) {
  const activos = alimentosActivos(donacion)
  return activos[0]?.foto_url ?? donacion?.alimentos?.find((a) => a.foto_url)?.foto_url ?? null
}
