import { api } from './cliente'

// Devuelve { access, refresh, usuario }. No guarda nada: eso lo decide la sesión.
export async function login(correo, contrasena) {
  const { data } = await api.post('auth/login/', { correo, contrasena })
  return data
}
