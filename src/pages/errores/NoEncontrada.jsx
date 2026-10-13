import { useLocation, useNavigate } from 'react-router-dom'
import PaginaError from '../../components/PaginaError'

export default function NoEncontrada() {
  const navigate = useNavigate()
  const location = useLocation()

  // Si se abrió directo (sin historial dentro de la app), "Volver" lleva al inicio.
  function volver() {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  return (
    <PaginaError
      variante="404"
      codigo="ERROR 404"
      titulo="No encontramos esta página"
      texto="Puede que el enlace esté mal escrito o que la página ya no exista."
      acciones={[
        { texto: 'Volver', variante: 'secundario', onClick: volver },
        { texto: 'Ir al inicio', variante: 'principal', to: '/' },
      ]}
    />
  )
}
