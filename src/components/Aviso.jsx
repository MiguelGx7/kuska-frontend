import { CircleAlert, Info } from 'lucide-react'
import './Aviso.css'

const ICONOS = {
  info: Info,
  error: CircleAlert,
}

// tipo: info | error
export default function Aviso({ tipo = 'info', titulo, children, className }) {
  const Icono = ICONOS[tipo] ?? Info
  const clases = ['aviso', `aviso--${tipo}`, className].filter(Boolean).join(' ')

  return (
    <div className={clases} role={tipo === 'error' ? 'alert' : undefined}>
      <Icono className="aviso__icono" size={18} aria-hidden="true" />
      <div className="aviso__contenido">
        {titulo && <p className="aviso__titulo">{titulo}</p>}
        {children && <p className="aviso__texto">{children}</p>}
      </div>
    </div>
  )
}
