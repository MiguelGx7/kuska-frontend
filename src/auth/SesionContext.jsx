import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { borrarSesion, guardarTokens, guardarUsuario, obtenerUsuarioGuardado } from '../api/cliente'
import { SesionContext } from './contexto'
import { nombreCompleto, ROL_ADMIN } from './usuario'

const MENSAJE_SOLO_ADMIN =
  'El panel es solo para administradores. Si eres donante o beneficiario, usa la app de Kumora.'

export function SesionProvider({ children }) {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado)

  const iniciarSesion = useCallback(async (correo, contrasena) => {
    const { access, refresh, usuario: datosUsuario } = await login(correo, contrasena)

    // Los tokens de otros roles se descartan sin guardarse.
    if (datosUsuario?.rol !== ROL_ADMIN) {
      const error = new Error(MENSAJE_SOLO_ADMIN)
      error.codigo = 'ROL_NO_ADMIN'
      throw error
    }

    guardarTokens({ access, refresh })
    guardarUsuario(datosUsuario)
    setUsuario(datosUsuario)
    return datosUsuario
  }, [])

  // Borra la sesión de este navegador sin navegar (p. ej. tras recuperar la contraseña).
  const olvidarSesion = useCallback(() => {
    borrarSesion()
    setUsuario(null)
  }, [])

  // El backend no tiene endpoint de logout: basta con borrar los tokens.
  const cerrarSesion = useCallback(() => {
    olvidarSesion()
    navigate('/login', { replace: true })
  }, [navigate, olvidarSesion])

  const valor = useMemo(
    () => ({
      usuario,
      nombre: nombreCompleto(usuario),
      autenticado: usuario?.rol === ROL_ADMIN,
      iniciarSesion,
      cerrarSesion,
      olvidarSesion,
    }),
    [usuario, iniciarSesion, cerrarSesion, olvidarSesion],
  )

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>
}
