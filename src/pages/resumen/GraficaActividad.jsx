import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as TooltipGrafica,
  XAxis,
  YAxis,
} from 'recharts'
import Esqueleto from '../../components/Esqueleto'
import Segmentado from '../../components/Segmentado'
import Tarjeta from '../../components/Tarjeta'
import { mesCorto, mesLargo } from '../../utils/fechas'
import { formatearNumero } from '../../utils/numeros'
import ErrorSeccion from './ErrorSeccion'

// Los colores son variables CSS: cambian solos con el tema.
const VISTAS = [
  {
    clave: 'alimentos',
    nombre: 'Alimentos',
    series: [
      { clave: 'alimentos_donados', nombre: 'Alimentos donados', color: 'var(--serie-1)' },
      { clave: 'alimentos_entregados', nombre: 'Alimentos entregados', color: 'var(--primary)' },
    ],
  },
  {
    clave: 'solicitudes',
    nombre: 'Solicitudes',
    series: [
      { clave: 'solicitudes', nombre: 'Solicitudes enviadas', color: 'var(--serie-1)' },
      { clave: 'entregas', nombre: 'Solicitudes entregadas', color: 'var(--primary)' },
    ],
  },
]

const ESTILO_EJE = { fill: 'var(--text-3)', fontSize: 12 }

function ContenidoTooltip({ active, payload, label, series }) {
  if (!active || !payload?.length) return null

  return (
    <div className="grafica__tooltip">
      <p className="grafica__tooltip-mes">{mesLargo(label)}</p>
      {series.map(({ clave, nombre, color }) => (
        <p key={clave} className="grafica__tooltip-fila">
          <span className="grafica__rayita" style={{ background: color }} />
          <span>{nombre}</span>
          <strong>{formatearNumero(payload.find((p) => p.dataKey === clave)?.value)}</strong>
        </p>
      ))}
    </div>
  )
}

export default function GraficaActividad({ carga }) {
  const { estado, datos } = carga
  const [claveVista, setClaveVista] = useState('alimentos')
  const vista = VISTAS.find((v) => v.clave === claveVista)

  const selector = (
    <Segmentado
      etiqueta="Qué mostrar"
      opciones={VISTAS.map(({ clave, nombre }) => ({ valor: clave, texto: nombre }))}
      valor={claveVista}
      alCambiar={setClaveVista}
    />
  )

  return (
    <Tarjeta
      className="grafica"
      titulo="Actividad por mes"
      subtitulo="Últimos 12 meses"
      accion={selector}
    >
      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div aria-busy="true">
          <Esqueleto alto={16} ancho="55%" />
          <Esqueleto alto={240} className="grafica__esqueleto" />
        </div>
      )}

      {estado === 'listo' && (
        <>
          <ul className="leyenda">
            {vista.series.map(({ clave, nombre, color }) => (
              <li key={clave}>
                <span className="grafica__rayita" style={{ background: color }} />
                {nombre}
              </li>
            ))}
          </ul>

          <div className="grafica__lienzo">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={datos.por_mes} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="mes"
                  tickFormatter={mesCorto}
                  tick={ESTILO_EJE}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={ESTILO_EJE}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={44}
                  tickFormatter={formatearNumero}
                />
                <TooltipGrafica
                  content={<ContenidoTooltip series={vista.series} />}
                  cursor={{ stroke: 'var(--border-strong)' }}
                />
                {vista.series.map(({ clave, nombre, color }) => (
                  <Line
                    key={clave}
                    type="monotone"
                    dataKey={clave}
                    name={nombre}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Tarjeta>
  )
}
