import { formatearNumero } from '../utils/numeros'
import './Pestanas.css'

// opciones: [{ valor, nombre, contador? }].
// idBase (de useId en la página) arma los ids:
//   pestaña → `${idBase}-pestana-${valor}`   panel → `${idBase}-panel`
// El contenido va en <div role="tabpanel" id={`${idBase}-panel`}
//   aria-labelledby={`${idBase}-pestana-${valorActivo}`}>.
// Teclado: ← → (e Inicio / Fin) cambian de pestaña.
export default function Pestanas({ opciones, valor, alCambiar, etiqueta, idBase }) {
  function alTeclear(e) {
    const indice = opciones.findIndex((o) => o.valor === valor)
    const destinos = {
      ArrowRight: (indice + 1) % opciones.length,
      ArrowLeft: (indice - 1 + opciones.length) % opciones.length,
      Home: 0,
      End: opciones.length - 1,
    }
    const destino = destinos[e.key]
    if (destino === undefined) return
    e.preventDefault()
    alCambiar(opciones[destino].valor)
    e.currentTarget.querySelectorAll('[role="tab"]')[destino]?.focus()
  }

  return (
    <div className="pestanas" role="tablist" aria-label={etiqueta} onKeyDown={alTeclear}>
      {opciones.map((o) => {
        const activa = o.valor === valor
        return (
          <button
            key={o.valor}
            id={`${idBase}-pestana-${o.valor}`}
            type="button"
            role="tab"
            className="pestanas__pestana"
            aria-selected={activa}
            aria-controls={`${idBase}-panel`}
            tabIndex={activa ? 0 : -1}
            onClick={() => alCambiar(o.valor)}
          >
            {o.nombre}
            {o.contador != null && (
              <span className="pestanas__contador">{formatearNumero(o.contador)}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
