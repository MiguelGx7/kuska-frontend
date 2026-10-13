import { Link } from 'react-router-dom'
import { ChevronDown, Shield } from 'lucide-react'
import Boton from '../../components/Boton'
import { Menu, MenuOpcion } from '../../components/Menu'

// La sanción se hace en Usuarios con este pedido como referencia.
export default function MenuSancionar({ solicitud }) {
  const ruta = (persona) => `/usuarios/${persona.id}?sancionar=1&solicitud=${solicitud.id}`

  return (
    <Menu
      disparador={
        <Boton variante="secundario" icono={Shield}>
          <span className="menu__disparador">
            Sancionar
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </Boton>
      }
    >
      {solicitud.beneficiario?.id != null && (
        <MenuOpcion asChild>
          <Link to={ruta(solicitud.beneficiario)}>Al beneficiario</Link>
        </MenuOpcion>
      )}
      {solicitud.donante?.id != null && (
        <MenuOpcion asChild>
          <Link to={ruta(solicitud.donante)}>Al donante</Link>
        </MenuOpcion>
      )}
    </Menu>
  )
}
