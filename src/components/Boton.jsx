import { Link } from 'react-router-dom'
import './Boton.css'

// variante: principal | secundario | enlace | peligro-suave | peligro
// tamano: pequeno (34px) | normal (38px) | grande (40px)
// Con `to` se renderiza como <Link> del router; con `href`, como <a> (tel:, mailto:, externos).
export default function Boton({
  variante = 'principal',
  tamano = 'normal',
  cargando = false,
  icono: Icono,
  to,
  href,
  type = 'button',
  disabled,
  className,
  children,
  ...resto
}) {
  const clases = [
    'boton',
    `boton--${variante}`,
    tamano === 'grande' && 'boton--grande',
    tamano === 'pequeno' && 'boton--pequeno',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const contenido = (
    <>
      {Icono && <Icono className="boton__icono" size={18} aria-hidden="true" />}
      {children && (
        <span>
          {children}
          {cargando && '…'}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={clases} {...resto}>
        {contenido}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {contenido}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {contenido}
    </button>
  )
}
