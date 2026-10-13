import './Tarjeta.css'

// Contenedor con superficie, borde y radio de tarjeta.
// titulo y subtitulo arriba a la izquierda; accion (p. ej. un enlace) a la derecha.
export default function Tarjeta({ titulo, subtitulo, accion, children, className }) {
  const clases = ['tarjeta', className].filter(Boolean).join(' ')

  return (
    <section className={clases}>
      {(titulo || accion) && (
        <header className="tarjeta__cabecera">
          <div>
            {titulo && <h2 className="tarjeta__titulo">{titulo}</h2>}
            {subtitulo && <p className="tarjeta__subtitulo">{subtitulo}</p>}
          </div>
          {accion && <div className="tarjeta__accion">{accion}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
