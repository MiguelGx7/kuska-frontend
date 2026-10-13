import { useEffect, useRef, useState } from 'react'
import { obtenerMensajeError } from '../../api/errores'
import { crearSancion } from '../../api/sanciones'
import { obtenerSolicitud } from '../../api/solicitudes'
import { obtenerImpacto } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import CampoTexto from '../../components/CampoTexto'
import Modal from '../../components/Modal'
import OpcionesTarjeta from '../../components/OpcionesTarjeta'
import Selector from '../../components/Selector'
import {
  ACCION_DE_TIPO,
  confirmacionSancion,
  historialEnFrase,
  historialVacio,
  nombreVisible,
  TIPOS_SANCION,
  tipoConArticulo,
  toastSancion,
} from './usuario'

// Opciones de "Relacionar con": sus solicitudes (beneficiario) o donaciones (donante) recientes.
function opcionesRelacion(usuario, actividad) {
  const opciones = [{ valor: '', texto: 'Sin relacionar' }]
  if (usuario.rol === 'Beneficiario') {
    actividad.forEach((s) =>
      opciones.push({ valor: `solicitud:${s.id}`, texto: `Pedido ${s.codigo_pedido} · ${s.donacion_titulo}` }),
    )
  } else if (usuario.rol === 'Donante') {
    actividad.forEach((d) => opciones.push({ valor: `donacion:${d.id}`, texto: `Donación «${d.titulo}»` }))
  }
  return opciones
}

// Sanción en 2 pasos: 1) tipo, motivo y relación; 2) lo que pasará (impacto) y confirmar.
// Nada cambia hasta confirmar en el paso 2.
export default function ModalSancionar({
  usuario,
  impacto,
  actividad,
  solicitudInicial,
  alCambiar,
  alSancionar,
}) {
  const nombre = nombreVisible(usuario)
  const sugerida = impacto?.sancion_sugerida ?? 'Advertencia'
  const refMotivo = useRef(null)

  const [paso, setPaso] = useState(1)
  const [tipo, setTipo] = useState(sugerida)
  const [motivo, setMotivo] = useState('')
  const [errorMotivo, setErrorMotivo] = useState(null)
  const [relacion, setRelacion] = useState(solicitudInicial ? `solicitud:${solicitudInicial}` : '')
  const [impactoTipo, setImpactoTipo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [etiquetaInicial, setEtiquetaInicial] = useState(null)

  const opciones = opcionesRelacion(usuario, actividad)
  // Si la solicitud que llega desde Solicitudes no está entre las recientes, se agrega.
  const valorInicial = solicitudInicial ? `solicitud:${solicitudInicial}` : null
  const faltaInicial = valorInicial && !opciones.some((o) => o.valor === valorInicial)
  if (faltaInicial) {
    opciones.push({ valor: valorInicial, texto: etiquetaInicial ?? `Pedido #${solicitudInicial}` })
  }

  // Para mostrar su código en vez del id.
  useEffect(() => {
    if (!faltaInicial) return
    let vigente = true
    obtenerSolicitud(solicitudInicial)
      .then((s) => {
        if (vigente) setEtiquetaInicial(`Pedido ${s.codigo_pedido} · ${s.donacion_titulo}`)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [faltaInicial, solicitudInicial])

  const textoEscala = historialVacio(impacto?.historial)
    ? 'No tiene sanciones anteriores, por eso la escala sugiere una advertencia (RN-05). Puedes elegir otra si lo justificas.'
    : `Antes tuvo ${historialEnFrase(impacto.historial)}, por eso la escala sugiere ${tipoConArticulo(sugerida)} (RN-05). Puedes elegir otra si lo justificas.`

  const opcionesTipo = TIPOS_SANCION.map((t) => ({
    ...t,
    etiqueta: t.valor === sugerida ? <Badge variante="gris">Sugerida</Badge> : null,
  }))

  async function verQuePasara(e) {
    e.preventDefault()
    if (!motivo.trim()) {
      setErrorMotivo('Escribe el motivo de la sanción.')
      refMotivo.current?.focus()
      return
    }
    setError(null)
    setCargando(true)
    try {
      setImpactoTipo(await obtenerImpacto(usuario.id, ACCION_DE_TIPO[tipo]))
      setPaso(2)
    } catch (err) {
      setError({ titulo: 'No pudimos calcular lo que pasará', error: err })
    } finally {
      setCargando(false)
    }
  }

  async function confirmar() {
    const [clase, idRelacion] = relacion.split(':')
    const datos = { usuario: usuario.id, tipo, motivo: motivo.trim() }
    if (clase === 'solicitud') datos.solicitud = Number(idRelacion)
    if (clase === 'donacion') datos.donacion = Number(idRelacion)

    setError(null)
    setCargando(true)
    try {
      const sancion = await crearSancion(datos)
      alSancionar(
        toastSancion({
          tipo,
          nombre,
          fechaFin: sancion?.fecha_fin,
          estabaInactivo: usuario.estado === 'Inactivo',
        }),
      )
    } catch (err) {
      // P. ej. ya se sancionó por esa misma solicitud: se queda en el modal.
      setError({ titulo: 'No pudimos registrar la sanción', error: err })
      setCargando(false)
    }
  }

  const confirmacion = confirmacionSancion(tipo, nombre)

  const titulo = (
    <>
      <span className="modal__paso">
        {paso === 1 ? 'Paso 1 de 2' : 'Paso 2 de 2 · nada ha cambiado todavía'}
      </span>
      {paso === 1 ? `Sancionar a ${nombre}` : confirmacion.titulo}
    </>
  )

  return (
    <Modal abierto alCambiar={(abierto) => !cargando && alCambiar(abierto)} titulo={titulo} ancho>
      {paso === 1 && (
        <form className="sancionar" onSubmit={verQuePasara} noValidate>
          <p className="sancionar__texto">{textoEscala}</p>

          <OpcionesTarjeta
            etiqueta="Tipo de sanción"
            opciones={opcionesTipo}
            valor={tipo}
            alCambiar={setTipo}
          />

          <CampoTexto
            ref={refMotivo}
            etiqueta="Motivo"
            valor={motivo}
            placeholder="No recogió su pedido dentro del plazo."
            error={errorMotivo}
            alCambiar={(valor) => {
              setMotivo(valor)
              setErrorMotivo(null)
            }}
          />

          <Selector
            etiqueta="Relacionar con (opcional)"
            opciones={opciones}
            valor={relacion}
            alCambiar={setRelacion}
          />

          {error && (
            <Aviso tipo="error" titulo={error.titulo}>
              {obtenerMensajeError(error.error)}
            </Aviso>
          )}

          <div className="modal__pie">
            <Boton variante="secundario" onClick={() => alCambiar(false)} disabled={cargando}>
              Cancelar
            </Boton>
            <Boton type="submit" cargando={cargando}>
              Ver qué pasará
            </Boton>
          </div>
        </form>
      )}

      {paso === 2 && (
        <div className="sancionar">
          <p className="sancionar__texto">
            <strong>Motivo:</strong> {motivo.trim()}
          </p>

          {impactoTipo?.aviso && <Aviso tipo="advertencia">{impactoTipo.aviso}</Aviso>}

          {impactoTipo?.resumen?.length > 0 && (
            <ul className="sancionar__resumen">
              {impactoTipo.resumen.map((linea) => (
                <li key={linea}>{linea}</li>
              ))}
            </ul>
          )}

          {error && (
            <Aviso tipo="error" titulo={error.titulo}>
              {obtenerMensajeError(error.error)}
            </Aviso>
          )}

          <div className="modal__pie">
            <Boton
              variante="secundario"
              disabled={cargando}
              onClick={() => {
                setError(null)
                setPaso(1)
              }}
            >
              Atrás
            </Boton>
            <Boton variante={confirmacion.variante} cargando={cargando} onClick={confirmar}>
              {confirmacion.boton}
            </Boton>
          </div>
        </div>
      )}
    </Modal>
  )
}
