import { useContext } from 'react'
import { ContextoContadores } from './contextoContadores'

// { contadores: { donaciones, solicitudes, novedades, noLeidas }, recargarContadores, fijarNoLeidas }
export function useContadores() {
  const valor = useContext(ContextoContadores)
  if (!valor) {
    throw new Error('useContadores debe usarse dentro de <ContadoresProvider>')
  }
  return valor
}
