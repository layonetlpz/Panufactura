import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  GitBranch,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { PHASES_DATA, AsmeSymbol } from '../data/phasesData';

interface Props {
  onSelectPhase: (phaseIndex: number) => void;
}

const symbolBadge = (asme: AsmeSymbol) => {
  switch (asme) {
    case 'Operación':
      return { glyph: '◯', cls: 'bg-[#C87D20]/15 text-[#9A3412] border-[#C87D20]/40' };
    case 'Inspección':
      return { glyph: '▢', cls: 'bg-[#1B4332]/15 text-[#1B4332] border-[#1B4332]/40' };
    case 'Almacenamiento':
      return { glyph: '▽', cls: 'bg-sky-100 text-sky-900 border-sky-300' };
    case 'Demora':
      return { glyph: 'D', cls: 'bg-purple-100 text-purple-900 border-purple-300' };
    case 'Transporte':
      return { glyph: '⇨', cls: 'bg-slate-200 text-slate-800 border-slate-300' };
    default:
      return { glyph: '◇', cls: 'bg-rose-100 text-rose-900 border-rose-300' };
  }
};

// Decision checkpoints integrated into the process sequence (Section 15)
const DECISION_GATES: Record<number, { question: string; yesAction: string; noAction: string }> = {
  1: {
    question: '¿Insumos cumplen certificado, humedad < 14,5% e inocuidad?',
    yesAction: 'Liberar a Almacenamiento PEPS (Fase 2)',
    noAction: 'Aislar en cuarentena / Rechazar al proveedor',
  },
  5: {
    question: '¿Supera prueba del velo (membrana translúcida) y T masa 24–28 °C?',
    yesAction: 'Transferir a Primera Fermentación (Fase 6)',
    noAction: 'Ajustar 1–2 min de amasado y corregir T de agua',
  },
  14: {
    question: '¿Temperatura interna del pan < 35 °C al salir de rejillas?',
    yesAction: 'Autorizar Inspección y Empaque (Fases 15–16)',
    noAction: 'Continuar enfriamiento ventilado (evitar condensación)',
  },
  15: {
    question: '¿Lote conforme en peso, color dorado, miga y ausencia de defectos?',
    yesAction: 'Sellar, rotular lote/gluten y despachar (Fases 16–18)',
    noAction: 'Segregar unidades no conformes y registrar incidencia',
  },
};

export const FlowDiagramView: React.FC<Props> = ({ onSelectPhase }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [asmeFilter, setAsmeFilter] = useState<string>('Todos');
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);
  const [showDecisions, setShowDecisions] = useState<boolean>(true);

  const zones = Array.from(new Set(PHASES_DATA.map((p) => p.zone)));
  const inspectedPhase =
    PHASES_DATA.find((p) => p.id === selectedPhaseId) || PHASES_DATA[0];

  const asmeCounts = PHASES_DATA.reduce<Record<string, number>>((acc, p) => {
    acc[p.asme] = (acc[p.asme] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* ==================== 1. HEADER, ASME LEGEND & ZOOM CONTROLS ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-[#C87D20]" />
              Diagrama de Manufactura e Ingeniería de Métodos (ASME)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              Secuencia sincronizada con las 18 fases del proceso. Selecciona cualquier nodo para
              inspeccionar sus parámetros o saltar al simulador 3D.
            </p>
          </div>

          {/* Zoom & Decision Toggle Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowDecisions((d) => !d)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                showDecisions
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9]'
              }`}
            >
              <span>◇ Decisiones (4)</span>
            </button>

            <div className="inline-flex items-center rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-1">
              <button
                onClick={() => setZoom((z) => Math.max(75, z - 15))}
                className="p-1.5 rounded-lg hover:bg-white cursor-pointer"
                title="Reducir vista"
                aria-label="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4 text-[#14181F]" />
              </button>
              <span className="px-2.5 font-mono-tech text-xs font-bold text-[#14181F]">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(130, z + 15))}
                className="p-1.5 rounded-lg hover:bg-white cursor-pointer"
                title="Ampliar vista"
                aria-label="Ampliar zoom"
              >
                <ZoomIn className="w-4 h-4 text-[#14181F]" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1.5 rounded-lg hover:bg-white cursor-pointer"
                title="Restablecer zoom 100%"
                aria-label="Restablecer zoom"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5C554B]" />
              </button>
            </div>
          </div>
        </div>

        {/* ASME Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F3EFE6] text-xs">
          <span className="font-bold text-[#5C554B] mr-1">Filtrar simbología ASME:</span>
          <button
            onClick={() => setAsmeFilter('Todos')}
            className={`px-3 py-1 rounded-full font-bold border transition cursor-pointer ${
              asmeFilter === 'Todos'
                ? 'bg-[#14181F] text-white border-[#14181F]'
                : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9]'
            }`}
          >
            Todos (18)
          </button>
          {(
            ['Operación', 'Inspección', 'Almacenamiento', 'Demora', 'Transporte'] as AsmeSymbol[]
          ).map((sym) => {
            const b = symbolBadge(sym);
            const active = asmeFilter === sym;
            return (
              <button
                key={sym}
                onClick={() => setAsmeFilter(active ? 'Todos' : sym)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold transition cursor-pointer ${
                  active ? 'ring-2 ring-[#14181F] ' + b.cls : b.cls + ' opacity-85 hover:opacity-100'
                }`}
              >
                <span>{b.glyph}</span>
                <span>{sym}</span>
                <span className="font-mono-tech text-[10px]">({asmeCounts[sym] || 0})</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== 2. MAIN WORKSPACE: INTERACTIVE DIAGRAM + INLINE PHASE INSPECTOR ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Zoomable & Scrollable Process Flow Canvas */}
        <div className="lg:col-span-8 rounded-2xl bg-[#F3EFE6]/60 border border-[#E5DEC9] p-4 sm:p-5 overflow-x-auto thin-scrollbar">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: zoom > 100 ? `${zoom}%` : '100%',
            }}
            className="space-y-4 transition-transform duration-200"
          >
            {zones.map((zone, zIdx) => {
              const zonePhases = PHASES_DATA.filter(
                (p) =>
                  p.zone === zone &&
                  (asmeFilter === 'Todos' || p.asme === asmeFilter)
              );
              if (zonePhases.length === 0) return null;

              return (
                <div key={zone} className="space-y-3">
                  <div className="rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#F3EFE6]">
                      <div className="text-xs font-mono-tech font-bold uppercase tracking-wider text-[#9A3412]">
                        ZONA {zIdx + 1}: {zone}
                      </div>
                      <span className="text-[11px] font-semibold text-[#5C554B]">
                        {zonePhases.length} etapa(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {zonePhases.map((ph, idx) => {
                        const b = symbolBadge(ph.asme);
                        const isSelected = ph.id === selectedPhaseId;
                        const decision = showDecisions ? DECISION_GATES[ph.id] : undefined;

                        return (
                          <div key={ph.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedPhaseId(ph.id)}
                                className={`flex-1 text-left rounded-xl border p-3.5 transition cursor-pointer group ${
                                  isSelected
                                    ? 'bg-[#14181F] text-white border-[#14181F] ring-2 ring-[#C87D20] shadow-md'
                                    : 'bg-[#FBF9F5] hover:bg-[#F3EFE6] border-[#E5DEC9] hover:border-[#C87D20]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span
                                    className={`text-xs font-mono-tech font-bold ${
                                      isSelected ? 'text-[#F4D06F]' : 'text-[#14181F]'
                                    }`}
                                  >
                                    FASE {String(ph.id).padStart(2, '0')}
                                  </span>
                                  <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                      isSelected
                                        ? 'bg-white/15 text-[#F4D06F] border-white/30'
                                        : b.cls
                                    }`}
                                  >
                                    {b.glyph} {ph.asme}
                                  </span>
                                </div>
                                <div
                                  className={`font-bold text-sm ${
                                    isSelected
                                      ? 'text-white'
                                      : 'text-[#14181F] group-hover:text-[#9A3412]'
                                  }`}
                                >
                                  {ph.name}
                                </div>
                                <div
                                  className={`text-[11px] mt-1 line-clamp-2 ${
                                    isSelected ? 'text-slate-300' : 'text-[#5C554B]'
                                  }`}
                                >
                                  <span className="font-semibold">Salida:</span> {ph.outputs[0]}
                                </div>
                              </button>
                              {idx < zonePhases.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-[#C87D20] shrink-0 hidden md:block" />
                              )}
                            </div>

                            {/* Decision Diamond Node attached to key control phases */}
                            {decision && (
                              <div className="rounded-xl bg-rose-50/80 border border-rose-200 p-3 text-xs space-y-1">
                                <div className="font-bold text-rose-900 flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>◇ Decisión: {decision.question}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                                  <div className="rounded bg-emerald-100/70 px-2 py-1 text-emerald-950">
                                    <strong>SÍ:</strong> {decision.yesAction}
                                  </div>
                                  <div className="rounded bg-rose-100/70 px-2 py-1 text-rose-950">
                                    <strong>NO:</strong> {decision.noAction}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {zIdx < zones.length - 1 && (
                    <div className="flex justify-center">
                      <div className="p-1.5 rounded-full bg-[#C87D20]/20 border border-[#C87D20]/40 text-[#9A3412]">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Columns: Sticky Phase Technical Inspector */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20 rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F3EFE6]">
            <div>
              <span className="text-[11px] font-mono-tech font-bold uppercase text-[#9A3412]">
                Inspector de Nodo · Fase {inspectedPhase.id}/18
              </span>
              <h2 className="text-lg font-bold text-[#14181F] mt-0.5">
                {inspectedPhase.name}
              </h2>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                symbolBadge(inspectedPhase.asme).cls
              }`}
            >
              {symbolBadge(inspectedPhase.asme).glyph} {inspectedPhase.asme}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] p-3">
              <span className="font-bold text-[#14181F] block mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#C87D20]" /> Resumen operativo
              </span>
              <p className="text-[#5C554B] leading-relaxed">{inspectedPhase.whatHappens}</p>
            </div>

            <div>
              <span className="font-bold text-[#14181F] block mb-1">Entradas del nodo</span>
              <div className="flex flex-wrap gap-1">
                {inspectedPhase.inputs.map((inp, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#F3EFE6] text-[#181C23] font-medium"
                  >
                    {inp}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-[#14181F] block mb-1">Variables de control</span>
              <div className="space-y-1.5">
                {inspectedPhase.variables.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[#FBF9F5] border border-[#E5DEC9] px-2.5 py-1.5"
                  >
                    <span className="font-semibold text-[#181C23]">{v.label}</span>
                    <strong className="font-mono-tech text-[#9A3412]">{v.referenceValue}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#1B4332]/10 border border-[#1B4332]/25 p-3">
              <span className="font-bold text-[#1B4332] flex items-center gap-1 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Salida hacia siguiente etapa
              </span>
              <p className="text-[#181C23] font-medium">{inspectedPhase.outputs[0]}</p>
            </div>
          </div>

          <button
            onClick={() => onSelectPhase(inspectedPhase.id - 1)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#14181F] hover:bg-[#C87D20] text-white text-xs font-bold transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Abrir Fase {inspectedPhase.id} en Simulador 3D
          </button>
        </aside>
      </div>
    </div>
  );
};
