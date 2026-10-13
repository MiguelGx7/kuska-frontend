import { useCallback, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { actualizarCategoria, listarCategorias } from '../../api/categorias'
import { obtenerMensajeError } from '../../api/errores'
import Aviso from '../../components/Aviso'
import Badge from '../../components/Badge'
import BarraFiltros from '../../components/BarraFiltros'
import Boton from '../../components/Boton'
import Esqueleto from '../../components/Esqueleto'
import HormigaVacia from '../../components/HormigaVacia'
import { Menu, MenuOpcion, MenuSeparador } from '../../components/Menu'
import Paginacion from '../../components/Paginacion'
import Segmentado from '../../components/Segmentado'
import Tarjeta from '../../components/Tarjeta'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import { useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { colorEstado } from '../../utils/estados'
import ModalCategoria from './ModalCategoria'
import ModalEliminarCategoria from './ModalEliminarCategoria'
import { toastActivacion } from './categoria'
import './Categorias.css'

// Sin pestañas: el filtro de estado va en un selector segmentado.
const SIN_PESTANAS = [{ valor: 'todas', nombre: 'Todas', url: {} }]

const ESTADOS = [
  { valor: '', texto: 'Todas' },
  { valor: 'true', texto: 'Activas' },
  { valor: 'false', texto: 'Inactivas' },
]

export default function Categorias() {
  const mostrarToast = useToast()

  // Búsqueda, estado (?activa=) y página viven en la URL.
  const filtros = useFiltrosUrl(SIN_PESTANAS, { extras: ['activa'] })
  const { texto, setTexto, busqueda, pagina, cambiarPagina, valores, cambiarFiltro } = filtros
  const hayFiltros = Boolean(busqueda || valores.activa)

  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(() => listarCategorias(JSON.parse(claveFiltros)), [claveFiltros])
  const lista = useCarga(cargarLista)

  const previosConFilas = lista.previos?.results.length ? lista.previos : null
  const datos = lista.datos ?? (lista.estado === 'cargando' ? previosConFilas : null)
  const recargando = lista.estado === 'cargando' && Boolean(datos)

  // modal: { tipo: 'nueva' | 'editar' | 'eliminar', categoria? }
  const [modal, setModal] = useState(null)
  const [errorAccion, setErrorAccion] = useState(null)

  function terminarAccion(mensaje) {
    setModal(null)
    setErrorAccion(null)
    mostrarToast(mensaje)
    lista.reintentar()
  }

  // Activar o inactivar va directo desde el menú, sin modal.
  async function cambiarActiva(categoria) {
    setErrorAccion(null)
    try {
      await actualizarCategoria(categoria.id, { activa: !categoria.activa })
      terminarAccion(toastActivacion(categoria.nombre, !categoria.activa))
    } catch (error) {
      setErrorAccion({
        titulo: categoria.activa
          ? `No pudimos inactivar «${categoria.nombre}»`
          : `No pudimos activar «${categoria.nombre}»`,
        error,
      })
    }
  }

  const cerrar = (abierto) => !abierto && setModal(null)

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Categorías']}
        titulo="Categorías"
        subtitulo="Con estas categorías los donantes clasifican sus alimentos."
      >
        <Boton icono={Plus} onClick={() => setModal({ tipo: 'nueva' })}>
          Nueva categoría
        </Boton>
      </EncabezadoPagina>

      <Tarjeta className="lista lista--sin-pestanas">
        <div className="lista__panel">
          <BarraFiltros
            inicio={
              <Segmentado
                etiqueta="Estado de las categorías"
                opciones={ESTADOS}
                valor={valores.activa}
                alCambiar={(v) => cambiarFiltro('activa', v)}
              />
            }
            busqueda={{
              valor: texto,
              alCambiar: setTexto,
              placeholder: 'Buscar por nombre',
              etiqueta: 'Buscar categorías',
            }}
          />

          {errorAccion && (
            <Aviso tipo="error" titulo={errorAccion.titulo}>
              {obtenerMensajeError(errorAccion.error)}
            </Aviso>
          )}

          {lista.estado === 'error' && (
            <Aviso
              tipo="error"
              titulo="No pudimos cargar las categorías"
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
              {[0, 1, 2, 3, 4].map((i) => (
                <Esqueleto key={i} alto={48} />
              ))}
            </div>
          )}

          {datos && datos.results.length === 0 && !recargando && hayFiltros && (
            <p className="categorias-sin-resultados">Ninguna categoría coincide.</p>
          )}

          {datos && datos.results.length === 0 && !recargando && !hayFiltros && (
            <HormigaVacia
              titulo="Todavía no hay categorías"
              texto="Crea la primera con «Nueva categoría»."
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
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Estado</th>
                    <th scope="col">
                      <span className="visualmente-oculto">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datos.results.map((c) => {
                    const estado = c.activa ? 'Activa' : 'Inactiva'
                    return (
                      <tr key={c.id}>
                        <td className="categorias-nombre">{c.nombre}</td>
                        <td className="tabla__texto-2 categorias-descripcion">
                          {c.descripcion || '—'}
                        </td>
                        <td>
                          <Badge variante={colorEstado('categoria', estado)}>{estado}</Badge>
                        </td>
                        <td className="tabla__accion">
                          <div className="categorias-acciones">
                            <Boton
                              variante="secundario"
                              tamano="pequeno"
                              onClick={() => setModal({ tipo: 'editar', categoria: c })}
                            >
                              Editar
                            </Boton>
                            <Menu
                              disparador={
                                <Boton
                                  variante="secundario"
                                  tamano="pequeno"
                                  icono={MoreHorizontal}
                                  className="categorias-mas"
                                  aria-label={`Más acciones para ${c.nombre}`}
                                />
                              }
                            >
                              <MenuOpcion alElegir={() => cambiarActiva(c)}>
                                {c.activa ? 'Inactivar' : 'Activar'}
                              </MenuOpcion>
                              <MenuSeparador />
                              <MenuOpcion
                                peligro
                                alElegir={() => setModal({ tipo: 'eliminar', categoria: c })}
                              >
                                Eliminar
                              </MenuOpcion>
                            </Menu>
                          </div>
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

      {/* Se montan al abrirse: cada vez empiezan limpios. */}
      {(modal?.tipo === 'nueva' || modal?.tipo === 'editar') && (
        <ModalCategoria
          categoria={modal.categoria ?? null}
          alCambiar={cerrar}
          alTerminar={terminarAccion}
        />
      )}
      {modal?.tipo === 'eliminar' && (
        <ModalEliminarCategoria
          categoria={modal.categoria}
          alCambiar={cerrar}
          alTerminar={terminarAccion}
        />
      )}
    </>
  )
}
