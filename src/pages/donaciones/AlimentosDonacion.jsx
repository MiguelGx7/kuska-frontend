import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import Tarjeta from '../../components/Tarjeta'
import { fechaDiaCorta } from '../../utils/fechas'
import { formatearCantidad } from '../../utils/numeros'
import { textoDias } from './donacion'

// Estados en los que ya se calcularon disponible y tope por solicitud.
const YA_VALIDADA = ['Validada', 'Agotada', 'Finalizada']

export default function AlimentosDonacion({ donacion, fueraDeMargen, margen }) {
  const [fotoAbierta, setFotoAbierta] = useState(null)
  const validada = YA_VALIDADA.includes(donacion.estado)
  const idsFuera = new Set(fueraDeMargen.map((a) => a.id))

  return (
    <Tarjeta
      className="alimentos"
      titulo="Alimentos"
      subtitulo="Revisa que cada foto muestre comida en buen estado."
    >
      <ul className="alimentos__grilla">
        {donacion.alimentos.map((a) => {
          const retirado = a.activo === false
          const fuera = idsFuera.has(a.id)
          const clases = [
            'alimento',
            retirado && 'alimento--retirado',
            fuera && 'alimento--fuera',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={a.id} className={clases}>
              {a.foto_url ? (
                <button
                  type="button"
                  className="alimento__foto"
                  onClick={() => setFotoAbierta(a)}
                  aria-label={`Ver foto de ${a.nombre} en grande`}
                >
                  <img src={a.foto_url} alt="" loading="lazy" />
                </button>
              ) : (
                <div className="alimento__foto alimento__foto--vacia">
                  <ImageOff size={24} aria-hidden="true" />
                  <span>Sin foto</span>
                </div>
              )}

              <div className="alimento__cuerpo">
                <div className="alimento__cabecera">
                  <div>
                    <p className="alimento__nombre">{a.nombre}</p>
                    <p className="alimento__categoria">{a.categoria_nombre}</p>
                  </div>
                  {retirado && <Badge variante="gris">Retirado</Badge>}
                </div>

                <dl className="alimento__datos">
                  <div>
                    <dt>Cantidad</dt>
                    <dd>{formatearCantidad(a.cantidad_total, a.unidad_medida)}</dd>
                  </div>
                  <div>
                    <dt>Vence</dt>
                    <dd>{fechaDiaCorta(a.fecha_vencimiento)}</dd>
                  </div>
                  {validada && (
                    <>
                      <div>
                        <dt>Disponible</dt>
                        <dd>{formatearCantidad(a.cantidad_disponible, a.unidad_medida)}</dd>
                      </div>
                      <div>
                        <dt>Tope por solicitud</dt>
                        <dd>
                          {a.max_por_solicitud != null
                            ? formatearCantidad(a.max_por_solicitud, a.unidad_medida)
                            : '—'}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>

                {fuera && (
                  <p className="alimento__alerta">Vence antes del margen de {textoDias(margen)}.</p>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {donacion.descripcion && (
        <p className="alimentos__nota">
          <span>Nota del donante:</span> {donacion.descripcion}
        </p>
      )}

      <Modal
        abierto={Boolean(fotoAbierta)}
        alCambiar={(abierto) => !abierto && setFotoAbierta(null)}
        titulo={fotoAbierta ? `Foto de ${fotoAbierta.nombre}` : 'Foto'}
        variante="imagen"
      >
        {fotoAbierta && <img src={fotoAbierta.foto_url} alt={`Foto de ${fotoAbierta.nombre}`} />}
      </Modal>
    </Tarjeta>
  )
}
