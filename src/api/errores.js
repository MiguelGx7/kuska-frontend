// Convierte cualquier error de la API en un texto para mostrar al usuario.
// Formas que devuelve el backend:
//   401/403/404/429 → { "detail": "..." }
//   400             → { "campo": ["mensaje"] } o ["mensaje"]

const CAMPOS_GENERALES = ['detail', 'non_field_errors']

const MENSAJE_SIN_CONEXION = 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.'
const MENSAJE_SERVIDOR = 'Ocurrió un error en el servidor. Intenta de nuevo más tarde.'
const MENSAJE_GENERICO = 'Ocurrió un error inesperado. Intenta de nuevo.'

// Junta todos los textos de un valor que puede ser string, lista u objeto anidado.
function textos(valor) {
  if (typeof valor === 'string') return [valor]
  if (Array.isArray(valor)) return valor.flatMap(textos)
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos)
  return []
}

function campoLegible(campo) {
  const texto = campo.replace(/_/g, ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function mensajeDeDatos(datos) {
  // Un string suele ser una página HTML de error: no sirve como mensaje.
  if (typeof datos === 'string') return null
  if (Array.isArray(datos)) return textos(datos).join(' ') || null

  if (datos && typeof datos === 'object') {
    if (typeof datos.detail === 'string') return datos.detail

    const mensajes = Object.entries(datos).flatMap(([campo, valor]) => {
      const lista = textos(valor)
      if (CAMPOS_GENERALES.includes(campo)) return lista
      return lista.map((mensaje) => `${campoLegible(campo)}: ${mensaje}`)
    })
    return mensajes.join(' ') || null
  }

  return null
}

export function obtenerMensajeError(error) {
  if (!error) return MENSAJE_GENERICO

  if (error.isAxiosError) {
    const respuesta = error.response
    if (!respuesta) return MENSAJE_SIN_CONEXION

    const mensaje = mensajeDeDatos(respuesta.data)
    if (mensaje) return mensaje
    if (respuesta.status >= 500) return MENSAJE_SERVIDOR
    return MENSAJE_GENERICO
  }

  // Errores propios del frontend (p. ej. rol no permitido en el login)
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string') return error
  return MENSAJE_GENERICO
}
