import { useState } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { solicitarCodigo } from '../../api/auth'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Campo from '../../components/Campo'
import { erroresDeSolicitar, validarCorreo } from './recuperacion'

// Paso 1: pide el código. alEnviar(correo) pasa al paso 2.
export default function PasoCorreo({ correoInicial, refCorreo, alEnviar }) {
  const [correo, setCorreo] = useState(correoInicial)
  const [error, setError] = useState(undefined)
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function cambiar(e) {
    setCorreo(e.target.value)
    setError(undefined)
    setAviso(null)
  }

  async function enviar(e) {
    e.preventDefault()
    if (enviando) return

    const limpio = correo.trim()
    const errorCorreo = validarCorreo(limpio)
    if (errorCorreo) {
      setError(errorCorreo)
      refCorreo.current?.focus()
      return
    }

    setAviso(null)
    setEnviando(true)
    try {
      await solicitarCodigo(limpio)
      alEnviar(limpio)
    } catch (err) {
      const errores = erroresDeSolicitar(err)
      setError(errores.correo)
      setAviso(errores.aviso ?? null)
      setEnviando(false)
    }
  }

  return (
    <>
      <p className="recuperar__paso">Paso 1 de 2</p>
      <h1 className="login__titulo">¿Olvidaste tu contraseña?</h1>
      <p className="login__descripcion">
        Escribe el correo de tu cuenta y te enviamos un código de 6 dígitos.
      </p>

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
          onChange={cambiar}
          error={error}
        />

        {aviso && <Aviso tipo="error">{aviso}</Aviso>}

        <Boton type="submit" tamano="grande" className="recuperar__boton" cargando={enviando}>
          Enviar código
        </Boton>
      </form>

      <div className="recuperar__volver">
        <Boton variante="enlace" to="/login" icono={ArrowLeft}>
          Volver a iniciar sesión
        </Boton>
      </div>
    </>
  )
}
