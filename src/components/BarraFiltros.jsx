import Buscador from './Buscador'
import Selector from './Selector'
import './BarraFiltros.css'

// Barra de las listas sin pestañas: buscador + selects de filtro, en una fila.
// busqueda: { valor, alCambiar, placeholder, etiqueta }
// filtros: [{ clave, etiqueta, opciones, valor, alCambiar }] — la etiqueta queda para lectores de pantalla.
export default function BarraFiltros({ busqueda, filtros = [] }) {
  return (
    <div className="barra-filtros" style={{ '--barra-filtros-selects': filtros.length }}>
      <Buscador
        className="barra-filtros__buscador"
        valor={busqueda.valor}
        alCambiar={busqueda.alCambiar}
        placeholder={busqueda.placeholder}
        etiqueta={busqueda.etiqueta}
      />
      {filtros.map((f) => (
        <Selector
          key={f.clave}
          etiquetaOculta={f.etiqueta}
          opciones={f.opciones}
          valor={f.valor}
          alCambiar={f.alCambiar}
        />
      ))}
    </div>
  )
}
