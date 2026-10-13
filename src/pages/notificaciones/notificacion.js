import { Bell, CircleAlert, ClipboardList, MessageSquareWarning, ShoppingBasket } from 'lucide-react'
import { diasDesde, fechaCorta, soloHora } from '../../utils/fechas'
import { formatearNumero } from '../../utils/numeros'

// Los cuatro tipos que recibe el administrador. tono: clase del cuadro del ícono.
// enlace(n): { texto, a } o null si falta el id relacionado.
const TIPOS = {
  nueva_donacion: {
    icono: ShoppingBasket,
    tono: 'azul',
    enlace: (n) => n.donacion != null && { texto: 'Revisar donación', a: `/donaciones/${n.donacion}` },
  },
  nueva_solicitud: {
    icono: ClipboardList,
    tono: 'azul',
    enlace: (n) => n.solicitud != null && { texto: 'Ver solicitud', a: `/solicitudes/${n.solicitud}` },
  },
  novedad_creada: {
    icono: CircleAlert,
    tono: 'naranja',
    enlace: () => ({ texto: 'Ir a novedades', a: '/novedades' }),
  },
  entrega_reclamada: {
    icono: MessageSquareWarning,
    tono: 'rojo',
    enlace: (n) =>
      n.solicitud != null && { texto: 'Responder reclamo', a: `/solicitudes/${n.solicitud}` },
  },
}

const OTRO_TIPO = { icono: Bell, tono: 'gris', enlace: () => null }

export function tipoDe(notificacion) {
  return TIPOS[notificacion.tipo] ?? OTRO_TIPO
}

export function enlaceDe(notificacion) {
  return tipoDe(notificacion).enlace(notificacion) || null
}

export const OPCIONES_TIPO = [
  { valor: '', texto: 'Todos los tipos' },
  { valor: 'nueva_donacion', texto: 'Nuevas donaciones' },
  { valor: 'nueva_solicitud', texto: 'Nuevas solicitudes' },
  { valor: 'novedad_creada', texto: 'Novedades' },
  { valor: 'entrega_reclamada', texto: 'Reclamos de entrega' },
]

const GRUPOS = ['Hoy', 'Ayer', 'Anteriores']

function grupoDe(iso, ahora) {
  const dias = diasDesde(iso, ahora)
  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Ayer'
  return 'Anteriores'
}

// [{ titulo: 'Hoy', items }, …] en ese orden, sin grupos vacíos (fechas en hora de Bogotá).
export function agruparPorFecha(notificaciones, ahora = new Date()) {
  const grupos = Object.fromEntries(GRUPOS.map((g) => [g, []]))
  notificaciones.forEach((n) => grupos[grupoDe(n.fecha, ahora)].push(n))
  return GRUPOS.filter((g) => grupos[g].length > 0).map((g) => ({ titulo: g, items: grupos[g] }))
}

// "9:42 a. m." en Hoy y Ayer; "10 oct" en Anteriores.
export function horaDe(notificacion, grupo, ahora = new Date()) {
  return grupo === 'Anteriores' ? fechaCorta(notificacion.fecha, ahora) : soloHora(notificacion.fecha)
}

export function subtituloNoLeidas(cantidad) {
  if (cantidad == null) return null
  if (cantidad === 0) return 'Estás al día.'
  return `Tienes ${formatearNumero(cantidad)} sin leer.`
}

export function toastMarcadas(cantidad) {
  return cantidad === 1 ? 'Marcaste 1 como leída.' : `Marcaste ${formatearNumero(cantidad)} como leídas.`
}

export function textoVacio(pestana, tipo) {
  if (tipo) {
    return { titulo: 'No hay notificaciones de este tipo', texto: 'Prueba con otro tipo o mira todas.' }
  }
  if (pestana === 'sinLeer') {
    return { titulo: 'Estás al día', texto: 'No tienes notificaciones sin leer.' }
  }
  return {
    titulo: 'Todavía no tienes notificaciones',
    texto: 'Aquí verás las donaciones, solicitudes, novedades y reclamos nuevos.',
  }
}
