import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const CLAVE_ACCESS = 'kumora.access'
const CLAVE_REFRESH = 'kumora.refresh'
const CLAVE_USUARIO = 'kumora.usuario'
const CLAVE_VOLVER_A = 'kumora.volverA'

// 403 que significa "esta cuenta ya no es de administrador" (p. ej. le cambiaron el rol).
// Otros 403, como una cuenta bloqueada, se muestran donde ocurren.
const DETALLE_SOLO_ADMIN = 'Esta acción es solo para administradores.'

// Rutas que no llevan token ni disparan el refresh ante un 401.
// Sin token: un access viejo guardado haría que el backend rechace el login.
const RUTAS_PUBLICAS = ['auth/login/', 'auth/refresh/']

function esRutaPublica(url) {
  return RUTAS_PUBLICAS.some((ruta) => url?.includes(ruta))
}

// ---- Almacenamiento de la sesión (localStorage con try/catch) ----

function leer(clave) {
  try {
    return localStorage.getItem(clave)
  } catch {
    return null
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    // Sin localStorage la sesión no persiste entre recargas
  }
}

function quitar(clave) {
  try {
    localStorage.removeItem(clave)
  } catch {
    // Nada que borrar
  }
}

export function obtenerAccess() {
  return leer(CLAVE_ACCESS)
}

export function obtenerRefresh() {
  return leer(CLAVE_REFRESH)
}

export function guardarTokens({ access, refresh }) {
  escribir(CLAVE_ACCESS, access)
  escribir(CLAVE_REFRESH, refresh)
}

export function obtenerUsuarioGuardado() {
  const crudo = leer(CLAVE_USUARIO)
  if (!crudo) return null
  try {
    return JSON.parse(crudo)
  } catch {
    return null
  }
}

export function guardarUsuario(usuario) {
  escribir(CLAVE_USUARIO, JSON.stringify(usuario))
}

export function borrarSesion() {
  quitar(CLAVE_ACCESS)
  quitar(CLAVE_REFRESH)
  quitar(CLAVE_USUARIO)
}

// ---- Instancia de axios ----

export const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const access = obtenerAccess()
  if (access && !esRutaPublica(config.url)) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Promesa compartida: si varias peticiones reciben 401 a la vez,
// todas esperan el mismo refresh en lugar de lanzar uno cada una.
let refreshEnCurso = null

function refrescarTokens() {
  if (!refreshEnCurso) {
    // Se usa axios directamente para no pasar por estos interceptores.
    refreshEnCurso = axios
      .post(`${BASE_URL}/auth/refresh/`, { refresh: obtenerRefresh() })
      .then(({ data }) => {
        // El refresh rota: se guardan los dos tokens nuevos.
        guardarTokens(data)
        return data.access
      })
      .finally(() => {
        refreshEnCurso = null
      })
  }
  return refreshEnCurso
}

// Ruta a la que volver después de iniciar sesión otra vez (sessionStorage: solo esta pestaña).
function guardarRutaDeVuelta() {
  const { pathname, search, hash } = window.location
  if (pathname === '/login' || pathname === '/sesion-cerrada') return
  try {
    sessionStorage.setItem(CLAVE_VOLVER_A, `${pathname}${search}${hash}`)
  } catch {
    // Sin sessionStorage, el login vuelve al inicio
  }
}

// Lee y borra la ruta guardada. La usa la página de sesión cerrada.
export function tomarRutaDeVuelta() {
  try {
    const ruta = sessionStorage.getItem(CLAVE_VOLVER_A)
    sessionStorage.removeItem(CLAVE_VOLVER_A)
    return ruta
  } catch {
    return null
  }
}

function cerrarSesionExpirada() {
  guardarRutaDeVuelta()
  borrarSesion()
  window.location.replace('/sesion-cerrada')
}

function cerrarSesionSinPermiso() {
  borrarSesion()
  window.location.replace('/sin-permiso')
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config

    if (
      error.response?.status === 403 &&
      error.response.data?.detail === DETALLE_SOLO_ADMIN &&
      original &&
      !esRutaPublica(original.url)
    ) {
      cerrarSesionSinPermiso()
      return Promise.reject(error)
    }

    if (
      error.response?.status !== 401 ||
      !original ||
      original._reintentada ||
      esRutaPublica(original.url) ||
      !obtenerRefresh()
    ) {
      return Promise.reject(error)
    }

    original._reintentada = true

    let access
    try {
      access = await refrescarTokens()
    } catch (errorRefresh) {
      cerrarSesionExpirada()
      return Promise.reject(errorRefresh)
    }

    original.headers.Authorization = `Bearer ${access}`
    return api(original)
  },
)
