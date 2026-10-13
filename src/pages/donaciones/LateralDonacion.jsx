import { Mail, MessageCircle, Phone } from 'lucide-react'
import Boton from '../../components/Boton'
import Tarjeta from '../../components/Tarjeta'
import { enlaceCorreo, enlaceLlamar, enlaceWhatsApp } from '../../utils/contacto'
import { fechaRelativa } from '../../utils/fechas'
import { MODALIDAD_LARGA } from './donacion'

function inicialesDe(nombre) {
  const letras = (nombre ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
  return letras.toUpperCase() || '?'
}

export default function LateralDonacion({ donacion }) {
  const { donante } = donacion
  const llamar = enlaceLlamar(donante?.telefono)
  const whatsapp = enlaceWhatsApp(donante?.telefono)
  const correo = enlaceCorreo(donante?.correo, `Kumora · donación «${donacion.titulo}»`)

  return (
    <div className="detalle__lateral">
      <Tarjeta className="lateral" titulo="Donante">
        <div className="persona">
          <span className="persona__avatar" aria-hidden="true">
            {inicialesDe(donante?.nombre)}
          </span>
          <div>
            <p className="persona__nombre">{donante?.nombre}</p>
            {donante?.tipo_donante && <p className="persona__tipo">{donante.tipo_donante}</p>}
          </div>
        </div>

        <dl className="datos">
          <div>
            <dt>Teléfono</dt>
            <dd>{donante?.telefono || '—'}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd className="datos__correo">{donante?.correo || '—'}</dd>
          </div>
        </dl>

        <div className="lateral__botones">
          {llamar && (
            <Boton variante="secundario" tamano="pequeno" icono={Phone} href={llamar}>
              Llamar
            </Boton>
          )}
          {whatsapp && (
            <Boton
              variante="secundario"
              tamano="pequeno"
              icono={MessageCircle}
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Boton>
          )}
          {correo && (
            <Boton variante="secundario" tamano="pequeno" icono={Mail} href={correo}>
              Correo
            </Boton>
          )}
        </div>
      </Tarjeta>

      <Tarjeta className="lateral" titulo="Entrega">
        <dl className="datos">
          <div>
            <dt>Modalidad</dt>
            <dd>{MODALIDAD_LARGA[donacion.modalidad_entrega] ?? donacion.modalidad_entrega}</dd>
          </div>
          <div>
            <dt>Dirección de recogida</dt>
            <dd>{donacion.direccion_recogida || '—'}</dd>
          </div>
        </dl>
      </Tarjeta>

      <Tarjeta className="lateral" titulo="Revisión">
        {donacion.revisada_por ? (
          <dl className="datos">
            <div>
              <dt>Revisada por</dt>
              <dd className="datos__correo">{donacion.revisada_por}</dd>
            </div>
            <div>
              <dt>Fecha</dt>
              <dd>{donacion.fecha_revision ? fechaRelativa(donacion.fecha_revision) : '—'}</dd>
            </div>
          </dl>
        ) : (
          <p className="lateral__vacio">Aún no se revisa</p>
        )}
      </Tarjeta>
    </div>
  )
}
