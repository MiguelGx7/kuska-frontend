import { useCallback, useEffect, useState } from 'react'

// Ejecuta `cargar` y expone { estado, datos, error, previos, reintentar }.
// estado: 'cargando' | 'listo' | 'error'.
// - Si `cargar` cambia (p. ej. un useCallback con otros filtros), vuelve a cargar.
// - `previos` son los últimos datos que llegaron bien: sirven para no vaciar la
//   pantalla mientras se recarga (cambio de página, después de una acción).
// `cargar` debe ser estable: definida fuera del componente o con useCallback.
export function useCarga(cargar) {
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState({ fuente: null, intento: -1 })
  const [previos, setPrevios] = useState(null)

  useEffect(() => {
    let vigente = true
    cargar()
      .then((datos) => {
        if (!vigente) return
        setResultado({ fuente: cargar, intento, estado: 'listo', datos, error: null })
        setPrevios(datos)
      })
      .catch((error) => {
        if (vigente) setResultado({ fuente: cargar, intento, estado: 'error', datos: null, error })
      })
    return () => {
      vigente = false
    }
  }, [cargar, intento])

  const reintentar = useCallback(() => setIntento((n) => n + 1), [])

  // El resultado guardado solo vale si corresponde a la carga actual.
  const vigente = resultado.fuente === cargar && resultado.intento === intento
  if (!vigente) {
    return { estado: 'cargando', datos: null, error: null, previos, reintentar }
  }
  return { estado: resultado.estado, datos: resultado.datos, error: resultado.error, previos, reintentar }
}
