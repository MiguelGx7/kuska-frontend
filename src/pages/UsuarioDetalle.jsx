import { useParams } from 'react-router-dom'

export default function UsuarioDetalle() {
  const { id } = useParams()
  return <h1>Detalle de usuario #{id}</h1>
}
