import { useContext } from 'react'
import { SesionContext } from './contexto'

export function useSesion() {
  const sesion = useContext(SesionContext)
  if (!sesion) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return sesion
}
