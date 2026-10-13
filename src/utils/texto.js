// (1, 'día', 'días') → "1 día" · (3, 'día', 'días') → "3 días". El número sale con formato es-CO.
export function plural(n, uno, varios) {
  return `${new Intl.NumberFormat('es-CO').format(n)} ${n === 1 ? uno : varios}`
}

// Agrega el punto final a una frase, salvo que ya termine en uno
// (p. ej. las horas: "a las 6:00 p. m." no debe quedar "p. m..").
export function conPuntoFinal(texto) {
  return texto.endsWith('.') ? texto : `${texto}.`
}
