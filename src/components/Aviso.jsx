import { CircleAlert, Info, TriangleAlert } from 'lucide-react'
import './Aviso.css'

const ICONOS = {
  info: Info,
  advertencia: TriangleAlert,
  error: CircleAlert,
}

// tipo: info | advertencia | error. accion: elemento opcional debajo del texto (p. ej. un botón).
// children puede ser texto o varios párrafos.
export default function Aviso({ tipo = 'info', titulo, children, accion, className }) {
  const Icono = ICONOS[tipo] ?? Info
  const clases = ['aviso', `aviso--${tipo}`, className].filter(Boolean).join(' ')

  return (
    <div className={clases} role={tipo === 'error' ? 'alert' : undefined}>
      <Icono className="aviso__icono" size={18} aria-hidden="true" />
      <div className="aviso__contenido">
        {titulo && <p className="aviso__titulo">{titulo}</p>}
        {children && <div className="aviso__texto">{children}</div>}
        {accion && <div className="aviso__accion">{accion}</div>}
      </div>
    </div>
  )
}
