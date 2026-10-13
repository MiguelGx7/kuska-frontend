import { Component } from 'react'
import PaginaErrorServidor from './PaginaErrorServidor'

// Error Boundary: si un componente hijo falla al renderizar, muestra la página 500
// en vez de dejar la pantalla en blanco. Los errores de la API no pasan por aquí:
// cada sección los muestra con su Aviso y "Reintentar".
// Para limpiarlo al navegar, quien lo usa le pone una key (p. ej. la ruta).
export default class LimiteError extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Queda en la consola para poder depurarlo.
    console.error('Error al mostrar la pantalla:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return <PaginaErrorServidor sinFranja={this.props.sinFranja} />
    }
    return this.props.children
  }
}
