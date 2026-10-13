import { useId } from 'react'
import { leerValor } from './ajustes'

// Una fila: etiqueta y ayuda a la izquierda; campo, ejemplo en vivo y "Antes" a la derecha.
export default function FilaAjuste({ ajuste, texto, guardado, error, cambiado, alCambiar }) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idNota = `${id}-nota`

  // El ejemplo sigue lo que se escribe; si el texto no es válido, no se muestra.
  const lectura = leerValor(ajuste, texto)
  const ejemplo = lectura.error ? null : ajuste.ejemplo(lectura.valor)

  return (
    <div className="configuracion-fila">
      <div className="configuracion-fila__textos">
        <label className="configuracion-fila__etiqueta" htmlFor={id}>
          {ajuste.etiqueta}
        </label>
        <p className="configuracion-fila__ayuda" id={idAyuda}>
          {ajuste.ayuda}
        </p>
      </div>

      <div className="configuracion-fila__control">
        <div className={`configuracion-campo ${error ? 'configuracion-campo--error' : ''}`}>
          <input
            id={id}
            className="configuracion-campo__input"
            type="text"
            inputMode={ajuste.tipo === 'porcentaje' ? 'decimal' : 'numeric'}
            value={texto}
            onChange={(e) => alCambiar(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${idAyuda} ${idNota}`}
          />
          {ajuste.sufijo && (
            <span className="configuracion-campo__sufijo" aria-hidden="true">
              {ajuste.sufijo}
            </span>
          )}
        </div>

        <div id={idNota} className="configuracion-fila__notas" aria-live="polite">
          {error ? (
            <p className="configuracion-fila__error">{error}</p>
          ) : (
            ejemplo && <p className="configuracion-fila__ejemplo">{ejemplo}</p>
          )}
          {cambiado && guardado != null && (
            <p className="configuracion-fila__antes">Antes: {ajuste.antes(Number(guardado))}</p>
          )}
        </div>
      </div>
    </div>
  )
}
