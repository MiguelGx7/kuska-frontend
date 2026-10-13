// Enlaces de contacto para números de Colombia (+57).

// Deja solo los dígitos y quita un 57 inicial si ya viene, para no armar +5757…
export function digitosTelefono(telefono) {
  let digitos = (telefono ?? '').replace(/\D/g, '')
  if (digitos.length === 12 && digitos.startsWith('57')) digitos = digitos.slice(2)
  return digitos
}

export function enlaceLlamar(telefono) {
  const digitos = digitosTelefono(telefono)
  return digitos ? `tel:+57${digitos}` : null
}

// Solo los celulares (empiezan por 3) tienen WhatsApp.
export function enlaceWhatsApp(telefono) {
  const digitos = digitosTelefono(telefono)
  return digitos.startsWith('3') ? `https://wa.me/57${digitos}` : null
}

export function enlaceCorreo(correo, asunto) {
  if (!correo) return null
  return `mailto:${correo}?subject=${encodeURIComponent(asunto)}`
}
