import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import './Selector.css'

// <select> nativo con el estilo de los campos.
// opciones: [{ valor, texto }]. Sin etiqueta visible, pasar etiquetaOculta (para lectores de pantalla).
export default function Selector({
  etiqueta,
  etiquetaOculta,
  opciones,
  valor,
  alCambiar,
  className,
  ...resto
}) {
  const id = useId()

  return (
    <div className={['selector', className].filter(Boolean).join(' ')}>
      {etiqueta && (
        <label className="campo__etiqueta" htmlFor={id}>
          {etiqueta}
        </label>
      )}
      <div className="selector__control">
        <select
          id={id}
          className="selector__select"
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          aria-label={etiqueta ? undefined : etiquetaOculta}
          {...resto}
        >
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
        <ChevronDown className="selector__flecha" size={16} aria-hidden="true" />
      </div>
    </div>
  )
}
