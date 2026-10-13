import PaginaError from './PaginaError'

// Página 500. La usan la ruta /error, el Error Boundary y el errorElement del router.
export default function PaginaErrorServidor({ sinFranja = false }) {
  return (
    <PaginaError
      variante="500"
      codigo="ERROR 500"
      titulo="Algo falló de nuestro lado"
      texto="No es tu culpa. Intenta de nuevo en unos minutos. Lo que ya habías guardado está a salvo."
      acciones={[
        { texto: 'Ir al inicio', variante: 'secundario', to: '/' },
        { texto: 'Reintentar', variante: 'principal', onClick: () => window.location.reload() },
      ]}
      nota="Si sigue pasando, revisa que el servidor y la base de datos estén encendidos."
      sinFranja={sinFranja}
    />
  )
}
