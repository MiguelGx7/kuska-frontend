import * as RadixTooltip from '@radix-ui/react-tooltip'
import './Tooltip.css'

// Envuelve un elemento enfocable. Con `desactivado` devuelve el hijo tal cual.
// Requiere un <RadixTooltip.Provider> arriba (lo pone LayoutAdmin).
export default function Tooltip({ texto, lado = 'top', desactivado = false, children }) {
  if (desactivado) return children

  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content className="tooltip" side={lado} sideOffset={8}>
          {texto}
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
