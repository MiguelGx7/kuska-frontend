import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const CLAVE_ACCESS = 'kumora.access'
const CLAVE_REFRESH = 'kumora.refresh'
const CLAVE_USUARIO = 'kumora.usuario'

// Rutas en las que un 401 no debe disparar el refresh.
const RUTAS_SIN_REFRESH = ['auth/login/', 'auth/refresh/']

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
  if (access) {
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

function cerrarSesionExpirada() {
  borrarSesion()
  window.location.replace('/sesion-cerrada')
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config
    const esRutaSinRefresh = RUTAS_SIN_REFRESH.some((ruta) => original?.url?.includes(ruta))

    if (
      error.response?.status !== 401 ||
      !original ||
      original._reintentada ||
      esRutaSinRefresh ||
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
