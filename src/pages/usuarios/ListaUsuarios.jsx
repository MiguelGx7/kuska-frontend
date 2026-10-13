import { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerMensajeError } from '../../api/errores'
import { listarUsuarios } from '../../api/usuarios'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import BarraFiltros from '../../components/BarraFiltros'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import HormigaVacia from '../../components/HormigaVacia'
import Paginacion from '../../components/Paginacion'
import Tarjeta from '../../components/Tarjeta'
import { useCarga } from '../../hooks/useCarga'
import { useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { colorEstado } from '../../utils/estados'
import { fechaDiaCorta, hoyBogota } from '../../utils/fechas'
import { inicialesDe } from '../../utils/nombres'
import { bloqueoPermanente, documento, esNegocio, nombrePersona, nombreVisible } from './usuario'
import './Usuarios.css'

// Sin pestañas: los filtros van en selects.
const SIN_PESTANAS = [{ valor: 'todos', nombre: 'Todos', url: {} }]

const ROLES = [
  { valor: '', texto: 'Todos los roles' },
  { valor: 'Donante', texto: 'Donantes' },
  { valor: 'Beneficiario', texto: 'Beneficiarios' },
  { valor: 'Administrador', texto: 'Administradores' },
]

const ESTADOS = [
  { valor: '', texto: 'Todos los estados' },
  { valor: 'Activo', texto: 'Activos' },
  { valor: 'Bloqueado', texto: 'Bloqueados' },
  { valor: 'Inactivo', texto: 'Inactivos' },
]

// "hasta 20 oct" debajo del Badge, o "permanente".
function textoBloqueo(usuario) {
  if (usuario.estado !== 'Bloqueado') return null
  if (bloqueoPermanente(usuario)) return 'permanente'
  // El día se toma en hora de Bogotá, no el de la fecha UTC.
  return `hasta ${fechaDiaCorta(hoyBogota(new Date(usuario.bloqueado_hasta)))}`
}

export default function ListaUsuarios() {
  const navigate = useNavigate()

  // Búsqueda, rol, estado y página viven en la URL.
  const filtros = useFiltrosUrl(SIN_PESTANAS, { extras: ['rol', 'estado'] })
  const { texto, setTexto, pagina, cambiarPagina, valores, cambiarFiltro } = filtros

  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(() => listarUsuarios(JSON.parse(claveFiltros)), [claveFiltros])
  const lista = useCarga(cargarLista)

  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Usuarios']}
        titulo="Usuarios"
        subtitulo="Donantes, beneficiarios y administradores de Kumora."
      />

      <Tarjeta className="lista lista--sin-pestanas">
        <div className="lista__panel">
          <BarraFiltros
            busqueda={{
              valor: texto,
              alCambiar: setTexto,
              placeholder: 'Buscar por nombre, correo o documento',
              etiqueta: 'Buscar usuarios',
            }}
            filtros={[
              {
                clave: 'rol',
                etiqueta: 'Rol',
                opciones: ROLES,
                valor: valores.rol,
                alCambiar: (v) => cambiarFiltro('rol', v),
              },
              {
                clave: 'estado',
                etiqueta: 'Estado',
                opciones: ESTADOS,
                valor: valores.estado,
                alCambiar: (v) => cambiarFiltro('estado', v),
              },
            ]}
          />

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar los usuarios"
              accion={
                <Boton variante="secundario" onClick={lista.reintentar}>
                  Reintentar
                </Boton>
              }
            >
              {obtenerMensajeError(lista.error)}
            </Aviso>
          )}

          {lista.estado === 'cargando' && !datos && (
            <div className="lista__esqueleto" aria-busy="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Esqueleto key={i} alto={52} />
              ))}
            </div>
          )}

          {datos && datos.results.length === 0 && !recargando && (
            <HormigaVacia
              titulo="Ningún usuario coincide"
              texto="Prueba con otro nombre, correo o documento, o cambia los filtros."
            />
          )}

          {datos && datos.results.length > 0 && (
            <div
              className={`tabla-contenedor ${recargando ? 'lista__recargando' : ''}`}
              aria-busy={recargando || undefined}
            >
              <table className="tabla">
                <thead>
                  <tr>
                    <th scope="col">Usuario</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Documento</th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="visualmente-oculto">Acción</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datos.results.map((u) => {
                    const ruta = `/usuarios/${u.id}`
                    const detener = (e) => e.stopPropagation()
                    const nombre = nombreVisible(u)
                    const bloqueo = textoBloqueo(u)
                    return (
                      // Toda la fila es clicable; el enlace del nombre la hace accesible con teclado.
                      <tr key={u.id} className="tabla__fila-enlace" onClick={() => navigate(ruta)}>
                        <td>
                          <div className="celda-miniatura">
                            <span className="avatar-mini" aria-hidden="true">
                              {inicialesDe(nombre)}
                            </span>
                            <div className="celda-miniatura__textos">
                              <Link to={ruta} className="tabla__principal" onClick={detener}>
                                {nombre}
                              </Link>
                              <span className="tabla__secundario">
                                {esNegocio(u) ? `${nombrePersona(u)} · ${u.correo}` : u.correo}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="tabla__texto-2">{u.rol}</td>
                        <td className="tabla__texto-2 tabla__sin-salto">{documento(u)}</td>
                        <td>
                          <Badge variante={colorEstado('usuario', u.estado)}>{u.estado}</Badge>
                          {bloqueo && <span className="usuarios__bloqueo">{bloqueo}</span>}
                        </td>
                        <td className="tabla__accion">
                          <Boton variante="enlace" to={ruta} onClick={detener}>
                            Ver
                          </Boton>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {datos && datos.results.length > 0 && (
            <Paginacion
              pagina={pagina}
              total={datos.count}
              cantidad={datos.results.length}
              hayAnterior={Boolean(datos.previous)}
              haySiguiente={Boolean(datos.next)}
              alCambiar={cambiarPagina}
            />
          )}
        </div>
      </Tarjeta>
    </>
  )
}
