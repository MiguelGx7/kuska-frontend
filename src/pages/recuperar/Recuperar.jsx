import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, Clock, KeyRound, LogOut } from 'lucide-react'
import { useSesion } from '../../auth/useSesion'
import Boton from '../../components/Boton'
import BotonTema from '../../components/BotonTema'
import Hormiga from '../../components/Hormiga'
import PasoCodigo from './PasoCodigo'
import PasoCorreo from './PasoCorreo'
import '../Login.css'
import './Recuperar.css'

// Mismo layout que el Login: reutiliza sus clases (login__…) para el panel azul y la zona del formulario.
const DATOS = [
  { icono: Clock, texto: 'El código vence en 15 minutos' },
  { icono: KeyRound, texto: 'Solo sirve el último código que pidas' },
  { icono: LogOut, texto: 'Al cambiarla, se cierra tu sesión en todos tus dispositivos' },
]

function PasoListo({ refTitulo }) {
  return (
    <div className="recuperar__listo">
      <span className="recuperar__listo-icono" aria-hidden="true">
        <Check size={32} strokeWidth={2.5} />
      </span>
      <h1 ref={refTitulo} tabIndex={-1} className="login__titulo">
        Tu contraseña cambió
      </h1>
      <p className="login__descripcion">
        Por seguridad cerramos tu sesión en todos tus dispositivos. Inicia sesión con la contraseña
        nueva.
      </p>
      <Boton to="/login" tamano="grande" className="recuperar__boton">
        Ir a iniciar sesión
      </Boton>
    </div>
  )
}

export default function Recuperar() {
  const location = useLocation()
  const { olvidarSesion } = useSesion()

  // paso: 'correo' | 'codigo' | 'listo'. El correo puede venir escrito desde el Login.
  const [paso, setPaso] = useState('correo')
  const [correo, setCorreo] = useState(() => location.state?.correo ?? '')

  // Al cambiar de paso, el foco va a lo primero que hay que llenar (o al título al terminar).
  const refCorreo = useRef(null)
  const refCodigo = useRef(null)
  const refListo = useRef(null)
  const montado = useRef(false)

  useEffect(() => {
    if (!montado.current) {
      montado.current = true
      return
    }
    const destino = { correo: refCorreo, codigo: refCodigo, listo: refListo }[paso]
    destino.current?.focus()
  }, [paso])

  function alEnviarCodigo(correoEnviado) {
    setCorreo(correoEnviado)
    setPaso('codigo')
  }

  function alCambiarContrasena() {
    // El backend ya cerró las sesiones; aquí se borra la de este navegador si la había.
    olvidarSesion()
    setPaso('listo')
  }

  return (
    <div className="login">
      <section className="login__marca" aria-hidden="true">
        <div className="login__marca-contenido">
          <div className="login__mascota">
            <Hormiga tamano={150} />
          </div>
          <h2 className="login__marca-titulo">Recupera tu acceso</h2>
          <p className="login__marca-subtitulo">
            Te enviamos un código a tu correo para que crees una contraseña nueva.
          </p>
          <ul className="login__beneficios">
            {DATOS.map(({ icono: Icono, texto }) => (
              <li key={texto}>
                <span className="login__check">
                  <Icono size={14} strokeWidth={2.5} />
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

          {paso === 'correo' && (
            <PasoCorreo correoInicial={correo} refCorreo={refCorreo} alEnviar={alEnviarCodigo} />
          )}
          {paso === 'codigo' && (
            <PasoCodigo
              correo={correo}
              refCodigo={refCodigo}
              alCambiarCorreo={() => setPaso('correo')}
              alCambiar={alCambiarContrasena}
            />
          )}
          {paso === 'listo' && <PasoListo refTitulo={refListo} />}
        </div>
      </main>
    </div>
  )
}
