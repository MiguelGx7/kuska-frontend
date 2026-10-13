// Validaciones y textos de error de Recuperar contraseña.

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LARGO_CODIGO = 6
export const ESPERA_REENVIO_S = 60

export const MENSAJE_MUCHOS_INTENTOS = 'Hiciste muchos intentos. Espera un minuto y vuelve a intentarlo.'
const MENSAJE_CODIGO = 'El código no es válido o ya venció. Revísalo o pide uno nuevo.'
const MENSAJE_SIN_CONEXION = 'No pudimos conectar. Revisa tu conexión e intenta de nuevo.'

export function validarCorreo(correo) {
  if (!correo) return 'Escribe tu correo.'
  if (!REGEX_CORREO.test(correo)) return 'Revisa el correo: debe tener la forma nombre@correo.com.'
  return undefined
}

// Solo dígitos, como mucho 6 (también al pegar "123 456").
export function limpiarCodigo(texto) {
  return texto.replace(/\D/g, '').slice(0, LARGO_CODIGO)
}

export function validarCambio({ codigo, contrasena, repetida }) {
  const errores = {}
  if (codigo.length !== LARGO_CODIGO) errores.codigo = 'Escribe los 6 dígitos del código.'

  if (!contrasena) errores.contrasena = 'Escribe la contraseña nueva.'
  else if (contrasena.length < 8) errores.contrasena = 'Usa al menos 8 caracteres.'
  else if (/^\d+$/.test(contrasena)) errores.contrasena = 'No uses solo números.'

  if (!errores.contrasena && repetida !== contrasena) {
    errores.repetida = 'Las contraseñas no coinciden.'
  }
  return errores
}

function texto(valor) {
  if (typeof valor === 'string') return valor
  if (Array.isArray(valor)) return valor.filter((v) => typeof v === 'string').join(' ')
  return ''
}

// Errores comunes a los dos pasos: sin conexión, servidor caído o 429.
function errorGeneral(error) {
  const status = error?.response?.status
  if (status === 429) return MENSAJE_MUCHOS_INTENTOS
  if (!error?.response || status >= 500) return MENSAJE_SIN_CONEXION
  return null
}

// Paso 1 (y "Enviar otro código"): { correo } para el campo o { aviso }.
export function erroresDeSolicitar(error) {
  const general = errorGeneral(error)
  if (general) return { aviso: general }
  const datos = error.response.data ?? {}
  if (datos.correo) return { correo: texto(datos.correo) }
  return { aviso: texto(datos.detail) || 'No pudimos enviar el código. Intenta de nuevo.' }
}

// Paso 2: los errores de contraseña van al campo; cualquier otro (el del código) al aviso.
export function erroresDeConfirmar(error) {
  const general = errorGeneral(error)
  if (general) return { aviso: general }

  const datos = error.response.data ?? {}
  if (Array.isArray(datos)) return { aviso: texto(datos) || MENSAJE_CODIGO }
  const contrasena = texto(datos.contrasena_nueva)
  const otro = texto(datos.codigo) || texto(datos.detail) || texto(datos.non_field_errors)
  const resultado = {}
  if (contrasena) resultado.contrasena = contrasena
  if (otro || !contrasena) resultado.aviso = otro || MENSAJE_CODIGO
  return resultado
}
