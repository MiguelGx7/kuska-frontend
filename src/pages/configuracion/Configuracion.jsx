import { useEffect, useState } from 'react'
import { useBlocker } from 'react-router-dom'
import { actualizarConfiguracion, obtenerConfiguracion } from '../../api/configuracion'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import Modal from '../../components/Modal'
import Tarjeta from '../../components/Tarjeta'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { fechaHora } from '../../utils/fechas'
import { conPuntoFinal, plural } from '../../utils/texto'
import { AJUSTES, leerValor, textoInicial, valorParaApi } from './ajustes'
import FilaAjuste from './FilaAjuste'
import './Configuracion.css'

const ENCABEZADO = {
  migas: ['Inicio', 'Configuración'],
  titulo: 'Configuración',
  subtitulo: 'Plazos y límites que usan las reglas de Kumora.',
}

// Textos de los campos a partir de la configuración guardada.
function textosDe(configuracion) {
  return Object.fromEntries(AJUSTES.map((a) => [a.clave, textoInicial(a, configuracion?.[a.clave])]))
}

// Cambió si el número es otro, o si el texto (aún inválido) ya no es el guardado.
function estaCambiado(ajuste, texto, guardado) {
  const { valor, error } = leerValor(ajuste, texto)
  if (error) return texto.trim() !== textoInicial(ajuste, guardado)
  return valor !== Number(guardado)
}

export default function Configuracion() {
  const carga = useCarga(obtenerConfiguracion)

  if (carga.estado === 'error') {
    return (
      <>
        <EncabezadoPagina {...ENCABEZADO} />
        <Aviso
          tipo="error"
          titulo="No pudimos cargar la configuración"
          accion={
            <Boton variante="secundario" onClick={carga.reintentar}>
              Reintentar
            </Boton>
          }
        >
          {obtenerMensajeError(carga.error)}
        </Aviso>
      </>
    )
  }

  if (carga.estado === 'cargando') {
    return (
      <div aria-busy="true">
        <EncabezadoPagina {...ENCABEZADO} />
        <div className="configuracion-tarjetas">
          <Esqueleto alto={48} radio="var(--r-control)" />
          <Esqueleto alto={260} radio="var(--r-card)" />
          <Esqueleto alto={380} radio="var(--r-card)" />
        </div>
      </div>
    )
  }

  return <FormularioConfiguracion inicial={carga.datos} />
}

// Se monta con la configuración ya cargada: así el estado del formulario parte de ella.
function FormularioConfiguracion({ inicial }) {
  const mostrarToast = useToast()
  const [guardada, setGuardada] = useState(inicial)
  const [textos, setTextos] = useState(() => textosDe(inicial))
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cambiados = AJUSTES.filter((a) => estaCambiado(a, textos[a.clave], guardada[a.clave]))
  const hayCambios = cambiados.length > 0

  // Cambiar de sección con cambios sin guardar: se pide confirmación.
  const bloqueo = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hayCambios && currentLocation.pathname !== nextLocation.pathname,
  )

  // Cerrar o recargar la pestaña: el navegador muestra su propio aviso.
  useEffect(() => {
    if (!hayCambios) return
    function alSalir(e) {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', alSalir)
    return () => window.removeEventListener('beforeunload', alSalir)
  }, [hayCambios])

  function cambiar(clave, valor) {
    setTextos((actuales) => ({ ...actuales, [clave]: valor }))
    setErrores((actuales) => ({ ...actuales, [clave]: undefined }))
    setErrorGeneral(null)
  }

  function descartar() {
    setTextos(textosDe(guardada))
    setErrores({})
    setErrorGeneral(null)
  }

  async function guardar() {
    // Primero se valida en el frontend; si algo falla, no se envía nada.
    const nuevosErrores = {}
    const cambios = {}
    for (const ajuste of cambiados) {
      const { valor, error } = leerValor(ajuste, textos[ajuste.clave])
      if (error) nuevosErrores[ajuste.clave] = error
      else cambios[ajuste.clave] = valorParaApi(ajuste, valor)
    }
    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores)
      return
    }

    setErrorGeneral(null)
    setGuardando(true)
    try {
      const actualizada = await actualizarConfiguracion(cambios)
      setGuardada(actualizada)
      setTextos(textosDe(actualizada))
      setErrores({})
      mostrarToast('Configuración guardada. Aplica desde ahora.')
    } catch (error) {
      // Errores por campo debajo de cada campo; cualquier otro, en un aviso.
      const datos = error?.response?.data
      const porCampo = {}
      for (const ajuste of AJUSTES) {
        if (Array.isArray(datos?.[ajuste.clave])) porCampo[ajuste.clave] = datos[ajuste.clave].join(' ')
      }
      if (Object.keys(porCampo).length) setErrores(porCampo)
      else setErrorGeneral(error)
    } finally {
      setGuardando(false)
    }
  }

  const ultima = [
    guardada.actualizada_por,
    guardada.fecha_actualizacion && fechaHora(guardada.fecha_actualizacion),
  ]
    .filter(Boolean)
    .join(', ')

  function filas(grupo) {
    return AJUSTES.filter((a) => a.grupo === grupo).map((ajuste) => (
      <FilaAjuste
        key={ajuste.clave}
        ajuste={ajuste}
        texto={textos[ajuste.clave]}
        guardado={guardada[ajuste.clave]}
        error={errores[ajuste.clave]}
        cambiado={cambiados.includes(ajuste)}
        alCambiar={(valor) => cambiar(ajuste.clave, valor)}
      />
    ))
  }

  return (
    <>
      <EncabezadoPagina {...ENCABEZADO} />

      <form
        className="configuracion-tarjetas"
        onSubmit={(e) => {
          e.preventDefault()
          if (hayCambios && !guardando) guardar()
        }}
        noValidate
      >
        <Aviso tipo="info">
          Los cambios aplican hacia adelante: no modifican solicitudes ni topes que ya se calcularon.
          {ultima && ` ${conPuntoFinal(`Última actualización: ${ultima}`)}`}
        </Aviso>

        {errorGeneral && (
          <Aviso tipo="error" titulo="No pudimos guardar la configuración">
            {obtenerMensajeError(errorGeneral)}
          </Aviso>
        )}

        <Tarjeta titulo="Entregas y vencimientos">{filas('entregas')}</Tarjeta>

        <Tarjeta
          titulo="Límites para beneficiarios"
          subtitulo="Sirven para que la comida alcance para más personas. Los donantes no tienen límites."
        >
          {filas('limites')}
        </Tarjeta>

        <div className="configuracion-barra">
          <p className="configuracion-barra__estado" role="status">
            {hayCambios
              ? `${plural(cambiados.length, 'cambio', 'cambios')} sin guardar`
              : 'Sin cambios'}
          </p>
          <div className="configuracion-barra__botones">
            <Boton variante="secundario" onClick={descartar} disabled={!hayCambios || guardando}>
              Descartar
            </Boton>
            <Boton type="submit" cargando={guardando} disabled={!hayCambios}>
              Guardar cambios
            </Boton>
          </div>
        </div>
      </form>

      <Modal
        abierto={bloqueo.state === 'blocked'}
        alCambiar={(abierto) => !abierto && bloqueo.reset?.()}
        titulo="Tienes cambios sin guardar"
        descripcion="Si sales, se pierden."
      >
        <div className="modal__pie">
          <Boton variante="secundario" onClick={() => bloqueo.reset?.()}>
            Seguir editando
          </Boton>
          <Boton variante="peligro" onClick={() => bloqueo.proceed?.()}>
            Salir sin guardar
          </Boton>
        </div>
      </Modal>
    </>
  )
}
