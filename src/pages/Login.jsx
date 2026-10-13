import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Check, Lock, Mail } from 'lucide-react'
import { obtenerMensajeError } from '../api/errores'
import { useSesion } from '../auth/useSesion'
import Aviso from '../components/Aviso'
import Boton from '../components/Boton'
import BotonTema from '../components/BotonTema'
import Campo from '../components/Campo'
import Hormiga from '../components/Hormiga'
import './Login.css'

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ESPERA_429_MS = 60_000

const BENEFICIOS = [
  'Valida donaciones con su foto',
  'Aprueba solicitudes y registra entregas',
  'Revisa novedades y sanciones',
]

function validar(correo, contrasena) {
  const errores = {}
  if (!correo) {
    errores.correo = 'Escribe tu correo.'
  } else if (!REGEX_CORREO.test(correo)) {
    errores.correo = 'Revisa el correo: debe tener la forma nombre@correo.com.'
  }
  if (!contrasena) {
    errores.contrasena = 'Escribe tu contraseña.'
  }
  return errores
}

// Traduce el error del login al título y texto del aviso.
function avisoDeError(error) {
  if (error?.codigo === 'ROL_NO_ADMIN') {
    return { titulo: 'Esta cuenta no es de administrador', texto: error.message }
  }

  const status = error?.response?.status

  if ((error?.isAxiosError && !error.response) || status >= 500) {
    return { titulo: 'No pudimos conectar', texto: 'Revisa tu conexión e intenta de nuevo.' }
  }
  if (status === 429) {
    return { titulo: 'Hiciste muchos intentos', texto: 'Espera un minuto y vuelve a intentarlo.' }
  }
  if (status === 403) {
    return { titulo: 'No puedes entrar con esta cuenta', texto: obtenerMensajeError(error) }
  }
  return { titulo: 'No pudimos iniciar sesión', texto: obtenerMensajeError(error) }
}

function rutaDestino(desde) {
  if (!desde?.pathname || desde.pathname === '/login') return '/'
  return `${desde.pathname}${desde.search ?? ''}${desde.hash ?? ''}`
}

export default function Login() {
  const { autenticado, iniciarSesion } = useSesion()
  const location = useLocation()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)

  const refCorreo = useRef(null)
  const refContrasena = useRef(null)
  const temporizador = useRef(null)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  // Cubre los dos casos: ya había sesión, o se acaba de iniciar.
  if (autenticado) {
    return <Navigate to={rutaDestino(location.state?.desde)} replace />
  }

  function bloquearUnMinuto() {
    setBloqueado(true)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setBloqueado(false), ESPERA_429_MS)
  }

  function cambiarCorreo(e) {
    setCorreo(e.target.value)
    setErrores((actuales) => ({ ...actuales, correo: undefined }))
    setAviso(null)
  }

  function cambiarContrasena(e) {
    setContrasena(e.target.value)
    setErrores((actuales) => ({ ...actuales, contrasena: undefined }))
    setAviso(null)
  }

  async function enviar(e) {
    e.preventDefault()
    if (enviando || bloqueado) return

    const correoLimpio = correo.trim()
    const nuevosErrores = validar(correoLimpio, contrasena)
    setErrores(nuevosErrores)

    if (nuevosErrores.correo) {
      refCorreo.current?.focus()
      return
    }
    if (nuevosErrores.contrasena) {
      refContrasena.current?.focus()
      return
    }

    setAviso(null)
    setEnviando(true)
    try {
      await iniciarSesion(correoLimpio, contrasena)
    } catch (error) {
      setAviso(avisoDeError(error))
      if (error?.response?.status === 429) bloquearUnMinuto()
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <section className="login__marca" aria-hidden="true">
        <div className="login__marca-contenido">
          <div className="login__mascota">
            <Hormiga tamano={150} />
          </div>
          <h2 className="login__marca-titulo">Panel de administración</h2>
          <p className="login__marca-subtitulo">Cuida que la comida llegue a quien la necesita.</p>
          <ul className="login__beneficios">
            {BENEFICIOS.map((texto) => (
              <li key={texto}>
                <span className="login__check">
                  <Check size={14} strokeWidth={3} />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="login__zona">
        <BotonTema className="login__tema" />

        <div className="login__caja">
          <div className="login__logo">
            <img src="/favicon.svg" alt="" width="36" height="36" />
            <span>Kumora</span>
          </div>

          <h1 className="login__titulo">Inicia sesión</h1>
          <p className="login__descripcion">Solo para administradores de Kumora.</p>

          <form className="login__formulario" onSubmit={enviar} noValidate>
            <Campo
              ref={refCorreo}
              etiqueta="Correo"
              icono={Mail}
              type="email"
              name="correo"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={correo}
              onChange={cambiarCorreo}
              error={errores.correo}
            />

            <Campo
              ref={refContrasena}
              etiqueta="Contraseña"
              icono={Lock}
              type="password"
              name="contrasena"
              autoComplete="current-password"
              value={contrasena}
              onChange={cambiarContrasena}
              error={errores.contrasena}
            />

            <div className="login__olvido">
              {/* Si ya escribió el correo, Recuperar lo trae puesto. */}
              <Boton
                variante="enlace"
                to="/recuperar"
                state={correo.trim() ? { correo: correo.trim() } : undefined}
              >
                ¿Olvidaste tu contraseña?
              </Boton>
            </div>

            {aviso && (
              <Aviso tipo="error" titulo={aviso.titulo}>
                {aviso.texto}
              </Aviso>
            )}

            <Boton
              type="submit"
              tamano="grande"
              className="login__enviar"
              cargando={enviando}
              disabled={bloqueado}
            >
              {bloqueado ? 'Espera un minuto' : 'Iniciar sesión'}
            </Boton>
          </form>

          <p className="login__pie">¿Eres donante o beneficiario? Usa la app de Kumora.</p>
        </div>
      </main>
    </div>
  )
}
