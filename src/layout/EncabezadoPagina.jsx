import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'
import BotonTema from '../components/BotonTema'
import { useContadores } from './useContadores'
import './EncabezadoPagina.css'

// migas: lista de textos, p. ej. ["Inicio", "Donaciones"]. children: acciones a la derecha.
// etiqueta: elemento junto al título, fuera del <h1> (p. ej. el Badge de estado).
export default function EncabezadoPagina({ migas = [], titulo, etiqueta, subtitulo, children }) {
  // Viene de ContadoresProvider: se recarga en cada cambio de ruta y se actualiza al marcar
  // notificaciones como leídas. Si falla, queda null y no hay punto.
  const { contadores } = useContadores()
  const hayNoLeidas = contadores.noLeidas > 0

  return (
    <header className="encabezado">
      <div className="encabezado__superior">
        <nav aria-label="Ruta">
          <ol className="encabezado__migas">
            {migas.map((miga, i) => {
              const ultima = i === migas.length - 1
              return (
                <Fragment key={`${miga}-${i}`}>
                  {i > 0 && (
                    <li className="encabezado__separador" aria-hidden="true">
                      <ChevronRight size={14} />
                    </li>
                  )}
                  <li
                    className={ultima ? 'encabezado__miga encabezado__miga--actual' : 'encabezado__miga'}
                    aria-current={ultima ? 'page' : undefined}
                  >
                    {miga}
                  </li>
                </Fragment>
              )
            })}
          </ol>
        </nav>

        <div className="encabezado__herramientas">
          <Link
            to="/notificaciones"
            className="encabezado__campana"
            aria-label={hayNoLeidas ? 'Notificaciones, tienes sin leer' : 'Notificaciones'}
          >
            <Bell size={18} aria-hidden="true" />
            {hayNoLeidas && <span className="encabezado__punto" />}
          </Link>
          <BotonTema />
        </div>
      </div>

      <div className="encabezado__principal">
        <div className="encabezado__textos">
          <div className="encabezado__titulo-fila">
            <h1 className="encabezado__titulo">{titulo}</h1>
            {etiqueta}
          </div>
          {subtitulo && <p className="encabezado__subtitulo">{subtitulo}</p>}
        </div>
        {children && <div className="encabezado__acciones">{children}</div>}
      </div>
    </header>
  )
}
