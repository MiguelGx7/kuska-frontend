import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import './Modal.css'

// Diálogo modal (Radix): bloquea el fondo, atrapa el foco y se cierra con Esc.
// pie: botones de abajo. variante="imagen": para ver una foto en grande
// (el título queda solo para lectores de pantalla).
export default function Modal({
  abierto,
  alCambiar,
  titulo,
  descripcion,
  pie,
  variante = 'normal',
  children,
}) {
  const esImagen = variante === 'imagen'

  return (
    <Dialog.Root open={abierto} onOpenChange={alCambiar}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal__fondo" />
        <Dialog.Content
          className={`modal ${esImagen ? 'modal--imagen' : ''}`}
          // Sin descripción, Radix pide decirlo explícitamente.
          {...(descripcion ? {} : { 'aria-describedby': undefined })}
        >
          <div className="modal__cabecera">
            <Dialog.Title className={esImagen ? 'visualmente-oculto' : 'modal__titulo'}>
              {titulo}
            </Dialog.Title>
            <Dialog.Close className="modal__cerrar" aria-label="Cerrar">
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          {descripcion && (
            <Dialog.Description className="modal__descripcion">{descripcion}</Dialog.Description>
          )}

          <div className="modal__cuerpo">{children}</div>

          {pie && <div className="modal__pie">{pie}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
