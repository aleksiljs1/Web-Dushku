// Line drawing of a lounge corner: the strokes draw in first, then the wood fills fade up.
// Strokes carry .draw, fills carry .fill so the hero timeline can target them.
export default function Armchair({ className = "" }: { className?: string }) {
  const stroke = { stroke: "var(--ink)", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 420 340" className={className} role="img" aria-label="Ilustrim i një kolltuku prej druri me llambë dhe bimë">
      <defs>
        <linearGradient id="oakFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d39a63" />
          <stop offset="1" stopColor="#b47a45" />
        </linearGradient>
        <linearGradient id="cushion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efd3ad" />
          <stop offset="1" stopColor="#ddb98b" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#ffd9a1" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd9a1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* lamp light */}
      <path className="lamp-glow fill" d="M22 92 L86 92 L130 300 L-22 300 Z" fill="url(#glow)" opacity="0" />

      {/* floor */}
      <path className="draw" d="M6 300 H414" {...stroke} strokeWidth={1.6} />

      {/* floor lamp */}
      <path className="draw" d="M54 300 V92" {...stroke} />
      <path className="draw" d="M38 300 H70" {...stroke} />
      <path className="fill" d="M24 92 L84 92 L72 50 L36 50 Z" fill="#f6e7cf" opacity="0" />
      <path className="draw" d="M24 92 L84 92 L72 50 L36 50 Z" {...stroke} fill="none" />

      {/* armchair: back */}
      <path className="fill" d="M128 196 V122 Q128 78 172 78 H262 Q306 78 306 122 V196 Z" fill="url(#oakFill)" opacity="0" />
      <path className="draw" d="M128 196 V122 Q128 78 172 78 H262 Q306 78 306 122 V196" {...stroke} fill="none" />
      <path className="draw" d="M156 104 Q217 92 278 104" {...stroke} strokeWidth={1.4} opacity={0.5} />
      <path className="draw" d="M154 128 Q217 116 280 128" {...stroke} strokeWidth={1.4} opacity={0.5} />
      {/* seat cushion */}
      <rect className="fill" x="118" y="188" width="198" height="40" rx="14" fill="url(#cushion)" opacity="0" />
      <rect className="draw" x="118" y="188" width="198" height="40" rx="14" {...stroke} fill="none" />
      {/* arms */}
      <path className="fill" d="M96 248 V164 Q96 146 114 146 H124 Q134 146 134 158 V248 Z" fill="url(#oakFill)" opacity="0" />
      <path className="draw" d="M96 248 V164 Q96 146 114 146 H124 Q134 146 134 158 V248 Z" {...stroke} fill="none" />
      <path className="fill" d="M338 248 V164 Q338 146 320 146 H310 Q300 146 300 158 V248 Z" fill="url(#oakFill)" opacity="0" />
      <path className="draw" d="M338 248 V164 Q338 146 320 146 H310 Q300 146 300 158 V248 Z" {...stroke} fill="none" />
      {/* base */}
      <rect className="fill" x="104" y="226" width="226" height="24" rx="8" fill="#6b4429" opacity="0" />
      <rect className="draw" x="104" y="226" width="226" height="24" rx="8" {...stroke} fill="none" />
      {/* legs */}
      <path className="draw" d="M124 250 L112 298" {...stroke} strokeWidth={3} />
      <path className="draw" d="M310 250 L322 298" {...stroke} strokeWidth={3} />
      <path className="draw" d="M158 250 L154 288" {...stroke} strokeWidth={2.4} opacity={0.6} />
      <path className="draw" d="M276 250 L280 288" {...stroke} strokeWidth={2.4} opacity={0.6} />
      {/* throw cushion */}
      <g className="throw">
      <path className="fill" d="M196 150 Q216 138 238 150 L242 188 Q218 196 192 188 Z" fill="var(--copper)" opacity="0" />
      <path className="draw" d="M196 150 Q216 138 238 150 L242 188 Q218 196 192 188 Z" {...stroke} fill="none" />
      </g>

      {/* side table with plant */}
      <path className="draw" d="M352 232 H410" {...stroke} />
      <path className="draw" d="M362 232 L356 300 M400 232 L406 300" {...stroke} />
      <path className="fill" d="M368 232 L372 206 H392 L396 232 Z" fill="#d9c3a3" opacity="0" />
      <path className="draw" d="M368 232 L372 206 H392 L396 232 Z" {...stroke} fill="none" />
      <g className="plant">
        <path className="fill" d="M382 206 C368 186 362 170 366 150 C378 166 384 184 382 206 Z" fill="#7d8b5a" opacity="0" />
        <path className="fill" d="M382 206 C394 184 404 172 412 164 C410 184 398 198 382 206 Z" fill="#94a26c" opacity="0" />
        <path className="fill" d="M382 206 C380 182 384 162 392 146 C396 168 392 188 382 206 Z" fill="#6c7a4c" opacity="0" />
        <path className="draw" d="M382 206 C368 186 362 170 366 150 C378 166 384 184 382 206 Z M382 206 C394 184 404 172 412 164 C410 184 398 198 382 206 Z M382 206 C380 182 384 162 392 146 C396 168 392 188 382 206 Z" {...stroke} strokeWidth={1.6} fill="none" />
      </g>
    </svg>
  );
}
