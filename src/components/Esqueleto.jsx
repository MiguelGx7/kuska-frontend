import './Esqueleto.css'

// Bloque gris de carga. Decorativo: el contenedor debe llevar aria-busy.
export default function Esqueleto({ alto = 16, ancho = '100%', radio, className }) {
  return (
    <span
      className={['esqueleto', className].filter(Boolean).join(' ')}
      style={{ height: alto, width: ancho, borderRadius: radio }}
      aria-hidden="true"
    />
  )
}
