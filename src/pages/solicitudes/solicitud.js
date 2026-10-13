// Textos y cálculos compartidos por la lista y el detalle de solicitudes.

// Qué pasó con la confirmación del beneficiario después de la entrega.
export const TEXTO_CONFIRMACION = {
  Pendiente: 'Esperando confirmación',
  Confirmada: 'Confirmó que la recibió',
  Asumida: 'Se dio por recibida',
  Reclamada: 'Reclamó: no la recibió',
  Revisada: 'Reclamo respondido',
}

export const MODALIDAD_SOLICITUD = {
  Recoger: 'La recoge el beneficiario',
  Domicilio: 'El donante la lleva',
}

export function confirmacionDe(solicitud) {
  return solicitud?.entrega?.estado_confirmacion ?? null
}

export function estaReclamada(solicitud) {
  return confirmacionDe(solicitud) === 'Reclamada'
}

// Los detalles cancelados se retiraron al aceptar una novedad: no se entregan.
export function alimentosPedidos(solicitud) {
  return (solicitud?.detalles ?? []).filter((d) => !d.cancelado)
}

export function textoAlimentos(cantidad) {
  return cantidad === 1 ? '1 alimento' : `${cantidad} alimentos`
}

// "Recoger antes de:" o, si el donante la lleva, "Entregar antes de:".
export function etiquetaLimite(solicitud) {
  return solicitud?.modalidad_entrega === 'Domicilio' ? 'Entregar antes de:' : 'Recoger antes de:'
}

// Acción de la fila en la lista. destacada = botón secundario; si no, enlace.
export function accionDeFila(solicitud) {
  if (estaReclamada(solicitud)) return { texto: 'Responder', destacada: true }
  if (solicitud.estado === 'Pendiente') return { texto: 'Revisar', destacada: true }
  if (solicitud.estado === 'Aprobada') return { texto: 'Gestionar', destacada: false }
  return { texto: 'Ver', destacada: false }
}

// Novedad pendiente que detiene la solicitud: una sobre toda la donación
// (donacion_alimento null) o sobre un alimento que esta solicitud pidió.
export function novedadQueDetiene(solicitud, novedades = []) {
  const ids = new Set(alimentosPedidos(solicitud).map((d) => d.alimento))
  return (
    novedades.find((n) => n.donacion_alimento == null || ids.has(n.donacion_alimento)) ?? null
  )
}
