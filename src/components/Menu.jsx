import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import './Menu.css'

// Menú desplegable (Radix): teclado, foco y cierre con Esc incluidos.
// disparador: un botón (se usa con asChild, así que debe aceptar ref y props).
export function Menu({ disparador, alinear = 'end', children }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{disparador}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu" align={alinear} sideOffset={6}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

// Opción del menú. Con asChild el hijo (p. ej. un <Link>) es la opción.
// peligro: texto en rojo, para acciones destructivas.
export function MenuOpcion({ alElegir, peligro = false, asChild = false, children }) {
  return (
    <DropdownMenu.Item
      asChild={asChild}
      className={`menu__opcion ${peligro ? 'menu__opcion--peligro' : ''}`}
      onSelect={alElegir}
    >
      {children}
    </DropdownMenu.Item>
  )
}

export function MenuSeparador() {
  return <DropdownMenu.Separator className="menu__separador" />
}
