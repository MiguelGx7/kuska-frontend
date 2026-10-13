import Esqueleto from '../components/Esqueleto'
import './CargandoPagina.css'

// Se muestra mientras se descarga el código de una página (React.lazy).
// Imita el encabezado de página y un par de bloques de contenido.
export default function CargandoPagina() {
  return (
    <div className="cargando-pagina" aria-busy="true">
      <p className="visualmente-oculto" role="status">
        Cargando…
      </p>
      <div className="cargando-pagina__encabezado">
        <Esqueleto alto={14} ancho={140} />
        <Esqueleto alto={32} ancho={240} />
      </div>
      <Esqueleto alto={96} radio="var(--r-card)" />
      <Esqueleto alto={280} radio="var(--r-card)" />
    </div>
  )
}
