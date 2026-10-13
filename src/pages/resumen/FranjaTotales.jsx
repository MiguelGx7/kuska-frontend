import Esqueleto from '../../components/Esqueleto'
import Tarjeta from '../../components/Tarjeta'
import { formatearNumero } from '../../utils/numeros'
import ErrorSeccion from './ErrorSeccion'

function totales(datos) {
  // El último elemento de por_mes es el mes actual.
  const mes = datos.por_mes?.at(-1) ?? {}
  const alimentosEntregados = (datos.por_categoria ?? []).reduce(
    (suma, c) => suma + c.alimentos_entregados,
    0,
  )

  return [
    { etiqueta: 'Donaciones recibidas', valor: datos.donaciones_recibidas, delMes: mes.donaciones },
    { etiqueta: 'Solicitudes entregadas', valor: datos.solicitudes_entregadas, delMes: mes.entregas },
    { etiqueta: 'Alimentos entregados', valor: alimentosEntregados, delMes: mes.alimentos_entregados },
    { etiqueta: 'Personas beneficiadas', valor: datos.personas_beneficiadas },
  ]
}

export default function FranjaTotales({ carga }) {
  const { estado, datos } = carga

  return (
    <Tarjeta className="totales">
      <h2 className="visualmente-oculto">Totales</h2>

      {estado === 'error' && <ErrorSeccion carga={carga} />}

      {estado === 'cargando' && (
        <div className="totales__grilla" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="totales__item">
              <Esqueleto alto={14} ancho="60%" />
              <Esqueleto alto={34} ancho="45%" />
              <Esqueleto alto={14} ancho="50%" />
            </div>
          ))}
        </div>
      )}

      {estado === 'listo' && (
        <dl className="totales__grilla">
          {totales(datos).map(({ etiqueta, valor, delMes }) => (
            <div key={etiqueta} className="totales__item">
              <dt className="totales__etiqueta">{etiqueta}</dt>
              <dd className="totales__cifra">{formatearNumero(valor)}</dd>
              {delMes !== undefined && (
                <dd className={`totales__mes ${delMes > 0 ? 'totales__mes--sube' : ''}`}>
                  +{formatearNumero(delMes)} este mes
                </dd>
              )}
            </div>
          ))}
        </dl>
      )}
    </Tarjeta>
  )
}
