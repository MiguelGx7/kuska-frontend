const formato = new Intl.NumberFormat('es-CO')

// 1234 → "1.234"
export function formatearNumero(n) {
  return formato.format(n ?? 0)
}
