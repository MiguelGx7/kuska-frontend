// Textos de una novedad. Puede ser sobre un alimento o sobre toda la donación
// (donacion_alimento null).

export function esSobreTodaLaDonacion(novedad) {
  return novedad?.donacion_alimento == null
}

// "Sobre «Queso campesino»" / "Sobre toda la donación"
export function textoSobre(novedad) {
  return esSobreTodaLaDonacion(novedad)
    ? 'Sobre toda la donación'
    : `Sobre «${novedad.alimento_nombre}»`
}

export function tituloNovedad(novedad) {
  return esSobreTodaLaDonacion(novedad)
    ? 'Novedad sobre toda la donación'
    : `Novedad sobre «${novedad.alimento_nombre}»`
}

// Qué pasa si se acepta. Con toda la donación el verbo va en plural.
export function textoSiAcepta(novedad) {
  if (esSobreTodaLaDonacion(novedad)) {
    return `Se retiran todos los alimentos de «${novedad.donacion_titulo}» para siempre: dejan de estar disponibles y salen de las solicitudes en curso. Si una solicitud se queda sin alimentos, se cancela.`
  }
  return `Se retira «${novedad.alimento_nombre}» para siempre: deja de estar disponible y sale de las solicitudes en curso. Si una solicitud se queda sin alimentos, se cancela.`
}

export function textoSiRechaza(novedad) {
  const sujeto = esSobreTodaLaDonacion(novedad) ? 'La donación' : `«${novedad.alimento_nombre}»`
  return `${sujeto} vuelve a estar disponible para pedir y las solicitudes detenidas siguen su curso.`
}

// Acompaña al número grande. Con 0 no se promete ningún ajuste ni aviso.
export function textoAfectadas(cantidad) {
  if (!cantidad) return 'solicitudes en curso se ven afectadas'
  return cantidad === 1
    ? 'solicitud en curso se ajusta y su beneficiario recibe un aviso'
    : 'solicitudes en curso se ajustan y sus beneficiarios reciben un aviso'
}

export function textoMientrasRevisas(novedad) {
  const sujeto = esSobreTodaLaDonacion(novedad) ? 'esta donación' : `«${novedad.alimento_nombre}»`
  return `Mientras la revisas, ${sujeto} no se puede pedir y esas solicitudes no se pueden aprobar ni entregar.`
}

// " Se avisará a 3 beneficiarios." (vacío si no hay afectadas)
export function textoSeAvisara(cantidad) {
  if (!cantidad) return ''
  return cantidad === 1 ? ' Se avisará a 1 beneficiario.' : ` Se avisará a ${cantidad} beneficiarios.`
}

export function toastAceptada(cantidad) {
  if (!cantidad) return 'Novedad aceptada. No había solicitudes afectadas.'
  if (cantidad === 1) return 'Novedad aceptada. Se ajustó 1 solicitud y se avisó a su beneficiario.'
  return `Novedad aceptada. Se ajustaron ${cantidad} solicitudes y se avisó a sus beneficiarios.`
}

export function toastRechazada(novedad) {
  return esSobreTodaLaDonacion(novedad)
    ? 'Novedad rechazada. La donación vuelve a estar disponible.'
    : `Novedad rechazada. «${novedad.alimento_nombre}» vuelve a estar disponible.`
}

// Título de la caja cuando ya se resolvió.
export function tituloResuelta(novedad) {
  if (novedad.estado === 'Aceptada') {
    return esSobreTodaLaDonacion(novedad)
      ? 'Aceptada: se retiró la donación'
      : `Aceptada: se retiró «${novedad.alimento_nombre}»`
  }
  return 'Rechazada: sigue disponible'
}
