import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { guardarTema, obtenerTema } from '../tema'
import './BotonTema.css'

export default function BotonTema({ className }) {
  const [tema, setTema] = useState(obtenerTema)
  const oscuro = tema === 'dark'

  function cambiar() {
    const siguiente = oscuro ? 'light' : 'dark'
    guardarTema(siguiente)
    setTema(siguiente)
  }

  return (
    <button
      type="button"
      className={['boton-tema', className].filter(Boolean).join(' ')}
      onClick={cambiar}
      aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {oscuro ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
