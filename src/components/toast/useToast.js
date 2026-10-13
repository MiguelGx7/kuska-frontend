import { useContext } from 'react'
import { ContextoToast } from './contextoToast'

// Devuelve mostrarToast(mensaje).
export function useToast() {
  const mostrarToast = useContext(ContextoToast)
  if (!mostrarToast) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>')
  }
  return mostrarToast
}
