// Mascota de Kumora. Los colores son fijos: se ve igual en tema claro y oscuro.
export default function Hormiga({ tamano = 160, className }) {
  return (
    <svg
      className={className}
      width={tamano}
      height={(tamano * 180) / 200}
      viewBox="0 0 200 180"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M90 132 L78 162" />
        <path d="M100 136 L100 164" />
        <path d="M110 132 L122 162" />
        <path d="M120 126 Q172 132 182 90" />
        <path d="M120 62 Q112 38 98 32" />
        <path d="M144 60 Q152 36 168 30" />
      </g>
      <circle cx="182" cy="88" r="6" fill="#1250AA" />
      <g stroke="#98A2B3" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M188 72 Q194 78 195 86" />
        <path d="M180 68 Q186 70 189 74" />
      </g>
      <circle cx="98" cy="32" r="6" fill="#FFC233" />
      <circle cx="168" cy="30" r="6" fill="#FFC233" />
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6" />
      <ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0" />
      <circle cx="100" cy="122" r="16" fill="#1250AA" />
      <circle cx="132" cy="92" r="34" fill="#1766D6" />
      <ellipse cx="121" cy="88" rx="9" ry="11" fill="#fff" />
      <ellipse cx="145" cy="88" rx="9" ry="11" fill="#fff" />
      <circle cx="123" cy="89" r="5" fill="#101828" />
      <circle cx="147" cy="89" r="5" fill="#101828" />
      <circle cx="125" cy="86" r="1.8" fill="#fff" />
      <circle cx="149" cy="86" r="1.8" fill="#fff" />
      <path d="M126 104 Q134 116 142 104 Z" fill="#101828" />
    </svg>
  )
}
