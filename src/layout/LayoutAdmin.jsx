import { Outlet } from 'react-router-dom'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import BarraLateral from './BarraLateral'
import './LayoutAdmin.css'

export default function LayoutAdmin() {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      <div className="layout">
        <BarraLateral />
        <main className="layout__principal">
          <div className="layout__contenido">
            <Outlet />
          </div>
        </main>
      </div>
    </RadixTooltip.Provider>
  )
}
