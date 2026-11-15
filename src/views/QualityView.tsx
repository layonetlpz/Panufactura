import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { DEFECTS_DATA, QUALITY_PILLARS } from '../data/qualityData';
import { PHASES_DATA } from '../data/phasesData';

export const QualityView: React.FC = () => {
  const [selectedDefectId, setSelectedDefectId] = useState<string>(DEFECTS_DATA[0].id);
  const selectedDefect = DEFECTS_DATA.find((d) => d.id === selectedDefectId) || DEFECTS_DATA[0];

  return (
    <div className="space-y-6">
      {/* CC vs BPM vs PCC */}
      <section className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            Calidad, Buenas Prácticas e Inocuidad Alimentaria
          </h1>
          <p className="text-sm text-[#6B5E53] mt-1">
            Diferenciación técnica entre Control de Calidad, Buenas Prácticas de Manufactura (Res. 2674/2013) y Puntos Críticos de Control (Decreto 60/2002).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUALITY_PILLARS.map((pil, idx) => (
            <div key={idx} className="rounded-xl border border-[#E7DFD3] bg-[#FAF6F0]/70 p-4 space-y-2.5">
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#1E293B] text-white">
                {pil.badge}
              </span>
              <h2 className="text-base font-bold text-[#1E293B]">{pil.title}</h2>
              <p className="text-xs text-[#4A3F35] leading-relaxed">{pil.description}</p>
              <ul className="space-y-1 pt-1">
                {pil.examples.map((ex, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Defects Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm space-y-2">
          <h2 className="text-lg font-bold text-[#1E293B] flex items-center gap-2 mb-3">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            Matriz de Defectos
          </h2>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {DEFECTS_DATA.map((def) => (
              <button
                key={def.id}
                onClick={() => setSelectedDefectId(def.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium border transition cursor-pointer ${
                  selectedDefectId === def.id
                    ? 'bg-[#1E293B] text-white border-[#1E293B]'
                    : 'bg-[#FAF6F0] text-[#1E293B] border-[#E7DFD3] hover:bg-amber-50'
                }`}
              >
                <div className="font-semibold">{def.name}</div>
                <div className={`text-[11px] ${selectedDefectId === def.id ? 'text-amber-300' : 'text-slate-500'}`}>
                  {def.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[#1E293B]">{selectedDefect.name}</h3>
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
              {selectedDefect.category}
            </span>
          </div>

          <p className="text-sm text-[#4A3F35] bg-[#FAF6F0] p-4 rounded-xl border border-[#E7DFD3]">
            {selectedDefect.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Posibles causas</h4>
              <ul className="space-y-1 list-disc list-inside text-slate-700 text-xs">
                {selectedDefect.possibleCauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Fases de origen</h4>
                <p className="text-xs font-semibold text-[#1E293B] mt-0.5">{selectedDefect.originPhases}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500">Variables involucradas</h4>
                <p className="text-xs font-semibold text-amber-800 mt-0.5">{selectedDefect.involvedVariables}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <h4 className="text-xs font-bold uppercase text-amber-900 mb-1">Medida correctiva</h4>
              <p className="text-xs text-amber-950 leading-relaxed">{selectedDefect.correctiveAction}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
              <h4 className="text-xs font-bold uppercase text-emerald-900 mb-1">Acción preventiva</h4>
              <p className="text-xs text-emerald-950 leading-relaxed">{selectedDefect.preventiveAction}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stage-by-stage Control Summary */}
      <section className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-[#1E293B]">Controles clave por etapa del proceso</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1E293B] text-white text-left">
                <th className="p-2.5">Fase</th>
                <th className="p-2.5">Clasificación</th>
                <th className="p-2.5">Qué verificar</th>
                <th className="p-2.5">Acción correctiva</th>
              </tr>
            </thead>
            <tbody>
              {PHASES_DATA.map((ph, i) => (
                <tr key={ph.id} className={i % 2 === 1 ? 'bg-slate-50 border-b border-slate-200' : 'border-b border-slate-200'}>
                  <td className="p-2.5 font-bold text-[#1E293B]">{ph.id}. {ph.shortName}</td>
                  <td className="p-2.5 font-semibold text-amber-800">{ph.classification}</td>
                  <td className="p-2.5 text-slate-700">{ph.qualityControl.toVerify}</td>
                  <td className="p-2.5 text-slate-600">{ph.qualityControl.correctiveActions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
