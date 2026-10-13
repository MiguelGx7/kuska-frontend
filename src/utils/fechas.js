// Fechas en hora de Bogotá (UTC-5, sin horario de verano).
const ZONA = 'America/Bogota'

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MESES_LARGOS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const formatoPartes = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONA,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

// { anio, mes (1-12), dia, hora (0-23), minuto } de una fecha vista en Bogotá.
function partesBogota(fecha) {
  const partes = {}
  for (const { type, value } of formatoPartes.formatToParts(fecha)) {
    partes[type] = Number(value)
  }
  return { anio: partes.year, mes: partes.month, dia: partes.day, hora: partes.hour, minuto: partes.minute }
}

function diasEntre(a, b) {
  const inicio = Date.UTC(a.anio, a.mes - 1, a.dia)
  const fin = Date.UTC(b.anio, b.mes - 1, b.dia)
  return Math.round((fin - inicio) / 86_400_000)
}

// "8:15 a. m."
function hora({ hora: h, minuto }) {
  const sufijo = h < 12 ? 'a. m.' : 'p. m.'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(minuto).padStart(2, '0')} ${sufijo}`
}

// "hace 12 minutos", "hoy, 8:15 a. m.", "ayer", "10 oct" o "10 oct 2025".
export function fechaRelativa(iso, ahora = new Date()) {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''

  const minutos = Math.floor((ahora - fecha) / 60_000)
  if (minutos < 1) return 'hace un momento'
  if (minutos < 60) return minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`

  const p = partesBogota(fecha)
  const hoy = partesBogota(ahora)
  const dias = diasEntre(p, hoy)

  if (dias === 0) return `hoy, ${hora(p)}`
  if (dias === 1) return 'ayer'

  const corta = `${p.dia} ${MESES_CORTOS[p.mes - 1]}`
  return p.anio === hoy.anio ? corta : `${corta} ${p.anio}`
}

// "2026-10" → "oct"
export function mesCorto(aaaamm) {
  const mes = Number(aaaamm?.split('-')[1])
  return MESES_CORTOS[mes - 1] ?? ''
}

// "2026-10" → "Octubre 2026"
export function mesLargo(aaaamm) {
  const [anio, mes] = (aaaamm ?? '').split('-')
  const nombre = MESES_LARGOS[Number(mes) - 1]
  return nombre ? `${nombre} ${anio}` : ''
}

function dosDigitos(n) {
  return String(n).padStart(2, '0')
}

// Fecha de hoy en Bogotá: "2026-10-13"
export function hoyBogota(ahora = new Date()) {
  const { anio, mes, dia } = partesBogota(ahora)
  return `${anio}-${dosDigitos(mes)}-${dosDigitos(dia)}`
}

// ("2026-10-13", 2) → "2026-10-15". Trabaja con fechas sin hora.
export function sumarDias(aaaammdd, dias) {
  const [anio, mes, dia] = aaaammdd.split('-').map(Number)
  return new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10)
}

// Fecha sin hora (p. ej. un vencimiento): "12 de octubre", o "12 de octubre de 2027" si no es este año.
export function fechaDia(aaaammdd, ahora = new Date()) {
  const [anio, mes, dia] = (aaaammdd ?? '').split('-').map(Number)
  if (!anio || !mes || !dia) return ''
  const texto = `${dia} de ${MESES_LARGOS[mes - 1].toLowerCase()}`
  return anio === partesBogota(ahora).anio ? texto : `${texto} de ${anio}`
}

// Fecha sin hora, corta: "12 oct", o "12 oct 2027" si no es este año.
export function fechaDiaCorta(aaaammdd, ahora = new Date()) {
  const [anio, mes, dia] = (aaaammdd ?? '').split('-').map(Number)
  if (!anio || !mes || !dia) return ''
  const texto = `${dia} ${MESES_CORTOS[mes - 1]}`
  return anio === partesBogota(ahora).anio ? texto : `${texto} ${anio}`
}

// ¿La fecha y hora cae hoy en Bogotá?
export function esHoy(iso, ahora = new Date()) {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return false
  const p = partesBogota(fecha)
  const hoy = partesBogota(ahora)
  return p.anio === hoy.anio && p.mes === hoy.mes && p.dia === hoy.dia
}

// Plazos, donde importa la hora: "hoy, 6:00 p. m." o "15 oct, 6:00 p. m." (con el año si no es este).
export function fechaHora(iso, ahora = new Date()) {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const p = partesBogota(fecha)
  if (esHoy(iso, ahora)) return `hoy, ${hora(p)}`
  const dia = `${p.dia} ${MESES_CORTOS[p.mes - 1]}`
  const conAnio = p.anio === partesBogota(ahora).anio ? dia : `${dia} ${p.anio}`
  return `${conAnio}, ${hora(p)}`
}

// Para frases: "15 de octubre a las 6:00 p. m." (con "de 2027" si no es este año).
export function fechaHoraLarga(iso, ahora = new Date()) {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const p = partesBogota(fecha)
  const dia = `${p.dia} de ${MESES_LARGOS[p.mes - 1].toLowerCase()}`
  const conAnio = p.anio === partesBogota(ahora).anio ? dia : `${dia} de ${p.anio}`
  return `${conAnio} a las ${hora(p)}`
}

// "octubre de 2025"
export function fechaMesAnio(iso) {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return ''
  const { anio, mes } = partesBogota(fecha)
  return `${MESES_LARGOS[mes - 1].toLowerCase()} de ${anio}`
}

// "Martes 13 de octubre"
export function hoyLargo(ahora = new Date()) {
  const { anio, mes, dia } = partesBogota(ahora)
  const diaSemana = new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay()
  return `${DIAS[diaSemana]} ${dia} de ${MESES_LARGOS[mes - 1].toLowerCase()}`
}
