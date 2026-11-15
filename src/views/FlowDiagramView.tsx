import React from 'react';
import { ArrowDown, ArrowRight, GitBranch } from 'lucide-react';
import { PHASES_DATA, AsmeSymbol } from '../data/phasesData';

interface Props {
  onSelectPhase: (phaseIndex: number) => void;
}

const symbolBadge = (asme: AsmeSymbol) => {
  switch (asme) {
    case 'Operación':
      return { glyph: '◯', cls: 'bg-amber-100 text-amber-900 border-amber-300' };
    case 'Inspección':
      return { glyph: '▢', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
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

export const FlowDiagramView: React.FC<Props> = ({ onSelectPhase }) => {
  const zones = Array.from(new Set(PHASES_DATA.map((p) => p.zone)));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-amber-600" />
              Diagrama Interactivo del Proceso (18 Fases)
            </h1>
            <p className="text-sm text-[#6B5E53] mt-1">
              Haz clic sobre cualquier fase para abrir su ficha técnica completa en el simulador.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {(['Operación', 'Inspección', 'Almacenamiento', 'Demora', 'Transporte', 'Decisión'] as AsmeSymbol[]).map((sym) => {
              const b = symbolBadge(sym);
              return (
                <span key={sym} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold ${b.cls}`}>
                  <span>{b.glyph}</span> {sym}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grouped flow by production zone */}
      <div className="space-y-5">
        {zones.map((zone, zIdx) => {
          const zonePhases = PHASES_DATA.filter((p) => p.zone === zone);
          return (
            <div key={zone} className="space-y-3">
              <div className="rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                  Área {zIdx + 1}: {zone}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {zonePhases.map((ph, idx) => {
                    const b = symbolBadge(ph.asme);
                    return (
                      <div key={ph.id} className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectPhase(ph.id - 1)}
                          className="flex-1 text-left rounded-xl border border-[#E7DFD3] hover:border-amber-500 bg-[#FAF6F0]/70 hover:bg-amber-50 p-3.5 transition cursor-pointer group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#1E293B]">Fase {ph.id}</span>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${b.cls}`}>
                              {b.glyph} {ph.asme}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-[#1E293B] group-hover:text-amber-800">
                            {ph.name}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                            <span className="font-semibold">Salida:</span> {ph.outputs[0]}
                          </div>
                        </button>
                        {idx < zonePhases.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-amber-600 shrink-0 hidden lg:block" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {zIdx < zones.length - 1 && (
                <div className="flex justify-center">
                  <div className="p-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
