// Hormiga de las páginas de error. Generado desde docs de diseño (Errores).
// variante: "404" | "403" | "401" | "500" | "red"
const VARIANTES = {
  "404": (
    <>
      <ellipse cx="100" cy="168" rx="60" ry="6" fill="var(--border)"></ellipse>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M90 132 L78 162"></path><path d="M100 136 L100 164"></path><path d="M110 132 L124 160"></path></g>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M120 62 Q112 38 98 32"></path><path d="M144 60 Q152 36 168 30"></path></g><circle cx="98" cy="32" r="6" fill="#FFC233"></circle><circle cx="168" cy="30" r="6" fill="#FFC233"></circle>
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6"></ellipse><ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0"></ellipse>
      <path d="M46 92 Q42 68 60 60 Q78 68 74 92 Q60 99 46 92 Z" fill="#FFC233" stroke="var(--bg)" strokeWidth="3"></path>
      <circle cx="100" cy="122" r="16" fill="#1250AA"></circle><circle cx="132" cy="92" r="34" fill="#1766D6"></circle>
      <ellipse cx="121" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><ellipse cx="145" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><circle cx="118" cy="88" r="5" fill="#101828"></circle><circle cx="142" cy="88" r="5" fill="#101828"></circle><circle cx="120" cy="85" r="1.8" fill="#FFFFFF"></circle><circle cx="144" cy="85" r="1.8" fill="#FFFFFF"></circle>
      <ellipse cx="134" cy="108" rx="4" ry="5" fill="#101828"></ellipse>
      <text x="176" y="58" fontFamily="Figtree, sans-serif" fontSize="40" fontWeight="600" fill="var(--text-3)">?</text>
    </>
  ),
  "403": (
    <>
      <ellipse cx="100" cy="168" rx="60" ry="6" fill="var(--border)"></ellipse>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M90 132 L78 162"></path><path d="M100 136 L100 164"></path><path d="M110 132 L124 160"></path></g>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M120 62 Q112 38 98 32"></path><path d="M144 60 Q152 36 168 30"></path></g><circle cx="98" cy="32" r="6" fill="#FFC233"></circle><circle cx="168" cy="30" r="6" fill="#FFC233"></circle>
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6"></ellipse><ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0"></ellipse>
      <path d="M46 92 Q42 68 60 60 Q78 68 74 92 Q60 99 46 92 Z" fill="#FFC233" stroke="var(--bg)" strokeWidth="3"></path>
      <circle cx="100" cy="122" r="16" fill="#1250AA"></circle><circle cx="132" cy="92" r="34" fill="#1766D6"></circle>
      <ellipse cx="121" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><ellipse cx="145" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><circle cx="123" cy="90" r="5" fill="#101828"></circle><circle cx="147" cy="90" r="5" fill="#101828"></circle><circle cx="125" cy="87" r="1.8" fill="#FFFFFF"></circle><circle cx="149" cy="87" r="1.8" fill="#FFFFFF"></circle>
      <path d="M128 108 L140 108" stroke="#101828" strokeWidth="3" fill="none" strokeLinecap="round"></path>
      <g transform="translate(176,108)"><rect x="-14" y="0" width="28" height="22" rx="4" fill="var(--text-3)"></rect><path d="M-8 0 V-7 a8 8 0 0 1 16 0 V0" stroke="var(--text-3)" strokeWidth="4" fill="none"></path></g>
    </>
  ),
  "401": (
    <>
      <ellipse cx="100" cy="168" rx="60" ry="6" fill="var(--border)"></ellipse>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M90 132 L78 162"></path><path d="M100 136 L100 164"></path><path d="M110 132 L124 160"></path></g>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M120 62 Q112 38 98 32"></path><path d="M144 60 Q152 36 168 30"></path></g><circle cx="98" cy="32" r="6" fill="#FFC233"></circle><circle cx="168" cy="30" r="6" fill="#FFC233"></circle>
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6"></ellipse><ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0"></ellipse>
      <path d="M46 92 Q42 68 60 60 Q78 68 74 92 Q60 99 46 92 Z" fill="#FFC233" stroke="var(--bg)" strokeWidth="3"></path>
      <circle cx="100" cy="122" r="16" fill="#1250AA"></circle><circle cx="132" cy="92" r="34" fill="#1766D6"></circle>
      <g stroke="#101828" strokeWidth="3.5" strokeLinecap="round" fill="none"><path d="M113 89 Q121 95 129 89"></path><path d="M137 89 Q145 95 153 89"></path></g>
      <path d="M128 108 L140 108" stroke="#101828" strokeWidth="3" fill="none" strokeLinecap="round"></path>
      <g fontFamily="Figtree, sans-serif" fontWeight="600" fill="var(--text-3)"><text x="168" y="64" fontSize="22">z</text><text x="184" y="44" fontSize="28">z</text></g>
    </>
  ),
  "500": (
    <>
      <ellipse cx="100" cy="168" rx="60" ry="6" fill="var(--border)"></ellipse>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M90 132 L78 162"></path><path d="M100 136 L100 164"></path><path d="M110 132 L124 160"></path></g>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M120 62 Q112 38 98 32"></path><path d="M144 60 Q152 36 168 30"></path></g><circle cx="98" cy="32" r="6" fill="#FFC233"></circle><circle cx="168" cy="30" r="6" fill="#FFC233"></circle>
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6"></ellipse><ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0"></ellipse>
      <path d="M46 92 Q42 68 60 60 Q78 68 74 92 Q60 99 46 92 Z" fill="#FFC233" stroke="var(--bg)" strokeWidth="3"></path>
      <circle cx="100" cy="122" r="16" fill="#1250AA"></circle><circle cx="132" cy="92" r="34" fill="#1766D6"></circle>
      <ellipse cx="121" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><ellipse cx="145" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><circle cx="123" cy="85" r="5" fill="#101828"></circle><circle cx="147" cy="85" r="5" fill="#101828"></circle><circle cx="125" cy="82" r="1.8" fill="#FFFFFF"></circle><circle cx="149" cy="82" r="1.8" fill="#FFFFFF"></circle>
      <path d="M127 110 Q134 104 141 110" stroke="#101828" strokeWidth="3" fill="none" strokeLinecap="round"></path>
      <path d="M168 62 Q174 72 168 78 Q162 72 168 62 Z" fill="#9EC2F2"></path>
    </>
  ),
  "red": (
    <>
      <ellipse cx="100" cy="168" rx="60" ry="6" fill="var(--border)"></ellipse>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M90 132 L78 162"></path><path d="M100 136 L100 164"></path><path d="M110 132 L124 160"></path></g>
      <g stroke="#1250AA" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M118 62 Q100 52 94 76"></path><path d="M146 60 Q166 50 172 74"></path></g><circle cx="94" cy="78" r="6" fill="#FFC233"></circle><circle cx="172" cy="76" r="6" fill="#FFC233"></circle>
      <ellipse cx="62" cy="118" rx="34" ry="30" fill="#1766D6"></ellipse><ellipse cx="50" cy="106" rx="10" ry="6" fill="#5B9BF0"></ellipse>
      <path d="M46 92 Q42 68 60 60 Q78 68 74 92 Q60 99 46 92 Z" fill="#FFC233" stroke="var(--bg)" strokeWidth="3"></path>
      <circle cx="100" cy="122" r="16" fill="#1250AA"></circle><circle cx="132" cy="92" r="34" fill="#1766D6"></circle>
      <ellipse cx="121" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><ellipse cx="145" cy="88" rx="9" ry="11" fill="#FFFFFF"></ellipse><circle cx="123" cy="90" r="5" fill="#101828"></circle><circle cx="147" cy="90" r="5" fill="#101828"></circle><circle cx="125" cy="87" r="1.8" fill="#FFFFFF"></circle><circle cx="149" cy="87" r="1.8" fill="#FFFFFF"></circle>
      <path d="M127 110 Q134 104 141 110" stroke="#101828" strokeWidth="3" fill="none" strokeLinecap="round"></path>
      <g stroke="var(--text-3)" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M182 40 l12 12 M194 40 l-12 12"></path></g>
    </>
  ),
};

export default function HormigaError({ variante = "404", ancho = 240 }) {
  return (
    <svg viewBox="0 0 220 180" width={ancho} height={Math.round(ancho * 180 / 220)} aria-hidden="true">
      {VARIANTES[variante] || VARIANTES["404"]}
    </svg>
  );
}