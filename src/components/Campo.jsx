import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './Campo.css'

// Input con etiqueta arriba, ícono opcional y mensaje de ayuda o error debajo.
// Con type="password" agrega el botón para mostrar u ocultar la contraseña.
export default function Campo({
  etiqueta,
  icono: Icono,
  ayuda,
  error,
  type = 'text',
  id,
  className,
  ref,
  ...resto
}) {
  const idGenerado = useId()
  const idInput = id ?? idGenerado
  const idMensaje = `${idInput}-mensaje`
  const [visible, setVisible] = useState(false)

  const esContrasena = type === 'password'
  const mensaje = error || ayuda

  const clases = ['campo', error && 'campo--error', className].filter(Boolean).join(' ')

  return (
    <div className={clases}>
      {etiqueta && (
        <label className="campo__etiqueta" htmlFor={idInput}>
          {etiqueta}
        </label>
      )}

      <div className="campo__control">
        {Icono && <Icono className="campo__icono" size={18} aria-hidden="true" />}
        <input
          ref={ref}
          id={idInput}
          className="campo__input"
          type={esContrasena && visible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={mensaje ? idMensaje : undefined}
          {...resto}
        />
        {esContrasena && (
          <button
            type="button"
            className="campo__ojo"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>

      {mensaje && (
        <p id={idMensaje} className="campo__mensaje">
          {mensaje}
        </p>
      )}
    </div>
  )
}
