import React from 'react';

interface Props {
  visualKey: string;
  phaseId: number;
  compact?: boolean;
}

export const PhaseIllustration: React.FC<Props> = ({ visualKey, phaseId, compact = false }) => {
  const sizeClass = compact ? 'h-32 w-full' : 'h-56 sm:h-64 w-full';

  const renderScene = () => {
    switch (visualKey) {
      case 'reception':
        return (
          <g>
            {/* Platform & Flour Sacks */}
            <rect x="35" y="135" width="230" height="14" rx="3" fill="#475569" />
            <rect x="55" y="90" width="60" height="45" rx="6" fill="#F3E5AB" stroke="#B45309" strokeWidth="2" />
            <text x="85" y="116" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350F">HARINA</text>
            <rect x="125" y="98" width="52" height="37" rx="5" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
            <text x="151" y="120" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F">AZÚCAR</text>
            <rect x="185" y="102" width="42" height="33" rx="5" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <text x="206" y="122" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E293B">SAL</text>
            {/* Clipboard */}
            <rect x="225" y="38" width="48" height="62" rx="5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <rect x="239" y="32" width="20" height="10" rx="2" fill="#D97706" />
            <path d="M235 58 L242 65 L256 50" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
            <line x1="235" y1="76" x2="262" y2="76" stroke="#94A3B8" strokeWidth="2" />
            <line x1="235" y1="86" x2="255" y2="86" stroke="#94A3B8" strokeWidth="2" />
          </g>
        );
      case 'storage':
        return (
          <g>
            {/* Shelving unit */}
            <line x1="50" y1="30" x2="50" y2="155" stroke="#334155" strokeWidth="4" />
            <line x1="250" y1="30" x2="250" y2="155" stroke="#334155" strokeWidth="4" />
            <rect x="50" y="65" width="200" height="6" fill="#475569" />
            <rect x="50" y="110" width="200" height="6" fill="#475569" />
            <rect x="50" y="150" width="200" height="6" fill="#475569" />
            {/* Boxes */}
            <rect x="65" y="37" width="46" height="28" rx="4" fill="#F3E5AB" stroke="#B45309" strokeWidth="1.5" />
            <rect x="120" y="37" width="46" height="28" rx="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <rect x="180" y="37" width="52" height="28" rx="4" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
            <text x="206" y="54" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E3A8A">PEPS</text>
            <rect x="65" y="80" width="55" height="30" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <rect x="132" y="80" width="55" height="30" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            {/* Hygrometer badge */}
            <circle cx="220" cy="92" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <text x="220" y="95" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0369A1">&lt;65%</text>
          </g>
        );
      case 'weighing':
        return (
          <g>
            {/* Digital Scale */}
            <rect x="85" y="120" width="130" height="30" rx="6" fill="#334155" />
            <rect x="122" y="127" width="56" height="16" rx="2" fill="#0F172A" />
            <text x="150" y="139" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#34D399">1000 g</text>
            <rect x="105" y="108" width="90" height="10" rx="2" fill="#94A3B8" />
            {/* Bowl with flour */}
            <path d="M100 68 L200 68 L185 108 L115 108 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <path d="M110 68 Q150 38 190 68 Z" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
            {/* Small cups */}
            <rect x="40" y="115" width="32" height="30" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="56" y="134" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#92400E">10g</text>
            <rect x="228" y="115" width="32" height="30" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <text x="244" y="134" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0369A1">580g</text>
          </g>
        );
      case 'mixing':
        return (
          <g>
            {/* Bowl */}
            <path d="M80 75 L220 75 L198 140 L102 140 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="2.5" />
            {/* Rustic Dough */}
            <path d="M105 110 Q125 85 150 96 Q175 82 195 112 Q185 135 150 134 Q115 135 105 110 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
            {/* Spiral hook */}
            <path d="M150 25 L150 65 Q168 78 150 92 Q132 104 148 118" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            {/* Water drops */}
            <circle cx="95" cy="52" r="5" fill="#38BDF8" />
            <circle cx="205" cy="52" r="5" fill="#38BDF8" />
          </g>
        );
      case 'kneading':
        return (
          <g>
            {/* Table */}
            <rect x="30" y="132" width="240" height="12" rx="3" fill="#64748B" />
            {/* Smooth Elastic Dough */}
            <ellipse cx="150" cy="108" rx="68" ry="26" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" />
            {/* Gluten Window / Membrane Badge */}
            <circle cx="150" cy="56" r="30" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeDasharray="4 2" />
            <text x="150" y="53" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400E">RED DE</text>
            <text x="150" y="65" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400E">GLUTEN</text>
            <path d="M85 98 Q70 80 85 68" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M215 98 Q230 80 215 68" fill="none" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case 'fermentation1':
        return (
          <g>
            <path d="M75 80 L225 80 L205 145 L95 145 Z" fill="#E2E8F0" fillOpacity="0.65" stroke="#475569" strokeWidth="2" />
            <g className="animate-dough-rise" style={{ transformOrigin: '150px 135px' }}>
              <path d="M92 120 Q150 45 208 120 Q200 142 150 142 Q100 142 92 120 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              <circle cx="130" cy="105" r="4" fill="#F59E0B" opacity="0.6" />
              <circle cx="165" cy="95" r="5" fill="#F59E0B" opacity="0.6" />
              <circle cx="150" cy="118" r="3.5" fill="#F59E0B" opacity="0.6" />
            </g>
            <text x="150" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">+ CO₂ (26–28 °C)</text>
          </g>
        );
      case 'dividing':
        return (
          <g>
            <rect x="30" y="130" width="240" height="12" rx="3" fill="#64748B" />
            {[65, 118, 171, 224].map((cx, i) => (
              <g key={i}>
                <ellipse cx={cx} cy="116" rx="20" ry="13" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                <text x={cx} y="120" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F">80g</text>
              </g>
            ))}
            {/* Scraper */}
            <rect x="132" y="48" width="36" height="30" rx="2" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
            <rect x="128" y="40" width="44" height="10" rx="4" fill="#1E293B" />
          </g>
        );
      case 'rounding':
        return (
          <g>
            <rect x="30" y="130" width="240" height="12" rx="3" fill="#64748B" />
            {[75, 150, 225].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="108" r="22" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                <path d={`M${cx - 12} 96 A 14 14 0 0 1 ${cx + 12} 96`} fill="none" stroke="#FEF9C3" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ))}
            <path d="M130 60 A 22 22 0 1 1 170 60" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 2" />
            <text x="150" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369A1">Tensión superficial</text>
          </g>
        );
      case 'resting':
        return (
          <g>
            <rect x="30" y="132" width="240" height="10" rx="3" fill="#64748B" />
            {[80, 150, 220].map((cx, i) => (
              <ellipse key={i} cx={cx} cy="116" rx="24" ry="16" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            ))}
            {/* Translucent cover */}
            <path d="M40 132 Q40 72 150 72 Q260 72 260 132 Z" fill="#BAE6FD" fillOpacity="0.35" stroke="#0284C7" strokeWidth="2" strokeDasharray="5 3" />
            <text x="150" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1">Reposo cubierto: 10–15 min</text>
          </g>
        );
      case 'shaping':
        return (
          <g>
            <rect x="40" y="128" width="220" height="10" rx="3" fill="#475569" />
            {[78, 150, 222].map((cx, i) => (
              <g key={i}>
                <rect x={cx - 26} y="102" width="52" height="24" rx="12" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
                <line x1={cx - 14} y1="114" x2={cx + 14} y2="114" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
              </g>
            ))}
            <text x="150" y="65" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400E">Rollos formados (costura abajo)</text>
          </g>
        );
      case 'proofing':
        return (
          <g>
            {/* Proofing cabinet */}
            <rect x="45" y="25" width="210" height="130" rx="8" fill="#FFFBEB" stroke="#334155" strokeWidth="3" />
            <rect x="55" y="118" width="190" height="6" fill="#64748B" />
            <g className="animate-dough-rise" style={{ transformOrigin: '150px 115px' }}>
              {[88, 150, 212].map((cx, i) => (
                <rect key={i} x={cx - 26} y="82" width="52" height="34" rx="17" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
              ))}
            </g>
            <text x="150" y="52" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">28–32 °C | 75–85% HR</text>
          </g>
        );
      case 'scoring':
        return (
          <g>
            <rect x="75" y="88" width="150" height="46" rx="23" fill="#FDE68A" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="220" cy="52" r="20" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
            <text x="220" y="56" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E3A8A">OPC.</text>
            <text x="150" y="156" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350F">Superficie lisa (pan blandito) o brillo leve</text>
          </g>
        );
      case 'baking':
        return (
          <g>
            {/* Oven */}
            <rect x="45" y="26" width="210" height="128" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <rect x="62" y="44" width="176" height="92" rx="4" fill="#7C2D12" />
            {/* Glowing heat */}
            <rect x="68" y="122" width="164" height="6" fill="#475569" />
            {[95, 150, 205].map((cx, i) => (
              <rect key={i} x={cx - 22} y="90" width="44" height="32" rx="16" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            ))}
            <path d="M95 76 Q100 66 95 56" fill="none" stroke="#FBBF24" strokeWidth="2" className="animate-steam" />
            <path d="M150 76 Q155 66 150 56" fill="none" stroke="#FBBF24" strokeWidth="2" className="animate-steam" />
            <path d="M205 76 Q210 66 205 56" fill="none" stroke="#FBBF24" strokeWidth="2" className="animate-steam" />
            <text x="150" y="39" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#FDE68A">180–200 °C | 12–18 min</text>
          </g>
        );
      case 'cooling':
        return (
          <g>
            {/* Cooling rack */}
            <line x1="45" y1="125" x2="255" y2="125" stroke="#475569" strokeWidth="4" />
            <line x1="60" y1="125" x2="60" y2="145" stroke="#475569" strokeWidth="3" />
            <line x1="240" y1="125" x2="240" y2="145" stroke="#475569" strokeWidth="3" />
            {[90, 150, 210].map((cx, i) => (
              <g key={i}>
                <rect x={cx - 24} y="92" width="48" height="32" rx="16" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <path d={`M${cx} 84 Q${cx + 5} 70 ${cx} 58`} fill="none" stroke="#94A3B8" strokeWidth="2" className="animate-steam" />
              </g>
            ))}
            <text x="150" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1">Enfriar hasta &lt; 35 °C</text>
          </g>
        );
      case 'inspection':
        return (
          <g>
            <rect x="85" y="75" width="130" height="54" rx="26" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
            <ellipse cx="150" cy="92" rx="45" ry="9" fill="#F59E0B" opacity="0.45" />
            <circle cx="225" cy="60" r="22" fill="#ECFDF5" stroke="#059669" strokeWidth="3" />
            <path d="M214 60 L222 68 L236 52" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
            <text x="150" y="152" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065F46">Peso, color, miga y conformidad</text>
          </g>
        );
      case 'packaging':
        return (
          <g>
            {/* Bag */}
            <rect x="82" y="42" width="136" height="104" rx="8" fill="#E0F2FE" fillOpacity="0.45" stroke="#0284C7" strokeWidth="2" />
            <rect x="102" y="88" width="96" height="44" rx="22" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            {/* Seal & Label */}
            <line x1="82" y1="62" x2="218" y2="62" stroke="#DC2626" strokeWidth="3" />
            <rect x="115" y="68" width="70" height="22" rx="3" fill="#FFFFFF" stroke="#475569" strokeWidth="1" />
            <text x="150" y="82" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1E293B">LOTE + ALÉRGENO</text>
          </g>
        );
      case 'storage_pt':
        return (
          <g>
            {/* Plastic Crates */}
            <rect x="65" y="95" width="170" height="46" rx="4" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
            <rect x="65" y="44" width="170" height="46" rx="4" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
            <rect x="85" y="56" width="42" height="24" rx="12" fill="#D97706" />
            <rect x="135" y="56" width="42" height="24" rx="12" fill="#D97706" />
            <rect x="185" y="56" width="38" height="24" rx="12" fill="#D97706" />
            <text x="150" y="122" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E3A8A">CANASTILLAS PEPS</text>
          </g>
        );
      default: // distribution
        return (
          <g>
            {/* Delivery Van */}
            <rect x="45" y="58" width="135" height="72" rx="6" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <path d="M180 78 L225 78 L242 102 L242 130 L180 130 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="190" y="86" width="30" height="18" rx="2" fill="#E0F2FE" />
            <circle cx="88" cy="134" r="14" fill="#1E293B" />
            <circle cx="88" cy="134" r="6" fill="#94A3B8" />
            <circle cx="212" cy="134" r="14" fill="#1E293B" />
            <circle cx="212" cy="134" r="6" fill="#94A3B8" />
            <text x="112" y="98" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">PAN ROLLITO</text>
          </g>
        );
    }
  };

  return (
    <div className={`relative rounded-xl border border-[#E7DFD3] bg-gradient-to-br from-[#FFFDF9] to-[#F5EFE6] p-3 flex items-center justify-center overflow-hidden ${sizeClass}`}>
      <span className="absolute top-2.5 left-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1E293B] text-white">
        Fase {phaseId}/18
      </span>
      <svg viewBox="0 0 300 170" className="w-full h-full max-h-56">
        {renderScene()}
      </svg>
    </div>
  );
};
