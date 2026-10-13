// Agrega el punto final a una frase, salvo que ya termine en uno
// (p. ej. las horas: "a las 6:00 p. m." no debe quedar "p. m..").
export function conPuntoFinal(texto) {
  return texto.endsWith('.') ? texto : `${texto}.`
}
