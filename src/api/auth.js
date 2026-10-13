import { api } from './cliente'

// Devuelve { access, refresh, usuario }. No guarda nada: eso lo decide la sesión.
export async function login(correo, contrasena) {
  const { data } = await api.post('auth/login/', { correo, contrasena })
  return data
}

// Envía un código de 6 dígitos al correo. Responde lo mismo exista o no la cuenta.
export async function solicitarCodigo(correo) {
  const { data } = await api.post('auth/recuperar/solicitar/', { correo })
  return data
}

// Cambia la contraseña con el código. El backend cierra la sesión en todos los dispositivos.
export async function confirmarRecuperacion({ correo, codigo, contrasenaNueva }) {
  const { data } = await api.post('auth/recuperar/confirmar/', {
    correo,
    codigo,
    contrasena_nueva: contrasenaNueva,
  })
  return data
}
