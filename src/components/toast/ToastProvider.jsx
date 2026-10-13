import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { ContextoToast } from './contextoToast'
import './Toast.css'

const DURACION_MS = 4000

// Mensaje breve abajo al centro. Uno a la vez: uno nuevo reemplaza al anterior.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const temporizador = useRef(null)

  const mostrarToast = useCallback((mensaje) => {
    clearTimeout(temporizador.current)
    setToast({ id: Date.now(), mensaje })
    temporizador.current = setTimeout(() => setToast(null), DURACION_MS)
  }, [])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  return (
    <ContextoToast.Provider value={mostrarToast}>
      {children}
      {/* La región existe siempre para que los lectores de pantalla anuncien cada mensaje. */}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className="toast">
            <CircleCheck className="toast__icono" size={18} aria-hidden="true" />
            <span>{toast.mensaje}</span>
          </div>
        )}
      </div>
    </ContextoToast.Provider>
  )
}
