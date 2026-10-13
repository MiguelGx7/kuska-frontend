import { useId } from 'react'

// Texto largo (motivo, respuesta, observación) con contador "n/255" y error debajo.
// Usa los estilos de Campo (.campo, .campo__control--area).
export default function CampoTexto({
  etiqueta,
  opcional = false,
  valor,
  alCambiar,
  placeholder,
  error,
  maximo = 255,
  filas = 4,
  ref,
}) {
  const id = useId()
  const idMensaje = `${id}-mensaje`

  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
        {opcional && <span className="campo__opcional"> (opcional)</span>}
      </label>
      <div className="campo__control campo__control--area">
        <textarea
          ref={ref}
          id={id}
          className="campo__input"
          value={valor}
          maxLength={maximo}
          rows={filas}
          placeholder={placeholder}
          onChange={(e) => alCambiar(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={idMensaje}
        />
      </div>
      <div className="campo__pie" id={idMensaje}>
        {error && <p className="campo__mensaje">{error}</p>}
        <span className="campo__contador">
          {valor.length}/{maximo}
        </span>
      </div>
    </div>
  )
}
