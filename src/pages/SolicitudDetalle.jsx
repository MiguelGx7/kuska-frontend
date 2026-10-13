import { useParams } from 'react-router-dom'
import EncabezadoPagina from '../layout/EncabezadoPagina'

export default function SolicitudDetalle() {
  const { id } = useParams()
  const titulo = `Solicitud #${id}`
  return <EncabezadoPagina migas={['Inicio', 'Solicitudes', titulo]} titulo={titulo} />
}
