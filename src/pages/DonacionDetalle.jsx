import { useParams } from 'react-router-dom'
import EncabezadoPagina from '../layout/EncabezadoPagina'

export default function DonacionDetalle() {
  const { id } = useParams()
  const titulo = `Donación #${id}`
  return <EncabezadoPagina migas={['Inicio', 'Donaciones', titulo]} titulo={titulo} />
}
