const formato = new Intl.NumberFormat('es-CO')
const formatoCantidad = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })

// 1234 → "1.234"
export function formatearNumero(n) {
  return formato.format(n ?? 0)
}

const PLURALES = {
  unidad: ['unidad', 'unidades'],
  paquete: ['paquete', 'paquetes'],
}

// ("0.90", "kg") → "0,9 kg" · ("2.00", "unidad") → "2 unidades" · ("1", "paquete") → "1 paquete"
// kg, g, L y ml son símbolos: no llevan plural.
export function formatearCantidad(cantidad, unidad) {
  const n = Number(cantidad)
  const texto = formatoCantidad.format(Number.isNaN(n) ? 0 : n)
  const plural = PLURALES[unidad]
  if (plural) return `${texto} ${n === 1 ? plural[0] : plural[1]}`
  return unidad ? `${texto} ${unidad}` : texto
}
