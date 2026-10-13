import './Segmentado.css'

// Selector segmentado: botones con aria-pressed dentro de un grupo.
// opciones: [{ valor, texto }]. etiqueta: nombre del grupo para lectores de pantalla.
export default function Segmentado({ opciones, valor, alCambiar, etiqueta }) {
  return (
    <div className="segmentado" role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          className="segmentado__opcion"
          aria-pressed={o.valor === valor}
          onClick={() => alCambiar(o.valor)}
        >
          {o.texto}
        </button>
      ))}
    </div>
  )
}
