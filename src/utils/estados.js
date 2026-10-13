// Color del Badge según el estado. El sistema usa solo 4 familias:
// naranja (espera acción), verde (bien), rojo (mal o bloqueado), gris (cerrado o neutro).
const COLORES = {
  donacion: {
    Pendiente: 'naranja',
    Validada: 'verde',
    Rechazada: 'rojo',
    Agotada: 'gris',
    Finalizada: 'gris',
  },
  solicitud: {
    Pendiente: 'naranja',
    Aprobada: 'verde',
    Entregada: 'verde',
    Rechazada: 'rojo',
    'No recogida': 'rojo',
    Cancelada: 'gris',
  },
  novedad: {
    Pendiente: 'naranja',
    Aceptada: 'verde',
    Rechazada: 'rojo',
  },
  usuario: {
    Activo: 'verde',
    Bloqueado: 'rojo',
    Inactivo: 'gris',
  },
  sancion: {
    Advertencia: 'naranja',
    'Bloqueo temporal': 'rojo',
    'Bloqueo permanente': 'rojo',
  },
  confirmacion: {
    Pendiente: 'naranja',
    Confirmada: 'verde',
    Reclamada: 'rojo',
    Asumida: 'gris',
    Revisada: 'gris',
  },
}

// tipo: donacion | solicitud | novedad | usuario | sancion | confirmacion
export function colorEstado(tipo, estado) {
  return COLORES[tipo]?.[estado] ?? 'gris'
}
