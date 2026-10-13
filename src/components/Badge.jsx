import './Badge.css'

// variante: naranja | verde | rojo | gris
export default function Badge({ variante = 'gris', children, className }) {
  const clases = ['badge', `badge--${variante}`, className].filter(Boolean).join(' ')
  return <span className={clases}>{children}</span>
}
