// La misma clave se usa en el script de index.html.
const CLAVE = 'kumora.tema'

function temaDelSistema() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function obtenerTema() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'light' || guardado === 'dark') return guardado
  } catch {
    // localStorage no disponible: se usa la preferencia del sistema
  }
  return temaDelSistema()
}

export function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema)
}

export function guardarTema(tema) {
  try {
    localStorage.setItem(CLAVE, tema)
  } catch {
    // Sin persistencia: el tema se aplica solo en esta pestaña
  }
  aplicarTema(tema)
}
