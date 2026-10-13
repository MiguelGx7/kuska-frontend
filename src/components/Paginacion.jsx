import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatearNumero } from '../utils/numeros'
import Boton from './Boton'
import './Paginacion.css'

// "Mostrando 11–20 de 23" con Anterior / Siguiente.
// La API no informa el tamaño de página, así que el inicio se calcula con lo que llegó:
// en una página con siguiente, (página − 1) × resultados + 1; en la última, total − resultados + 1.
export default function Paginacion({ pagina, total, cantidad, hayAnterior, haySiguiente, alCambiar }) {
  if (!total || !cantidad) return null

  const inicio = haySiguiente ? (pagina - 1) * cantidad + 1 : total - cantidad + 1
  const fin = inicio + cantidad - 1

  return (
    <nav className="paginacion" aria-label="Paginación">
      <p className="paginacion__texto">
        Mostrando {formatearNumero(inicio)}–{formatearNumero(fin)} de {formatearNumero(total)}
      </p>
      {(hayAnterior || haySiguiente) && (
        <div className="paginacion__botones">
          <Boton
            variante="secundario"
            tamano="pequeno"
            icono={ChevronLeft}
            disabled={!hayAnterior}
            onClick={() => alCambiar(pagina - 1)}
          >
            Anterior
          </Boton>
          <Boton
            variante="secundario"
            tamano="pequeno"
            disabled={!haySiguiente}
            onClick={() => alCambiar(pagina + 1)}
          >
            Siguiente
            <ChevronRight className="paginacion__flecha" size={16} aria-hidden="true" />
          </Boton>
        </div>
      )}
    </nav>
  )
}
