import './Caja.css'

// Caja de información con título (p. ej. un motivo de rechazo).
// tono: rojo | verde | gris | azul | suave (--muted)
export default function Caja({ tono = 'gris', titulo, children }) {
  return (
    <div className={`caja caja--${tono}`}>
      {titulo && <p className="caja__titulo">{titulo}</p>}
      <div className="caja__texto">{children}</div>
    </div>
  )
}
