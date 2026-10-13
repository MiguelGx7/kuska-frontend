// Textos compartidos de Categorías.

export function toastActivacion(nombre, activa) {
  return activa
    ? `«${nombre}» activa otra vez.`
    : `«${nombre}» inactiva. Ya no aparece al registrar alimentos.`
}
