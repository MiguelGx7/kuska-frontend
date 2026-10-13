import { useId } from 'react'
import './OpcionesTarjeta.css'

// Grupo de opciones excluyentes con forma de tarjeta.
// Usa <input type="radio"> nativos: el rol, las flechas y el foco funcionan solos.
// opciones: [{ valor, titulo, texto, etiqueta? }] — etiqueta: p. ej. un Badge "Sugerida".
export default function OpcionesTarjeta({ etiqueta, opciones, valor, alCambiar }) {
  const nombre = useId()

  return (
    <fieldset className="opciones-tarjeta">
      <legend className="campo__etiqueta">{etiqueta}</legend>
      {opciones.map((o) => (
        <label
          key={o.valor}
          className={`opcion-tarjeta ${o.valor === valor ? 'opcion-tarjeta--elegida' : ''}`}
        >
          <input
            type="radio"
            name={nombre}
            value={o.valor}
            checked={o.valor === valor}
            onChange={() => alCambiar(o.valor)}
            className="opcion-tarjeta__radio"
          />
          <span className="opcion-tarjeta__textos">
            <span className="opcion-tarjeta__titulo">
              {o.titulo}
              {o.etiqueta}
            </span>
            <span className="opcion-tarjeta__texto">{o.texto}</span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
