import Boton from './Boton'
import BotonTema from './BotonTema'
import HormigaError from './HormigaError'
import './PaginaError.css'

// Página de error a pantalla completa (sin barra lateral).
// variante: "404" | "403" | "401" | "500" | "red" (ilustración de HormigaError).
// acciones: [{ texto, variante, to?, onClick? }] → el secundario va primero (izquierda).
// sinFranja: dentro del layout del panel no se repite el logo ni el botón de tema.
export default function PaginaError({
  variante,
  codigo,
  titulo,
  texto,
  acciones = [],
  nota,
  sinFranja = false,
}) {
  // Fuera del layout esta es la región principal; dentro, el layout ya tiene su <main>.
  const Contenedor = sinFranja ? 'div' : 'main'

  return (
    <div className={`pagina-error ${sinFranja ? 'pagina-error--en-layout' : ''}`}>
      {!sinFranja && (
        <header className="pagina-error__franja">
          <div className="pagina-error__logo">
            <img src="/favicon.svg" alt="" width="30" height="30" />
            <span>Kumora</span>
          </div>
          <BotonTema />
        </header>
      )}

      <Contenedor className="pagina-error__contenido">
        <HormigaError variante={variante} ancho={240} />
        <p className={`pagina-error__codigo ${variante === '500' ? 'pagina-error__codigo--rojo' : ''}`}>
          {codigo}
        </p>
        <h1 className="pagina-error__titulo">{titulo}</h1>
        <p className="pagina-error__texto">{texto}</p>

        {acciones.length > 0 && (
          <div className="pagina-error__botones">
            {acciones.map((accion) => (
              <Boton
                key={accion.texto}
                variante={accion.variante ?? 'principal'}
                to={accion.to}
                onClick={accion.onClick}
              >
                {accion.texto}
              </Boton>
            ))}
          </div>
        )}

        {nota && (
          <p className="pagina-error__nota" role="status">
            {nota}
          </p>
        )}
      </Contenedor>
    </div>
  )
}
