import { useCallback, useId } from 'react'
import { obtenerMensajeError } from '../../api/errores'
import { contarNovedades, listarNovedades } from '../../api/novedades'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import HormigaVacia from '../../components/HormigaVacia'
import Pestanas from '../../components/Pestanas'
import Tarjeta from '../../components/Tarjeta'
import { useToast } from '../../components/toast/useToast'
import { useCarga } from '../../hooks/useCarga'
import { paramsDePestana, useFiltrosUrl } from '../../hooks/useFiltrosUrl'
import EncabezadoPagina from '../../layout/EncabezadoPagina'
import { useContadores } from '../../layout/useContadores'
import DetalleNovedad from './DetalleNovedad'
import ListaNovedades from './ListaNovedades'
import './Novedades.css'

// La primera es la pestaña por defecto. "Todas" lleva un marcador en la URL y no filtra en la API.
const PESTANAS = [
  { valor: 'Pendiente', nombre: 'Pendientes', url: { estado: 'Pendiente' } },
  { valor: 'Aceptada', nombre: 'Aceptadas', url: { estado: 'Aceptada' } },
  { valor: 'Rechazada', nombre: 'Rechazadas', url: { estado: 'Rechazada' } },
  { valor: 'Todas', nombre: 'Todas', url: { estado: 'Todas' }, api: {} },
]

// Contadores de las pestañas. Si uno falla, esa pestaña queda sin número.
async function cargarContadores() {
  const resultados = await Promise.allSettled(
    PESTANAS.map((p) => contarNovedades(paramsDePestana(p))),
  )
  return Object.fromEntries(
    PESTANAS.map(({ valor }, i) => [
      valor,
      resultados[i].status === 'fulfilled' ? resultados[i].value : null,
    ]),
  )
}

function textoVacio(pestana) {
  if (pestana === 'Pendiente') {
    return {
      titulo: 'No hay novedades por revisar',
      texto: 'Cuando un donante reporte un problema con lo que donó, aparecerá aquí.',
    }
  }
  return {
    titulo: 'No hay novedades en este estado',
    texto: 'Cambia de pestaña para ver las demás.',
  }
}

export default function Novedades() {
  const idPestanas = useId()
  const mostrarToast = useToast()
  const { recargarContadores } = useContadores()

  // Pestaña, página y novedad seleccionada (?id=) viven en la URL.
  const filtros = useFiltrosUrl(PESTANAS, { limpiarAlCambiar: ['id'] })
  const pestana = filtros.pestana.valor

  const contadores = useCarga(cargarContadores)

  // La clave en texto mantiene estable la función mientras los filtros no cambien.
  const claveFiltros = JSON.stringify(filtros.paramsApi)
  const cargarLista = useCallback(() => listarNovedades(JSON.parse(claveFiltros)), [claveFiltros])
  const lista = useCarga(cargarLista)
  const datos = lista.datos ?? (lista.estado === 'cargando' ? lista.previos : null)
  const items = datos?.results ?? []

  // Sin ?id= se muestra la primera de la lista (sin escribirla en la URL).
  const idUrl = filtros.id
  const idSeleccionado = idUrl ?? (items[0]?.id != null ? String(items[0].id) : null)

  const vacia = lista.estado === 'listo' && items.length === 0 && !idUrl
  const vacio = textoVacio(pestana)

  // Después de aceptar o rechazar: lista, contadores y aviso. Si estaba elegida solo por ser
  // la primera, se fija en la URL para que siga a la vista (ya resuelta) aunque salga de la lista.
  function alResolver(mensaje, idResuelta) {
    if (!idUrl) filtros.seleccionar(idResuelta)
    mostrarToast(mensaje)
    recargarContadores()
    contadores.reintentar()
    lista.reintentar()
  }

  const opciones = PESTANAS.map((p) => ({ ...p, contador: contadores.datos?.[p.valor] }))

  return (
    <>
      <EncabezadoPagina
        migas={['Inicio', 'Novedades']}
        titulo="Novedades"
        subtitulo="Problemas que reportan los donantes con lo que ya donaron."
      />

      <Pestanas
        opciones={opciones}
        valor={pestana}
        alCambiar={filtros.cambiarPestana}
        etiqueta="Estado de las novedades"
        idBase={idPestanas}
      />

      <div
        role="tabpanel"
        id={`${idPestanas}-panel`}
        aria-labelledby={`${idPestanas}-pestana-${pestana}`}
        className="novedades__panel"
      >
        {lista.estado === 'error' && !datos && (
          <Aviso
            tipo="error"
            titulo="No pudimos cargar las novedades"
            accion={
              <Boton variante="secundario" onClick={lista.reintentar}>
                Reintentar
              </Boton>
            }
          >
            {obtenerMensajeError(lista.error)}
          </Aviso>
        )}

        {vacia && (
          <Tarjeta>
            <HormigaVacia titulo={vacio.titulo} texto={vacio.texto} />
          </Tarjeta>
        )}

        {!vacia && lista.estado !== 'error' && (
          // En pantallas angostas el CSS muestra la lista o el detalle según haya ?id=.
          <div className={`bandeja ${idUrl ? 'bandeja--con-id' : ''}`}>
            <ListaNovedades
              carga={lista}
              datos={datos}
              idSeleccionado={idSeleccionado}
              alSeleccionar={filtros.seleccionar}
              pagina={filtros.pagina}
              alCambiarPagina={filtros.cambiarPagina}
            />
            <DetalleNovedad
              id={idSeleccionado}
              alVolver={() => filtros.seleccionar(null)}
              alResolver={alResolver}
            />
          </div>
        )}
      </div>
    </>
  )
}
