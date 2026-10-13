import './HormigaVacia.css'

// Estado vacío: la mascota junto a un plato vacío, con título y texto debajo.
// La sombra y el plato usan variables para verse bien en tema oscuro.
export default function HormigaVacia({ titulo, texto, children }) {
  return (
    <div className="hormiga-vacia">
      <svg
        className="hormiga-vacia__dibujo"
        viewBox="0 0 200 180"
        width="160"
        height="144"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="110" cy="168" rx="80" ry="6" fill="var(--border)" />
        <g transform="translate(-22,14) scale(0.85)">
          <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M90 132 L78 162" />
            <path d="M100 136 L100 164" />
            <path d="M110 132 L124 160" />
            <path d="M120 62 Q112 38 98 32" />
            <path d="M144 60 Q152 36 168 30" />
          </g>
          <circle cx="98" cy="32" r="6" fill="#FFC233" />
          <circle cx="168" cy="30" r="6" fill="#FFC233" />
          <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6" />
          <ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0" />
          <circle cx="100" cy="122" r="16" fill="#1250AA" />
          <circle cx="132" cy="92" r="34" fill="#1766D6" />
          <ellipse cx="121" cy="88" rx="9" ry="11" fill="#fff" />
          <ellipse cx="145" cy="88" rx="9" ry="11" fill="#fff" />
          <circle cx="125" cy="93" r="5" fill="#101828" />
          <circle cx="149" cy="93" r="5" fill="#101828" />
          <path
            d="M128 108 Q134 106 140 108"
            stroke="#101828"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <path d="M138 140 Q140 162 165 164 Q190 162 192 140 Z" fill="var(--border-strong)" />
        <ellipse
          cx="165"
          cy="140"
          rx="27"
          ry="6"
          fill="var(--border)"
          stroke="var(--border-strong)"
          strokeWidth="2"
        />
      </svg>
      {titulo && <p className="hormiga-vacia__titulo">{titulo}</p>}
      {texto && <p className="hormiga-vacia__texto">{texto}</p>}
      {children}
    </div>
  )
}
