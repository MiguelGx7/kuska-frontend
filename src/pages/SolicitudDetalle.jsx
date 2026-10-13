import { useParams } from 'react-router-dom'

export default function SolicitudDetalle() {
  const { id } = useParams()
  return <h1>Detalle de solicitud #{id}</h1>
}
