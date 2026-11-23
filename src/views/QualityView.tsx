import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Play,
  Layers,
  Wrench,
  FileCheck2,
} from 'lucide-react';
import { DEFECTS_DATA, QUALITY_PILLARS, DefectItem } from '../data/qualityData';
import { PHASES_DATA } from '../data/phasesData';

interface Props {
  onSelectPhase?: (phaseIndex: number) => void;
}

const DefectVisualSVG: React.FC<{ defectId: string }> = ({ defectId }) => {
  return (
    <svg
      viewBox="0 0 220 110"
      className="w-full h-28 rounded-xl bg-[#14181F] border border-[#2D3545] p-2"
      role="img"
      aria-label={`Representación didáctica del defecto ${defectId}`}
    >
      {/* Reference comparison label */}
      <text x="55" y="18" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="monospace">
        ESTÁNDAR PILOTO
      </text>
      <text x="165" y="18" textAnchor="middle" fontSize="9" fill="#F4D06F" fontFamily="monospace" fontWeight="bold">
        DEFECTO ANALIZADO
      </text>
      <line x1="110" y1="10" x2="110" y2="100" stroke="#334155" strokeDasharray="3 3" />

      {/* Left: Reference healthy golden roll */}
      <ellipse cx="55" cy="62" rx="34" ry="20" fill="#C87A28" stroke="#F4D06F" strokeWidth="1.5" />
      <path d="M40 52 Q55 44 70 52" fill="none" stroke="#FDE68A" strokeWidth="1.5" />

      {/* Right: Defect representation */}
      {(defectId === 'low-volume' || defectId === 'under-fermentation' || defectId === 'dense-crumb') && (
        <g>
          <ellipse cx="165" cy="70" rx="22" ry="11" fill="#B45309" stroke="#F87171" strokeWidth="1.5" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FCA5A5">Volumen reducido / Miga cerrada</text>
        </g>
      )}
      {defectId === 'over-fermentation' && (
        <g>
          <path d="M128 74 Q145 56 165 66 Q185 56 202 74 Z" fill="#D97706" stroke="#F87171" strokeWidth="1.5" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FCA5A5">Colapso estructural y arrugas</text>
        </g>
      )}
      {(defectId === 'sticky-dough' || defectId === 'underdeveloped-dough') && (
        <g>
          <path d="M132 68 Q150 42 168 58 Q186 45 198 72 Q175 84 145 80 Z" fill="#F3E3AD" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FDE68A">Red de gluten inestable / desgarro</text>
        </g>
      )}
      {(defectId === 'overbaked' || defectId === 'hard-crust') && (
        <g>
          <ellipse cx="165" cy="62" rx="33" ry="19" fill="#3B1A08" stroke="#EF4444" strokeWidth="2" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FCA5A5">Corteza carbonizada o rígida</text>
        </g>
      )}
      {defectId === 'raw-bread' && (
        <g>
          <ellipse cx="165" cy="62" rx="34" ry="20" fill="#D97706" />
          <ellipse cx="165" cy="64" rx="20" ry="11" fill="#FEF08A" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FDE68A">Núcleo crudo (&lt; 82 °C)</text>
        </g>
      )}
      {defectId === 'uneven-color' && (
        <g>
          <ellipse cx="148" cy="62" rx="16" ry="14" fill="#FDE68A" />
          <ellipse cx="182" cy="62" rx="16" ry="14" fill="#5C280B" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#FDE68A">Transferencia térmica desigual</text>
        </g>
      )}
      {defectId === 'condensation-mold' && (
        <g>
          <rect x="130" y="38" width="70" height="44" rx="6" fill="#38BDF8" fillOpacity="0.22" stroke="#7DD3FC" strokeWidth="1.5" />
          <ellipse cx="165" cy="62" rx="26" ry="14" fill="#C87A28" />
          <circle cx="142" cy="48" r="2.5" fill="#38BDF8" />
          <circle cx="184" cy="50" r="2.5" fill="#38BDF8" />
          <circle cx="158" cy="60" r="4" fill="#10B981" />
          <text x="165" y="96" textAnchor="middle" fontSize="8" fill="#7DD3FC">Vapor condensado (&gt;35 °C) y moho</text>
        </g>
      )}
    </svg>
  );
};

// 10 Control Checkpoints requested in Section 14
const STAGE_CONTROL_FILTERS = [
  { id: 'all', label: 'Todas las etapas (18)', phaseIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'mp', label: '1. Materias primas', phaseIds: [1, 2] },
  { id: 'weigh', label: '2. Pesaje', phaseIds: [3] },
  { id: 'mix', label: '3. Mezclado', phaseIds: [4] },
  { id: 'knead', label: '4. Amasado', phaseIds: [5] },
  { id: 'ferm', label: '5. Fermentación', phaseIds: [6, 11] },
  { id: 'shape', label: '6. Formado', phaseIds: [7, 8, 9, 10, 12] },
  { id: 'bake', label: '7. Horneado', phaseIds: [13] },
  { id: 'cool', label: '8. Enfriamiento', phaseIds: [14] },
  { id: 'pack', label: '9. Empaque', phaseIds: [16] },
  { id: 'pt', label: '10. Producto terminado', phaseIds: [15, 17, 18] },
];

export const QualityView: React.FC<Props> = ({ onSelectPhase }) => {
  const [selectedDefectId, setSelectedDefectId] = useState<string>(DEFECTS_DATA[0].id);
  const [defectCategoryFilter, setDefectCategoryFilter] = useState<string>('Todas');
  const [controlAreaFilter, setControlAreaFilter] = useState<string>('all');

  const selectedDefect: DefectItem =
    DEFECTS_DATA.find((d) => d.id === selectedDefectId) || DEFECTS_DATA[0];

  const defectCategories = [
    'Todas',
    'Técnico / Reológico',
    'Cocción / Visual',
    'Inocuidad / Calidad',
  ];

  const filteredDefects =
    defectCategoryFilter === 'Todas'
      ? DEFECTS_DATA
      : DEFECTS_DATA.filter((d) => d.category === defectCategoryFilter);

  const activeControlGroup =
    STAGE_CONTROL_FILTERS.find((g) => g.id === controlAreaFilter) || STAGE_CONTROL_FILTERS[0];
  const filteredPhases = PHASES_DATA.filter((p) =>
    activeControlGroup.phaseIds.includes(p.id)
  );

  return (
    <div className="space-y-6">
      {/* ==================== 1. REGULATORY & CONCEPTUAL DISTINCTION (BPM vs CC vs PRERREQUISITOS vs PC vs PCC) ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#1B4332]" />
              Gestión de Calidad, BPM e Inocuidad Alimentaria
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              Diferenciación técnica entre Buenas Prácticas de Manufactura (Res. 2674/2013),
              Programas Prerrequisito, Control de Calidad (CC), Puntos de Control (PC) y Puntos
              Críticos de Control (Decreto 60/2002).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold">
            Uso Académico · No certifica inocuidad
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUALITY_PILLARS.map((pil, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E5DEC9] bg-[#FBF9F5] p-4 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-mono-tech font-bold px-2.5 py-0.5 rounded-full bg-[#14181F] text-[#F4D06F]">
                  {pil.badge}
                </span>
                <h2 className="text-base font-bold text-[#14181F]">{pil.title}</h2>
                <p className="text-xs text-[#5C554B] leading-relaxed">{pil.description}</p>
              </div>
              <ul className="space-y-1.5 pt-2 border-t border-[#E5DEC9]">
                {pil.examples.map((ex, i) => (
                  <li key={i} className="text-xs text-[#181C23] flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332] shrink-0 mt-0.5" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 2. INTERACTIVE DEFECTS DIAGNOSTIC MATRIX ==================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of 11 Defects */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#14181F] flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[#9A3412]" />
              Matriz de Defectos ({filteredDefects.length})
            </h2>
          </div>

          <div className="flex flex-wrap gap-1">
            {defectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setDefectCategoryFilter(cat)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                  defectCategoryFilter === cat
                    ? 'bg-[#14181F] text-white border-[#14181F]'
                    : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto thin-scrollbar pr-1">
            {filteredDefects.map((def) => (
              <button
                key={def.id}
                onClick={() => setSelectedDefectId(def.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedDefectId === def.id
                    ? 'bg-[#14181F] text-white border-[#14181F] shadow-xs'
                    : 'bg-[#FBF9F5] text-[#14181F] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                }`}
              >
                <div className="font-bold text-sm">{def.name}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    selectedDefectId === def.id ? 'text-[#F4D06F]' : 'text-[#5C554B]'
                  }`}
                >
                  {def.category} · Origen: {def.originPhases}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Detailed Diagnostic Sheet for Selected Defect */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono-tech uppercase font-bold text-[#9A3412]">
                Ficha de Diagnóstico de No Conformidad
              </span>
              <h3 className="text-2xl font-bold text-[#14181F]">{selectedDefect.name}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200">
              {selectedDefect.category}
            </span>
          </div>

          {/* Visual Schematic of the Defect vs Healthy Standard */}
          <DefectVisualSVG defectId={selectedDefect.id} />

          <div className="rounded-xl bg-[#FBF9F5] p-4 border border-[#E5DEC9] text-sm text-[#181C23]">
            <strong className="text-[#14181F] block text-xs uppercase mb-1">
              Manifestación física y sensorial
            </strong>
            {selectedDefect.description}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-[#E5DEC9] p-4 space-y-2">
              <h4 className="font-bold uppercase text-[#5C554B]">Causas raíz probables</h4>
              <ul className="space-y-1.5 text-[#181C23]">
                {selectedDefect.possibleCauses.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#E5DEC9] p-4 space-y-3">
              <div>
                <h4 className="font-bold uppercase text-[#5C554B] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#C87D20]" />
                  Etapa(s) donde se origina
                </h4>
                <p className="font-bold text-sm text-[#14181F] mt-1">
                  {selectedDefect.originPhases}
                </p>
              </div>
              <div className="pt-2 border-t border-[#F3EFE6]">
                <h4 className="font-bold uppercase text-[#5C554B]">
                  Variables operativas relacionadas
                </h4>
                <p className="font-semibold text-[#9A3412] mt-1">
                  {selectedDefect.involvedVariables}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 space-y-1">
              <h4 className="font-bold uppercase text-amber-900 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Acción Correctiva Inmediata
              </h4>
              <p className="text-amber-950 leading-relaxed">{selectedDefect.correctiveAction}</p>
            </div>
            <div className="rounded-xl border border-[#1B4332]/30 bg-[#1B4332]/8 p-4 space-y-1">
              <h4 className="font-bold uppercase text-[#1B4332] flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" /> Acción Preventiva Estandarizada
              </h4>
              <p className="text-[#181C23] leading-relaxed">{selectedDefect.preventiveAction}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. STAGE-BY-STAGE CONTROLS ACROSS ALL 10 AREAS ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#14181F]">
              Plan de Control de Calidad e Inocuidad por Etapa del Proceso
            </h2>
            <p className="text-xs text-[#5C554B]">
              Filtra por las 10 áreas críticas desde recepción de materias primas hasta producto
              terminado
            </p>
          </div>
        </div>

        {/* 10 Control Checkpoints Filter Bar */}
        <div className="flex flex-wrap gap-1.5">
          {STAGE_CONTROL_FILTERS.map((cf) => (
            <button
              key={cf.id}
              onClick={() => setControlAreaFilter(cf.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                controlAreaFilter === cf.id
                  ? 'bg-[#14181F] text-white border-[#14181F]'
                  : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
              }`}
            >
              {cf.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#14181F] text-white text-left">
                <th className="p-3 rounded-tl-xl">Fase</th>
                <th className="p-3">Clasificación Sanitaria</th>
                <th className="p-3">Qué Verificar</th>
                <th className="p-3">Condición Adecuada</th>
                <th className="p-3">Acción Correctiva</th>
                {onSelectPhase && <th className="p-3 rounded-tr-xl text-right">Simulador</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPhases.map((ph, i) => (
                <tr
                  key={ph.id}
                  className={
                    i % 2 === 1
                      ? 'bg-[#FBF9F5] border-b border-[#E5DEC9]'
                      : 'border-b border-[#E5DEC9]'
                  }
                >
                  <td className="p-3 font-bold text-[#14181F]">
                    {ph.id}. {ph.name}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        ph.classification.includes('PCC')
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : ph.classification.includes('PC')
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-[#1B4332]/10 text-[#1B4332]'
                      }`}
                    >
                      {ph.classification}
                    </span>
                  </td>
                  <td className="p-3 text-[#181C23]">{ph.qualityControl.toVerify}</td>
                  <td className="p-3 text-[#1B4332] font-medium">
                    {ph.qualityControl.adequateConditions}
                  </td>
                  <td className="p-3 text-[#5C554B]">{ph.qualityControl.correctiveActions}</td>
                  {onSelectPhase && (
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectPhase(ph.id - 1)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3EFE6] hover:bg-[#C87D20] hover:text-white text-[#14181F] font-bold transition cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" /> 3D
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
