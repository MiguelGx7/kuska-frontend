// Definición de cada ajuste: textos, validación y ejemplo en vivo.
import { fechaDia, hoyBogota, sumarDias } from '../../utils/fechas'
import { formatearCantidad } from '../../utils/numeros'
import { plural } from '../../utils/texto'

const ERROR_ENTERO_POSITIVO = 'Debe ser un número entero mayor que 0.'
const ERROR_ENTERO_CERO = 'Debe ser un número entero de 0 o más.'
const ERROR_PORCENTAJE = 'Debe ser mayor que 0 y máximo 100.'

// Evita errores de coma flotante al redondear hacia abajo (p. ej. 33,33 × 10 = 333,29999…).
function pisoSeguro(x) {
  return Math.floor(Math.round(x * 1e6) / 1e6)
}

const formatoPorcentaje = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })

export const AJUSTES = [
  {
    clave: 'plazo_recogida_dias',
    grupo: 'entregas',
    etiqueta: 'Días para recoger',
    sufijo: 'días',
    tipo: 'entero',
    minimo: 1,
    ayuda:
      'Desde que apruebas una solicitud, cuántos días tiene el beneficiario para recogerla (RN-24). Si los alimentos vencen antes, manda el vencimiento.',
    ejemplo: (n) => {
      const hoy = hoyBogota()
      return `Con ${plural(n, 'día', 'días')}: si apruebas hoy, ${fechaDia(hoy)}, la fecha límite es el ${fechaDia(sumarDias(hoy, n))} a las 11:59 p. m.`
    },
    antes: (n) => plural(n, 'día', 'días'),
  },
  {
    clave: 'margen_vencimiento_dias',
    grupo: 'entregas',
    etiqueta: 'Margen antes del vencimiento',
    sufijo: 'días',
    tipo: 'entero',
    minimo: 0,
    ayuda:
      'Cuántos días antes de vencer un alimento deja de poder pedirse, para que alcance a entregarse en buen estado (RN-11, RN-14).',
    ejemplo: (n) => {
      const hoy = hoyBogota()
      const vence = sumarDias(hoy, 7)
      const hasta = sumarDias(vence, -n - 1)
      const inicio = `Con ${plural(n, 'día', 'días')}: un alimento que vence el ${fechaDia(vence)}`
      // Con un margen grande el último día ya pasó.
      if (hasta < hoy) return `${inicio} ya no se puede pedir.`
      return `${inicio} se puede pedir hasta el ${fechaDia(hasta)}.`
    },
    antes: (n) => plural(n, 'día', 'días'),
  },
  {
    clave: 'max_solicitudes_activas',
    grupo: 'limites',
    etiqueta: 'Solicitudes en curso por beneficiario',
    tipo: 'entero',
    minimo: 1,
    ayuda:
      'Cuántas solicitudes pendientes o aprobadas puede tener al mismo tiempo cada beneficiario. Cada donación de su carrito es una solicitud (RN-22).',
    ejemplo: (n) =>
      `Con ${n}: si ya tiene ${plural(n, 'solicitud', 'solicitudes')} en curso, no puede enviar otra hasta que alguna termine.`,
    antes: (n) => String(n),
  },
  {
    clave: 'max_alimentos_por_solicitud',
    grupo: 'limites',
    etiqueta: 'Alimentos distintos por solicitud',
    tipo: 'entero',
    minimo: 1,
    ayuda: 'Cuántos alimentos diferentes puede pedir en una misma solicitud. Cuenta productos, no cantidades.',
    ejemplo: (n) =>
      `Con ${n}: puede pedir hasta ${plural(n, 'producto distinto', 'productos distintos')} de una misma donación.`,
    antes: (n) => String(n),
  },
  {
    clave: 'porcentaje_max_por_alimento',
    grupo: 'limites',
    etiqueta: 'Máximo por alimento',
    sufijo: '%',
    tipo: 'porcentaje',
    ayuda:
      'Qué parte de cada alimento puede llevarse una sola persona. Se calcula al validar la donación y queda fijo (RN-13).',
    // Misma regla de redondeo que RN-13: hacia abajo; mínimo 0,01 en kg y 1 en unidades.
    ejemplo: (p) => {
      const kg = Math.max(0.01, pisoSeguro(10 * p) / 100)
      const panelas = Math.max(1, pisoSeguro((12 * p) / 100))
      return `Con ${formatoPorcentaje.format(p)} %: de 10 kg de arroz, una persona puede pedir hasta ${formatearCantidad(kg, 'kg')}; de 12 panelas, hasta ${plural(panelas, 'panela', 'panelas')}.`
    },
    antes: (p) => `${formatoPorcentaje.format(p)} %`,
  },
]

// Texto del campo → número, o un mensaje de error.
export function leerValor(ajuste, texto) {
  const limpio = String(texto ?? '').trim()
  if (ajuste.tipo === 'porcentaje') {
    // Acepta coma o punto decimal, con hasta 2 decimales.
    if (!/^\d+([.,]\d{1,2})?$/.test(limpio)) return { error: ERROR_PORCENTAJE }
    const valor = Number(limpio.replace(',', '.'))
    if (!(valor > 0 && valor <= 100)) return { error: ERROR_PORCENTAJE }
    return { valor }
  }
  const mensaje = ajuste.minimo === 0 ? ERROR_ENTERO_CERO : ERROR_ENTERO_POSITIVO
  if (!/^\d+$/.test(limpio)) return { error: mensaje }
  const valor = Number(limpio)
  if (valor < ajuste.minimo) return { error: mensaje }
  return { valor }
}

// Valor guardado → texto para el campo ("30.00" → "30", "12.50" → "12,5").
export function textoInicial(ajuste, guardado) {
  if (guardado == null) return ''
  if (ajuste.tipo === 'porcentaje') return formatoPorcentaje.format(Number(guardado)).replace(/\./g, '')
  return String(guardado)
}

// El valor para enviar a la API: los enteros como número, el porcentaje como texto "30.00".
export function valorParaApi(ajuste, valor) {
  return ajuste.tipo === 'porcentaje' ? valor.toFixed(2) : valor
}
