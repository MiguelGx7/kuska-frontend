import { Mail, MessageCircle, Phone } from 'lucide-react'
import { enlaceCorreo, enlaceLlamar, enlaceWhatsApp } from '../utils/contacto'
import Boton from './Boton'

// Llamar / WhatsApp (solo celulares) / Correo. Si no hay datos, ese botón no aparece.
export default function BotonesContacto({ telefono, correo, asunto }) {
  const llamar = enlaceLlamar(telefono)
  const whatsapp = enlaceWhatsApp(telefono)
  const escribir = enlaceCorreo(correo, asunto)

  if (!llamar && !whatsapp && !escribir) return null

  return (
    <div className="botones-contacto">
      {llamar && (
        <Boton variante="secundario" tamano="pequeno" icono={Phone} href={llamar}>
          Llamar
        </Boton>
      )}
      {whatsapp && (
        <Boton
          variante="secundario"
          tamano="pequeno"
          icono={MessageCircle}
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </Boton>
      )}
      {escribir && (
        <Boton variante="secundario" tamano="pequeno" icono={Mail} href={escribir}>
          Correo
        </Boton>
      )}
    </div>
  )
}
