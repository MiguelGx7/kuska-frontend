import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Link } from 'react-router-dom'
import { ChevronDown, Shield } from 'lucide-react'
import Boton from '../../components/Boton'

// La sanción se hace en Usuarios con este pedido como referencia.
export default function MenuSancionar({ solicitud }) {
  const ruta = (persona) => `/usuarios/${persona.id}?sancionar=1&solicitud=${solicitud.id}`

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Boton variante="secundario" icono={Shield}>
          <span className="menu__disparador">
            Sancionar
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </Boton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu" align="end" sideOffset={6}>
          {solicitud.beneficiario?.id != null && (
            <DropdownMenu.Item asChild className="menu__opcion">
              <Link to={ruta(solicitud.beneficiario)}>Al beneficiario</Link>
            </DropdownMenu.Item>
          )}
          {solicitud.donante?.id != null && (
            <DropdownMenu.Item asChild className="menu__opcion">
              <Link to={ruta(solicitud.donante)}>Al donante</Link>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
