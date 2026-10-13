import { useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { confirmarRecuperacion, solicitarCodigo } from '../../api/auth'
import Aviso from '../../components/Aviso'
import Boton from '../../components/Boton'
import Campo from '../../components/Campo'
import {
  ESPERA_REENVIO_S,
  erroresDeConfirmar,
  erroresDeSolicitar,
  LARGO_CODIGO,
  limpiarCodigo,
  validarCambio,
} from './recuperacion'

// Paso 2: código + contraseña nueva. alCambiar() pasa a la pantalla de listo.
export default function PasoCodigo({ correo, refCodigo, alCambiarCorreo, alCambiar }) {
  const [codigo, setCodigo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [repetida, setRepetida] = useState('')
  const [errores, setErrores] = useState({})
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // "Enviar otro código": tras usarlo queda deshabilitado ESPERA_REENVIO_S segundos.
  const [reenviando, setReenviando] = useState(false)
  const [reenviado, setReenviado] = useState(false)
  const [segundos, setSegundos] = useState(0)

  const refContrasena = useRef(null)
  const refRepetida = useRef(null)

  useEffect(() => {
    if (segundos <= 0) return
    const temporizador = setTimeout(() => setSegundos((s) => s - 1), 1000)
    return () => clearTimeout(temporizador)
  }, [segundos])

  // Cada campo limpia su error al escribir; el aviso de arriba se va con cualquier cambio.
  function alEscribir(campo, setValor, valor) {
    setValor(valor)
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }))
    setAviso(null)
  }

  async function reenviar() {
    if (reenviando || segundos > 0) return
    setAviso(null)
    setReenviado(false)
    setReenviando(true)
    try {
      await solicitarCodigo(correo)
      setReenviado(true)
      setSegundos(ESPERA_REENVIO_S)
    } catch (error) {
      setAviso(erroresDeSolicitar(error).aviso ?? 'No pudimos enviar otro código. Intenta de nuevo.')
    } finally {
      setReenviando(false)
    }
  }

  async function enviar(e) {
    e.preventDefault()
    if (enviando) return

    const nuevos = validarCambio({ codigo, contrasena, repetida })
    setErrores(nuevos)
    if (nuevos.codigo) return refCodigo.current?.focus()
    if (nuevos.contrasena) return refContrasena.current?.focus()
    if (nuevos.repetida) return refRepetida.current?.focus()

    setAviso(null)
    setEnviando(true)
    try {
      await confirmarRecuperacion({ correo, codigo, contrasenaNueva: contrasena })
      alCambiar()
    } catch (error) {
      const deApi = erroresDeConfirmar(error)
      setErrores({ contrasena: deApi.contrasena })
      setAviso(deApi.aviso ?? null)
      if (deApi.contrasena && !deApi.aviso) refContrasena.current?.focus()
      setEnviando(false)
    }
  }

  return (
    <>
      <p className="recuperar__paso">Paso 2 de 2</p>
      <h1 className="login__titulo">Revisa tu correo</h1>
      <p className="login__descripcion">
        Si <strong className="recuperar__correo">{correo}</strong> está registrado, te enviamos un
        código.{' '}
        <Boton variante="enlace" className="recuperar__cambiar" onClick={alCambiarCorreo}>
          Cambiar correo
        </Boton>
      </p>

      <form className="login__formulario" onSubmit={enviar} noValidate>
        {aviso && <Aviso tipo="error">{aviso}</Aviso>}

        <div className="recuperar__codigo">
          <Campo
            ref={refCodigo}
            className="recuperar-codigo"
            etiqueta="Código de 6 dígitos"
            name="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={LARGO_CODIGO}
            value={codigo}
            onChange={(e) => alEscribir('codigo', setCodigo, limpiarCodigo(e.target.value))}
            error={errores.codigo}
          />
          <div className="recuperar__vence">
            <span>Vence en 15 minutos.</span>
            <Boton
              variante="enlace"
              className="recuperar__reenviar"
              onClick={reenviar}
              cargando={reenviando}
              disabled={segundos > 0}
            >
              {segundos > 0 ? `Puedes pedir otro en ${segundos} s` : 'Enviar otro código'}
            </Boton>
          </div>
          <p className="recuperar__reenviado" role="status">
            {reenviado && 'Te enviamos otro código. El anterior ya no sirve.'}
          </p>
        </div>

        <Campo
          ref={refContrasena}
          etiqueta="Contraseña nueva"
          icono={Lock}
          type="password"
          name="contrasena_nueva"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          ayuda="No uses solo números, una contraseña común ni algo parecido a tu nombre o correo."
          value={contrasena}
          onChange={(e) => alEscribir('contrasena', setContrasena, e.target.value)}
          error={errores.contrasena}
        />

        <Campo
          ref={refRepetida}
          etiqueta="Repite la contraseña"
          icono={Lock}
          type="password"
          name="repetir_contrasena"
          autoComplete="new-password"
          value={repetida}
          onChange={(e) => alEscribir('repetida', setRepetida, e.target.value)}
          error={errores.repetida}
        />

        <Boton type="submit" tamano="grande" className="recuperar__boton" cargando={enviando}>
          Cambiar contraseña
        </Boton>
      </form>
    </>
  )
}
