import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const ESPERA_BUSQUEDA_MS = 300

// Pestaña, búsqueda y página de una lista, guardadas en la URL
// (así funcionan los enlaces desde otras pantallas y el botón atrás).
//
// pestanas: [{ valor, nombre, url, api? }]
//   url: parámetros que identifican la pestaña en la URL, p. ej. { estado: 'Pendiente' }
//        o { confirmacion: 'Reclamada' }. "Todas" lleva un marcador: { estado: 'Todas' }.
//   api: parámetros para la API (por defecto, los mismos de url). Para "Todas": {}.
// Si la URL no coincide con ninguna pestaña, se usa la primera.
//
// opciones.limpiarAlCambiar: otros parámetros que se quitan al cambiar de pestaña
//   (p. ej. ['id'] para soltar el elemento seleccionado).
export function useFiltrosUrl(pestanas, { limpiarAlCambiar = [] } = {}) {
  const [params, setParams] = useSearchParams()

  const claves = [...new Set(pestanas.flatMap((p) => Object.keys(p.url)))]
  const coincide = (p) => claves.every((k) => params.get(k) === (p.url[k] ?? null))
  const pestana = pestanas.find(coincide) ?? pestanas[0]

  const busqueda = params.get('search') ?? ''
  const pagina = Math.max(1, Number(params.get('page')) || 1)

  // Texto del buscador: se escribe al instante y llega a la URL tras 300 ms.
  const [texto, setTexto] = useState(busqueda)
  const [busquedaPrevia, setBusquedaPrevia] = useState(busqueda)
  if (busqueda !== busquedaPrevia) {
    // La URL cambió desde fuera (atrás/adelante): el buscador la sigue.
    setBusquedaPrevia(busqueda)
    setTexto(busqueda)
  }

  useEffect(() => {
    const limpio = texto.trim()
    if (limpio === busqueda) return
    const temporizador = setTimeout(() => {
      setParams(
        (actuales) => {
          const nuevos = new URLSearchParams(actuales)
          if (limpio) nuevos.set('search', limpio)
          else nuevos.delete('search')
          nuevos.delete('page')
          return nuevos
        },
        // Reemplaza: el botón atrás no recorre cada letra escrita.
        { replace: true },
      )
    }, ESPERA_BUSQUEDA_MS)
    return () => clearTimeout(temporizador)
  }, [texto, busqueda, setParams])

  function cambiarPestana(valor) {
    const destino = pestanas.find((p) => p.valor === valor)
    if (!destino) return
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      claves.forEach((k) => nuevos.delete(k))
      limpiarAlCambiar.forEach((k) => nuevos.delete(k))
      Object.entries(destino.url).forEach(([k, v]) => nuevos.set(k, v))
      nuevos.delete('page')
      return nuevos
    })
  }

  // Elemento seleccionado (?id=). Agrega una entrada al historial: el botón atrás vuelve.
  function seleccionar(id) {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      if (id == null) nuevos.delete('id')
      else nuevos.set('id', String(id))
      return nuevos
    })
  }

  function cambiarPagina(nueva) {
    setParams((actuales) => {
      const nuevos = new URLSearchParams(actuales)
      if (nueva > 1) nuevos.set('page', String(nueva))
      else nuevos.delete('page')
      return nuevos
    })
  }

  return {
    pestana,
    busqueda,
    pagina,
    texto,
    setTexto,
    cambiarPestana,
    cambiarPagina,
    id: params.get('id'),
    seleccionar,
    // Parámetros para la API (sin claves vacías).
    paramsApi: {
      ...(pestana.api ?? pestana.url),
      ...(busqueda ? { search: busqueda } : {}),
      ...(pagina > 1 ? { page: pagina } : {}),
    },
  }
}

// Parámetros de la API de una pestaña, sin búsqueda ni página (para los contadores).
export function paramsDePestana(pestana) {
  return pestana.api ?? pestana.url
}
