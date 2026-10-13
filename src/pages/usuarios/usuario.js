// Textos y cálculos compartidos por la lista y el detalle de usuarios.
import { fechaHoraLarga } from '../../utils/fechas'
import { conPuntoFinal } from '../../utils/texto'

export const ROL_ADMINISTRADOR = 'Administrador'

export function esNegocio(usuario) {
  return usuario?.rol === 'Donante' && usuario?.tipo_donante === 'Negocio'
}

export function nombrePersona(usuario) {
  return [usuario?.nombres, usuario?.apellidos].filter(Boolean).join(' ')
}

// Un negocio se muestra con su nombre comercial; la persona va aparte.
export function nombreVisible(usuario) {
  return esNegocio(usuario) && usuario.nombre_negocio ? usuario.nombre_negocio : nombrePersona(usuario)
}

export function rolVisible(usuario) {
  return esNegocio(usuario) ? 'Donante (negocio)' : usuario?.rol
}

// "CC 1012345678"
export function documento(usuario) {
  if (!usuario?.numero_documento) return '—'
  return [usuario.tipo_documento, usuario.numero_documento].filter(Boolean).join(' ')
}

// Bloqueado sin fecha de fin = bloqueo permanente.
export function bloqueoPermanente(usuario) {
  return usuario?.estado === 'Bloqueado' && !usuario.bloqueado_hasta
}

export function bloqueoTemporalVigente(usuario) {
  return Boolean(usuario?.bloqueado_hasta) && new Date(usuario.bloqueado_hasta) > new Date()
}

// ---- Sanciones ----

export const TIPOS_SANCION = [
  {
    valor: 'Advertencia',
    titulo: 'Advertencia',
    texto: 'No cambia su estado ni lo que tiene en curso. Recibe una notificación.',
  },
  {
    valor: 'Bloqueo temporal',
    titulo: 'Bloqueo temporal',
    texto: 'No puede entrar a la app durante 7 días.',
  },
  {
    valor: 'Bloqueo permanente',
    titulo: 'Bloqueo permanente',
    texto: 'No puede volver a entrar. Es definitivo.',
  },
]

// Para pedir el impacto de cada tipo.
export const ACCION_DE_TIPO = {
  Advertencia: 'advertencia',
  'Bloqueo temporal': 'bloqueo_temporal',
  'Bloqueo permanente': 'bloqueo_permanente',
}

const CON_ARTICULO = {
  Advertencia: 'una advertencia',
  'Bloqueo temporal': 'un bloqueo temporal',
  'Bloqueo permanente': 'un bloqueo permanente',
}

export function tipoConArticulo(tipo) {
  return CON_ARTICULO[tipo] ?? tipo?.toLowerCase()
}

export function historialVacio(historial) {
  if (!historial) return true
  return !historial.advertencias && !historial.bloqueos_temporales && !historial.bloqueos_permanentes
}

// ["1 advertencia", "2 bloqueos temporales"]
function partesHistorial(historial) {
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`
  return [
    historial?.advertencias && plural(historial.advertencias, 'advertencia', 'advertencias'),
    historial?.bloqueos_temporales &&
      plural(historial.bloqueos_temporales, 'bloqueo temporal', 'bloqueos temporales'),
    historial?.bloqueos_permanentes &&
      plural(historial.bloqueos_permanentes, 'bloqueo permanente', 'bloqueos permanentes'),
  ].filter(Boolean)
}

// "1 advertencia, 1 bloqueo temporal" (para el resumen de la tarjeta)
export function historialConComas(historial) {
  return partesHistorial(historial).join(', ')
}

// "1 advertencia y 1 bloqueo temporal" (para frases)
export function historialEnFrase(historial) {
  const partes = partesHistorial(historial)
  if (partes.length <= 1) return partes.join('')
  return `${partes.slice(0, -1).join(', ')} y ${partes.at(-1)}`
}

// Título del paso 2 y texto del botón de confirmar.
export function confirmacionSancion(tipo, nombre) {
  if (tipo === 'Bloqueo temporal') {
    return { titulo: `Bloquear 7 días a ${nombre}`, boton: 'Bloquear 7 días', variante: 'peligro' }
  }
  if (tipo === 'Bloqueo permanente') {
    return {
      titulo: `Bloquear para siempre a ${nombre}`,
      boton: 'Bloquear para siempre',
      variante: 'peligro',
    }
  }
  return { titulo: 'Registrar una advertencia', boton: 'Registrar advertencia', variante: 'principal' }
}

// Toast después de sancionar. Si la cuenta estaba inactiva, un bloqueo solo queda en el historial.
export function toastSancion({ tipo, nombre, fechaFin, estabaInactivo }) {
  if (estabaInactivo && tipo !== 'Advertencia') {
    return 'Sanción registrada en el historial. La cuenta sigue inactiva.'
  }
  if (tipo === 'Bloqueo temporal') {
    const hasta = fechaFin ? fechaHoraLarga(fechaFin) : 'dentro de 7 días'
    return `${conPuntoFinal(`${nombre} quedó bloqueado hasta el ${hasta}`)} Se cerraron sus sesiones.`
  }
  if (tipo === 'Bloqueo permanente') return `${nombre} quedó bloqueado para siempre.`
  return `Advertencia registrada. ${nombre} recibió la notificación.`
}
