import React, { useState } from 'react';
import {
  Wrench,
  Shield,
  Layers,
  Cpu,
  Sliders,
  Play,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  EQUIPMENT_DATA,
  EquipmentCategory,
  EquipmentItem,
} from '../data/equipmentData';
import { PHASES_DATA } from '../data/phasesData';

interface Props {
  onSelectPhase: (phaseIndex: number) => void;
}

const EquipmentSchematicSVG: React.FC<{ iconType: EquipmentItem['iconType'] }> = ({
  iconType,
}) => {
  return (
    <svg
      viewBox="0 0 180 110"
      className="w-full h-32 rounded-xl bg-[#14181F] border border-[#2D3545] p-2"
      role="img"
      aria-label={`Esquema técnico ${iconType}`}
    >
      {/* Subtle blueprint grid */}
      <line x1="0" y1="27" x2="180" y2="27" stroke="#252C3A" strokeWidth="1" />
      <line x1="0" y1="55" x2="180" y2="55" stroke="#252C3A" strokeWidth="1" />
      <line x1="0" y1="82" x2="180" y2="82" stroke="#252C3A" strokeWidth="1" />
      <line x1="45" y1="0" x2="45" y2="110" stroke="#252C3A" strokeWidth="1" />
      <line x1="90" y1="0" x2="90" y2="110" stroke="#252C3A" strokeWidth="1" />
      <line x1="135" y1="0" x2="135" y2="110" stroke="#252C3A" strokeWidth="1" />

      {iconType === 'scale' && (
        <g>
          <rect x="40" y="72" width="100" height="22" rx="4" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="48" y="64" width="84" height="6" rx="2" fill="#CBD5E1" />
          <line x1="125" y1="64" x2="125" y2="26" stroke="#94A3B8" strokeWidth="4" />
          <rect x="104" y="14" width="42" height="20" rx="3" fill="#0F172A" stroke="#C87D20" strokeWidth="1.5" />
          <text x="125" y="28" textAnchor="middle" fontSize="10" fill="#34D399" fontFamily="monospace" fontWeight="bold">1000g</text>
          <path d="M58 64 Q82 36 106 64 Z" fill="#FDE68A" opacity="0.85" />
        </g>
      )}
      {iconType === 'mixer' && (
        <g>
          <rect x="52" y="82" width="76" height="14" rx="3" fill="#475569" />
          <rect x="108" y="20" width="22" height="64" rx="3" fill="#64748B" />
          <rect x="58" y="16" width="72" height="18" rx="4" fill="#94A3B8" />
          <path d="M58 46 L104 46 L96 82 L66 82 Z" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <line x1="81" y1="34" x2="81" y2="66" stroke="#C87D20" strokeWidth="3.5" />
          <circle cx="81" cy="66" r="10" fill="none" stroke="#C87D20" strokeWidth="2.5" />
        </g>
      )}
      {iconType === 'kneader' && (
        <g>
          <rect x="44" y="80" width="92" height="16" rx="4" fill="#334155" />
          <rect x="106" y="18" width="28" height="64" rx="4" fill="#64748B" />
          <rect x="50" y="16" width="84" height="20" rx="4" fill="#CBD5E1" />
          <rect x="52" y="46" width="52" height="34" rx="6" fill="#94A3B8" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M78 36 Q88 50 76 60 Q66 70 80 76" fill="none" stroke="#F4D06F" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="120" cy="26" r="3.5" fill="#10B981" />
          <circle cx="120" cy="38" r="3.5" fill="#EF4444" />
        </g>
      )}
      {iconType === 'proofer' && (
        <g>
          <rect x="46" y="12" width="88" height="86" rx="4" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="54" y="26" width="72" height="64" rx="2" fill="#0F172A" opacity="0.65" />
          <line x1="58" y1="42" x2="122" y2="42" stroke="#F4D06F" strokeWidth="2" />
          <line x1="58" y1="58" x2="122" y2="58" stroke="#F4D06F" strokeWidth="2" />
          <line x1="58" y1="74" x2="122" y2="74" stroke="#F4D06F" strokeWidth="2" />
          <rect x="70" y="15" width="40" height="8" rx="2" fill="#0F172A" />
          <text x="90" y="22" textAnchor="middle" fontSize="7" fill="#38BDF8" fontFamily="monospace" fontWeight="bold">30°C 80%HR</text>
        </g>
      )}
      {iconType === 'divider' && (
        <g>
          <rect x="56" y="42" width="68" height="54" rx="4" fill="#64748B" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="62" y="20" width="56" height="20" rx="4" fill="#94A3B8" />
          <line x1="124" y1="48" x2="144" y2="24" stroke="#F4D06F" strokeWidth="4" strokeLinecap="round" />
          <circle cx="144" cy="24" r="5" fill="#C87D20" />
          <line x1="74" y1="42" x2="74" y2="62" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="90" y1="42" x2="90" y2="62" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="106" y1="42" x2="106" y2="62" stroke="#1E293B" strokeWidth="1.5" />
        </g>
      )}
      {iconType === 'rounder' && (
        <g>
          <rect x="62" y="70" width="56" height="24" rx="3" fill="#475569" />
          <polygon points="50,22 130,22 108,70 72,70" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
          <path d="M70 64 Q90 54 112 46 Q88 38 62 28" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="98" cy="50" r="6" fill="#FDE68A" />
          <circle cx="76" cy="34" r="6" fill="#FDE68A" />
        </g>
      )}
      {iconType === 'table' && (
        <g>
          <rect x="24" y="48" width="132" height="8" rx="2" fill="#CBD5E1" />
          <rect x="82" y="43" width="66" height="5" rx="1" fill="#D4A373" />
          <line x1="34" y1="56" x2="34" y2="94" stroke="#64748B" strokeWidth="4" />
          <line x1="146" y1="56" x2="146" y2="94" stroke="#64748B" strokeWidth="4" />
          <line x1="34" y1="80" x2="146" y2="80" stroke="#475569" strokeWidth="3" />
          <rect x="44" y="38" width="16" height="9" rx="4.5" fill="#FDE68A" />
          <rect x="64" y="38" width="16" height="9" rx="4.5" fill="#FDE68A" />
          <rect x="100" y="38" width="22" height="9" rx="4.5" fill="#F4D06F" />
        </g>
      )}
      {iconType === 'oven' && (
        <g>
          <rect x="40" y="18" width="100" height="78" rx="5" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="34" y="10" width="112" height="10" rx="2" fill="#64748B" />
          <rect x="50" y="30" width="62" height="52" rx="3" fill="#431407" stroke="#FB923C" strokeWidth="1.5" />
          <ellipse cx="66" cy="48" rx="9" ry="5" fill="#C87A28" />
          <ellipse cx="94" cy="48" rx="9" ry="5" fill="#C87A28" />
          <ellipse cx="66" cy="68" rx="9" ry="5" fill="#C87A28" />
          <ellipse cx="94" cy="68" rx="9" ry="5" fill="#C87A28" />
          <rect x="118" y="30" width="16" height="24" rx="2" fill="#0F172A" />
          <text x="126" y="45" textAnchor="middle" fontSize="7" fill="#FB923C" fontFamily="monospace" fontWeight="bold">190°</text>
        </g>
      )}
      {iconType === 'cooling' && (
        <g>
          <line x1="52" y1="14" x2="52" y2="90" stroke="#94A3B8" strokeWidth="3.5" />
          <line x1="128" y1="14" x2="128" y2="90" stroke="#94A3B8" strokeWidth="3.5" />
          {[24, 40, 56, 72, 86].map((y, i) => (
            <g key={i}>
              <line x1="52" y1={y} x2="128" y2={y} stroke="#CBD5E1" strokeWidth="2.5" />
              <ellipse cx="72" cy={y - 4} rx="8" ry="3.5" fill="#C87A28" />
              <ellipse cx="92" cy={y - 4} rx="8" ry="3.5" fill="#C87A28" />
              <ellipse cx="110" cy={y - 4} rx="8" ry="3.5" fill="#C87A28" />
            </g>
          ))}
          <circle cx="56" cy="95" r="4.5" fill="#F4D06F" />
          <circle cx="124" cy="95" r="4.5" fill="#F4D06F" />
        </g>
      )}
      {iconType === 'packaging' && (
        <g>
          <rect x="28" y="62" width="124" height="8" rx="2" fill="#CBD5E1" />
          <rect x="42" y="44" width="44" height="18" rx="3" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="46" y1="44" x2="82" y2="28" stroke="#DC2626" strokeWidth="3.5" strokeLinecap="round" />
          <rect x="98" y="38" width="42" height="24" rx="4" fill="#38BDF8" fillOpacity="0.25" stroke="#BAE6FD" strokeWidth="1.5" />
          <ellipse cx="112" cy="52" rx="7" ry="4" fill="#C87A28" />
          <ellipse cx="126" cy="52" rx="7" ry="4" fill="#C87A28" />
        </g>
      )}
    </svg>
  );
};

export const EquipmentView: React.FC<Props> = ({ onSelectPhase }) => {
  const [scaleFilter, setScaleFilter] = useState<string>('Todas');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [phaseFilter, setPhaseFilter] = useState<number>(0);

  const scales = ['Todas', 'Artesanal', 'Semindustrial', 'Industrial', 'Transversal'];
  const categories: ('Todas' | EquipmentCategory)[] = [
    'Todas',
    'Medición y Control',
    'Mezclado y Amasado',
    'División y Formado',
    'Climatización y Cocción',
    'Poshorneado y Empaque',
  ];

  const filtered = EQUIPMENT_DATA.filter((eq) => {
    const matchScale = scaleFilter === 'Todas' || eq.scale === scaleFilter;
    const matchCat = categoryFilter === 'Todas' || eq.category === categoryFilter;
    const matchPhase = phaseFilter === 0 || eq.phaseIds.includes(phaseFilter);
    return matchScale && matchCat && matchPhase;
  });

  return (
    <div className="space-y-6">
      {/* Header & Multi-Axis Filters */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#C87D20]" />
              Catálogo Técnico de Maquinaria y Equipos (10)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              Especificaciones de ingeniería, componentes principales, variables asociadas,
              seguridad industrial y mantenimiento preventivo.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F3EFE6] text-[#14181F] font-mono-tech text-xs font-bold">
            Mostrando {filtered.length} de {EQUIPMENT_DATA.length} equipos
          </span>
        </div>

        {/* Filter Row 1: Functional Category + Phase Dropdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-[#F3EFE6]">
          <div className="lg:col-span-8 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-[#5C554B] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Categoría:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#14181F] text-white border-[#14181F]'
                    : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="lg:col-span-4 flex items-center gap-2">
            <label htmlFor="equip-phase-filter" className="text-xs font-bold text-[#5C554B] shrink-0">
              Fase:
            </label>
            <select
              id="equip-phase-filter"
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] text-xs font-semibold text-[#14181F] cursor-pointer"
            >
              <option value={0}>Todas las fases (1 – 18)</option>
              {PHASES_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  Fase {p.id}: {p.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Row 2: Productive Scale */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-[#5C554B] mr-1">Nivel productivo:</span>
          {scales.map((s) => (
            <button
              key={s}
              onClick={() => setScaleFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                scaleFilter === s
                  ? 'bg-[#C87D20] text-white border-[#C87D20]'
                  : 'bg-white text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Equipment Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E5DEC9] p-8 text-center space-y-3">
          <p className="text-sm font-bold text-[#14181F]">
            No hay equipos que coincidan con la combinación de filtros seleccionada.
          </p>
          <button
            onClick={() => {
              setScaleFilter('Todas');
              setCategoryFilter('Todas');
              setPhaseFilter(0);
            }}
            className="px-4 py-2 rounded-xl bg-[#14181F] text-white text-xs font-bold cursor-pointer"
          >
            Mostrar todos los equipos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((eq) => (
            <article
              key={eq.id}
              className="rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Top Header + Schematic */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5">
                    <EquipmentSchematicSVG iconType={eq.iconType} />
                  </div>
                  <div className="sm:col-span-7 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C87D20]/15 text-[#9A3412]">
                        {eq.scale}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech font-semibold bg-[#F3EFE6] text-[#14181F]">
                        {eq.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-[#14181F] leading-snug">
                      {eq.name}
                    </h2>
                    <div className="text-xs font-semibold text-[#1B4332] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span>{eq.phaseLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Function & Productive Contribution */}
                <div className="rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] p-3.5 space-y-1.5 text-xs">
                  <div>
                    <strong className="text-[#14181F] uppercase text-[10px] tracking-wider block">
                      Función Operativa Principal
                    </strong>
                    <p className="text-[#181C23] leading-relaxed mt-0.5">{eq.functionDesc}</p>
                  </div>
                  <div className="pt-1.5 border-t border-[#E5DEC9]">
                    <strong className="text-[#9A3412]">Contribución a la calidad del lote: </strong>
                    <span className="text-[#5C554B]">{eq.contribution}</span>
                  </div>
                </div>

                {/* Principal Components & Related Variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-[#F3EFE6]/60 border border-[#E5DEC9] p-3 space-y-1.5">
                    <div className="font-bold text-[#14181F] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#C87D20]" />
                      Componentes Principales
                    </div>
                    <ul className="space-y-1 text-[#5C554B]">
                      {eq.components.map((comp, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#1B4332] shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#F3EFE6]/60 border border-[#E5DEC9] p-3 space-y-1.5">
                    <div className="font-bold text-[#14181F] flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#9A3412]" />
                      Variables Relacionadas
                    </div>
                    <ul className="space-y-1 text-[#5C554B]">
                      {eq.relatedVariables.map((rv, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#9A3412] font-bold">•</span>
                          <span>{rv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Safety & Preventive Maintenance */}
                <div className="rounded-xl bg-[#1B4332]/8 border border-[#1B4332]/20 p-3.5 text-xs space-y-1.5">
                  <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Seguridad Industrial y Mantenimiento Preventivo
                  </div>
                  <p className="text-[#181C23] leading-relaxed">{eq.maintenanceAndSafety}</p>
                  <div className="text-[11px] text-[#5C554B] pt-1 border-t border-[#1B4332]/15">
                    <strong className="text-[#14181F]">Frecuencia recomendada:</strong>{' '}
                    {eq.maintenanceSchedule}
                  </div>
                </div>
              </div>

              {/* Direct Links to 3D Simulator Phases */}
              <div className="pt-3 border-t border-[#F3EFE6] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#5C554B]">
                  Inspeccionar estación 3D en:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {eq.phaseIds.map((pid) => (
                    <button
                      key={pid}
                      onClick={() => onSelectPhase(pid - 1)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#14181F] hover:bg-[#C87D20] text-white transition cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Fase {pid}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
