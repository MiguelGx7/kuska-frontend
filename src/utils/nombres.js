// "Ana Lucía Torres" → "AL"
export function inicialesDe(nombre) {
  const letras = (nombre ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
  return letras.toUpperCase() || '?'
}
