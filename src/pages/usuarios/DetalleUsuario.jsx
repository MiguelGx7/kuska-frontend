import { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PencilLine, Shield, UserCheck, UserX } from 'lucide-react'
import { listarDonaciones } from '../../api/donaciones'
import { obtenerMensajeError } from '../../api/errores'
import { listarSanciones } from '../../api/sanciones'
import { listarSolicitudes } from '../../api/solicitudes'
import { obtenerImpacto, obtenerUsuario } from '../../api/usuarios'
import { useSesion } from '../../auth/useSesion'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import Boton from '../../components/Boton'
import Caja from '../../components/Caja'
import Esqueleto from '../../components/Esqueleto'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { useContadores } from '../../layout/useContadores'
import { colorEstado } from '../../utils/estados'
import { fechaHoraLarga, fechaMesAnio } from '../../utils/fechas'
import { conPuntoFinal } from '../../utils/texto'
import ActividadUsuario from './ActividadUsuario'
import DatosUsuario from './DatosUsuario'
import ModalCorregir from './ModalCorregir'
import ModalInactivar from './ModalInactivar'
import ModalReactivar from './ModalReactivar'
import ModalSancionar from './ModalSancionar'
import SancionesUsuario from './SancionesUsuario'
import { bloqueoPermanente, nombreVisible, ROL_ADMINISTRADOR, rolVisible } from './usuario'
import './Usuarios.css'

const MIGAS = ['Inicio', 'Usuarios']

// Carga al usuario. Lo demás (impacto, sanciones, actividad) depende de su rol: va en VistaUsuario.
export default function DetalleUsuario() {
  const { id } = useParams()
  const cargarUsuario = useCallback(() => obtenerUsuario(id), [id])
  const carga = useCarga(cargarUsuario)

  // Tras una acción se recarga sin vaciar la pantalla (si los datos previos son de este usuario).
  const previos = carga.previos?.id === Number(id) ? carga.previos : null
  const usuario = carga.datos ?? (carga.estado === 'cargando' ? previos : null)

  if (carga.estado === 'error') {
    const noExiste = carga.error?.response?.status === 404
    return (
      <>
        <EncabezadoPagina migas={MIGAS} titulo="Usuario" />
        <Aviso
          tipo="error"
          titulo={noExiste ? 'No encontramos ese usuario.' : 'No pudimos cargar el usuario'}
          accion={
            noExiste ? (
              <Boton variante="enlace" to="/usuarios">
                Volver a Usuarios
              </Boton>
            ) : (
              <Boton variante="secundario" onClick={carga.reintentar}>
                Reintentar
              </Boton>
            )
          }
        >
          {noExiste ? 'Puede que el enlace esté mal escrito.' : obtenerMensajeError(carga.error)}
        </Aviso>
      </>
    )
  }

  if (!usuario) {
    return (
      <div aria-busy="true">
        <EncabezadoPagina
          migas={MIGAS}
          titulo={<Esqueleto alto={30} ancho={260} />}
          subtitulo={<Esqueleto alto={16} ancho={220} />}
        />
        <div className="detalle">
          <div className="detalle__lateral">
            <Esqueleto alto={340} radio="var(--r-card)" />
            <Esqueleto alto={220} radio="var(--r-card)" />
          </div>
          <Esqueleto alto={260} radio="var(--r-card)" />
        </div>
      </div>
    )
  }

  return <VistaUsuario key={usuario.id} usuario={usuario} recargarUsuario={carga.reintentar} />
}

function VistaUsuario({ usuario, recargarUsuario }) {
  const { usuario: yo } = useSesion()
  const mostrarToast = useToast()
  const { recargarContadores } = useContadores()
  const [params, setParams] = useSearchParams()

  const esAdmin = usuario.rol === ROL_ADMINISTRADOR
  const esYo = yo?.id === usuario.id
  const puedeGestionar = !esAdmin && !esYo
  const nombre = nombreVisible(usuario)

  // Impacto de una advertencia: trae el historial y la sanción sugerida (null = nivel máximo).
  const cargarImpacto = useCallback(
    () => (esAdmin ? Promise.resolve(null) : obtenerImpacto(usuario.id, 'advertencia')),
    [usuario.id, esAdmin],
  )
  const impacto = useCarga(cargarImpacto)
  const datosImpacto = impacto.datos ?? impacto.previos

  const cargarSanciones = useCallback(
    () =>
      esAdmin
        ? Promise.resolve([])
        : listarSanciones({ usuario: usuario.id }).then((d) => d.results ?? []),
    [usuario.id, esAdmin],
  )
  const sanciones = useCarga(cargarSanciones)

  // Las 5 más recientes: la API ya las ordena de la más nueva a la más vieja.
  const cargarActividad = useCallback(() => {
    if (usuario.rol === 'Beneficiario') {
      return listarSolicitudes({ beneficiario: usuario.id }).then((d) => d.results.slice(0, 5))
    }
    if (usuario.rol === 'Donante') {
      return listarDonaciones({ donante: usuario.id }).then((d) => d.results.slice(0, 5))
    }
    return Promise.resolve([])
  }, [usuario.id, usuario.rol])
  const actividad = useCarga(cargarActividad)

  const puedeSancionar = puedeGestionar && datosImpacto?.sancion_sugerida != null

  // Desde Solicitudes llega ?sancionar=1&solicitud={id}: el modal se abre solo con esa solicitud.
  const [solicitudDesdeUrl] = useState(() =>
    params.get('sancionar') === '1' ? (params.get('solicitud') ?? '') : null,
  )
  const [modal, setModal] = useState(solicitudDesdeUrl != null ? 'sancionar' : null)

  // Se quitan esos parámetros para que al recargar no se vuelva a abrir.
  useEffect(() => {
    if (!params.has('sancionar') && !params.has('solicitud')) return
    setParams(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales)
        nuevos.delete('sancionar')
        nuevos.delete('solicitud')
        return nuevos
      },
      { replace: true },
    )
  }, [params, setParams])

  function terminarAccion(mensaje) {
    setModal(null)
    mostrarToast(mensaje)
    recargarContadores()
    recargarUsuario()
    impacto.reintentar()
    sanciones.reintentar()
  }

  const cerrar = (abierto) => !abierto && setModal(null)

  return (
    <>
      <EncabezadoPagina
        migas={[...MIGAS, nombre]}
        titulo={nombre}
        etiqueta={<Badge variante={colorEstado('usuario', usuario.estado)}>{usuario.estado}</Badge>}
        subtitulo={`${rolVisible(usuario)} · en Kumora desde ${fechaMesAnio(usuario.fecha_registro)}`}
      >
        {puedeGestionar && (
          <>
            <Boton variante="secundario" icono={PencilLine} onClick={() => setModal('corregir')}>
              Corregir datos
            </Boton>
            {usuario.estado === 'Inactivo' ? (
              <Boton variante="secundario" icono={UserCheck} onClick={() => setModal('reactivar')}>
                Reactivar
              </Boton>
            ) : (
              <Boton variante="peligro-suave" icono={UserX} onClick={() => setModal('inactivar')}>
                Inactivar
              </Boton>
            )}
            {puedeSancionar && (
              <Boton icono={Shield} onClick={() => setModal('sancionar')}>
                Sancionar
              </Boton>
            )}
          </>
        )}
      </EncabezadoPagina>

      <div className="detalle__avisos">
        {esAdmin && (
          <Aviso tipo="info">
            Los administradores se gestionan por consola. Desde el panel no se pueden sancionar,
            inactivar ni editar.
          </Aviso>
        )}
        {usuario.estado === 'Bloqueado' && usuario.bloqueado_hasta && (
          <Aviso tipo="error">
            {conPuntoFinal(`Bloqueado hasta el ${fechaHoraLarga(usuario.bloqueado_hasta)}`)} Se
            desbloquea solo al cumplirse el plazo.
          </Aviso>
        )}
        {bloqueoPermanente(usuario) && (
          <Aviso tipo="error">Bloqueo permanente: es definitivo y no se levanta.</Aviso>
        )}
        {usuario.estado === 'Inactivo' && (
          <Caja tono="gris">
            Cuenta inactiva: no puede entrar. Al reactivarla vuelve a Activo, o a Bloqueado si aún
            tiene un bloqueo vigente.
          </Caja>
        )}
      </div>

      <div className="detalle">
        <div className="detalle__lateral">
          <DatosUsuario usuario={usuario} />
          <ActividadUsuario usuario={usuario} carga={actividad} />
        </div>
        <SancionesUsuario
          usuario={usuario}
          impacto={impacto}
          datosImpacto={datosImpacto}
          sanciones={sanciones}
        />
      </div>

      {/* Se montan al abrirse: cada vez empiezan limpios. */}
      {modal === 'sancionar' && puedeSancionar && (
        <ModalSancionar
          usuario={usuario}
          impacto={datosImpacto}
          actividad={actividad.datos ?? []}
          solicitudInicial={solicitudDesdeUrl}
          alCambiar={cerrar}
          alSancionar={(mensaje) => terminarAccion(mensaje)}
        />
      )}
      {modal === 'inactivar' && (
        <ModalInactivar usuario={usuario} alCambiar={cerrar} alTerminar={terminarAccion} />
      )}
      {modal === 'reactivar' && (
        <ModalReactivar
          usuario={usuario}
          // Un bloqueo permanente es definitivo: si alguna vez lo tuvo, sigue vigente.
          tienePermanente={datosImpacto?.historial?.bloqueos_permanentes > 0}
          alCambiar={cerrar}
          alTerminar={terminarAccion}
        />
      )}
      {modal === 'corregir' && (
        <ModalCorregir usuario={usuario} alCambiar={cerrar} alTerminar={terminarAccion} />
      )}
    </>
  )
}
