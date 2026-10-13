import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import BarraLateral from './BarraLateral'
import CargandoPagina from './CargandoPagina'
import { ContadoresProvider } from './ContadoresProvider'
import './LayoutAdmin.css'

export default function LayoutAdmin() {
  return (
    <ContadoresProvider>
      <RadixTooltip.Provider delayDuration={200}>
        <div className="layout">
          <BarraLateral />
          <main className="layout__principal">
            <div className="layout__contenido">
              {/* Solo el contenido espera la descarga de la página; la barra lateral queda fija. */}
              <Suspense fallback={<CargandoPagina />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </RadixTooltip.Provider>
    </ContadoresProvider>
  )
}
