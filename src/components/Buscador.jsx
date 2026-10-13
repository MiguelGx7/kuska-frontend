import { Search, X } from 'lucide-react'
import './Buscador.css'

// Campo de búsqueda controlado. El debounce lo hace la página.
export default function Buscador({ valor, alCambiar, placeholder, etiqueta = 'Buscar', className }) {
  return (
    <div className={['buscador', className].filter(Boolean).join(' ')}>
      <Search className="buscador__icono" size={18} aria-hidden="true" />
      <input
        type="search"
        className="buscador__input"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder={placeholder}
        aria-label={etiqueta}
      />
      {valor && (
        <button
          type="button"
          className="buscador__limpiar"
          onClick={() => alCambiar('')}
          aria-label="Limpiar búsqueda"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
