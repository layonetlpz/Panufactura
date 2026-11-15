import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { PhaseIllustration } from '../components/PhaseIllustration';

interface Props {
  activeIndex: number;
  onChangeIndex: (idx: number) => void;
  onExit: () => void;
}

export const PresentationModeView: React.FC<Props> = ({ activeIndex, onChangeIndex, onExit }) => {
  const phase = PHASES_DATA[activeIndex];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (activeIndex < PHASES_DATA.length - 1) onChangeIndex(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeIndex > 0) onChangeIndex(activeIndex - 1);
      } else if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, onChangeIndex, onExit]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1E293B] text-white flex flex-col justify-between p-6 sm:p-10 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/15 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Modo Exposición en Aula · {phase.zone}
          </span>
          <div className="text-sm text-slate-300 mt-0.5">
            Pan de Sal Tradicional Tipo Rollo — Navega con flechas ← / → o botones
          </div>
        </div>
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold cursor-pointer"
        >
          <X className="w-4 h-4" /> Salir (Esc)
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full">
        <div className="lg:col-span-5 space-y-4">
          <PhaseIllustration visualKey={phase.visualStateKey} phaseId={phase.id} />
          <div className="rounded-xl bg-white/10 p-4 text-sm text-amber-100 border border-white/10">
            <span className="font-bold text-amber-300">Resultado visual: </span>
            {phase.visualCaption}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-bold">
            Fase {phase.id} de {PHASES_DATA.length} · {phase.classification}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-white">
            {phase.name}
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
            {phase.whatHappens}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-white/10 border border-white/10 p-4">
              <div className="text-xs font-bold uppercase text-amber-300 mb-1">Objetivo e impacto</div>
              <p className="text-sm text-slate-200">{phase.objective} {phase.impactOnFinalProduct}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 p-4">
              <div className="text-xs font-bold uppercase text-amber-300 mb-1">Variables y control</div>
              <ul className="text-sm text-slate-200 space-y-1">
                {phase.variables.map((v, i) => (
                  <li key={i}>• <strong>{v.label}:</strong> {v.referenceValue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-white/15 pt-4">
        <button
          onClick={() => onChangeIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" /> Anterior
        </button>

        <div className="text-sm font-semibold text-slate-300">
          Diapositiva {activeIndex + 1} / {PHASES_DATA.length}
        </div>

        <button
          onClick={() => onChangeIndex(Math.min(PHASES_DATA.length - 1, activeIndex + 1))}
          disabled={activeIndex === PHASES_DATA.length - 1}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-30 font-semibold cursor-pointer"
        >
          Siguiente <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
