import Buscador from './Buscador'
import Selector from './Selector'
import './BarraFiltros.css'

// Barra de las listas sin pestañas: buscador + selects de filtro, en una fila.
// busqueda: { valor, alCambiar, placeholder, etiqueta }
// filtros: [{ clave, etiqueta, opciones, valor, alCambiar }] — la etiqueta queda para lectores de pantalla.
// inicio: elemento opcional antes del buscador (p. ej. un Segmentado).
export default function BarraFiltros({ busqueda, filtros = [], inicio }) {
  // Columnas según lo que haya (repeat(0, …) no es CSS válido, por eso se arma aquí).
  const columnas = [
    inicio ? 'max-content' : null,
    'minmax(220px, 400px)',
    ...filtros.map(() => '210px'),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="barra-filtros" style={{ '--barra-filtros-columnas': columnas }}>
      {inicio}
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
