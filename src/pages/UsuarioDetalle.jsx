import { useParams } from 'react-router-dom'
import EncabezadoPagina from '../layout/EncabezadoPagina'

export default function UsuarioDetalle() {
  const { id } = useParams()
  const titulo = `Usuario #${id}`
  return <EncabezadoPagina migas={['Inicio', 'Usuarios', titulo]} titulo={titulo} />
}
