import BotonesContacto from '../../components/BotonesContacto'
import Tarjeta from '../../components/Tarjeta'
import { fechaRelativa } from '../../utils/fechas'
import { documento, esNegocio, nombrePersona } from './usuario'

export default function DatosUsuario({ usuario }) {
  const donante = usuario.rol === 'Donante'
  const negocio = esNegocio(usuario)

  const filas = [
    ['Correo', usuario.correo, true],
    ['Teléfono', usuario.telefono],
    ['Documento', documento(usuario)],
    ['Dirección', usuario.direccion],
    ...(negocio ? [['Persona a cargo', nombrePersona(usuario)]] : []),
    ...(donante ? [['Tipo', usuario.tipo_donante]] : []),
    ...(negocio
      ? [
          ['Negocio', usuario.nombre_negocio],
          ['NIT', usuario.nit],
        ]
      : []),
    ['Último ingreso', usuario.last_login ? fechaRelativa(usuario.last_login) : 'Nunca'],
    ['Registro', fechaRelativa(usuario.fecha_registro)],
  ]

  return (
    <Tarjeta titulo="Datos">
      <dl className="ficha">
        {filas.map(([etiqueta, valor, largo]) => (
          <div key={etiqueta} className="ficha__fila">
            <dt>{etiqueta}</dt>
            <dd className={largo ? 'datos__correo' : undefined}>{valor || '—'}</dd>
          </div>
        ))}
      </dl>
      <BotonesContacto telefono={usuario.telefono} correo={usuario.correo} asunto="Kumora" />
    </Tarjeta>
  )
}
