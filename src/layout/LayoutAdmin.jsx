import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import LimiteError from '../components/LimiteError'
import BarraLateral from './BarraLateral'
import CargandoPagina from './CargandoPagina'
import { ContadoresProvider } from './ContadoresProvider'
import './LayoutAdmin.css'

export default function LayoutAdmin() {
  const { pathname } = useLocation()

  return (
    <ContadoresProvider>
      <RadixTooltip.Provider delayDuration={200}>
        <div className="layout">
          <BarraLateral />
          <main className="layout__principal">
            <div className="layout__contenido">
              {/* Solo el contenido espera la descarga de la página; la barra lateral queda fija.
                  Si una página falla al renderizar se ve la 500 aquí, con la barra disponible;
                  la key la limpia al ir a otra sección. */}
              <LimiteError key={pathname} sinFranja>
                <Suspense fallback={<CargandoPagina />}>
                  <Outlet />
                </Suspense>
              </LimiteError>
            </div>
          </main>
        </div>
      </RadixTooltip.Provider>
    </ContadoresProvider>
  )
}
