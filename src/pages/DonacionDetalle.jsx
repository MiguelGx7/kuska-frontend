import { useParams } from 'react-router-dom'

export default function DonacionDetalle() {
  const { id } = useParams()
  return <h1>Detalle de donación #{id}</h1>
}
