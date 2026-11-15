import React, { useState } from 'react';
import { Wrench, Shield, Layers } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';

interface Props {
  onSelectPhase: (phaseIndex: number) => void;
}

export const EquipmentView: React.FC<Props> = ({ onSelectPhase }) => {
  const [scaleFilter, setScaleFilter] = useState<string>('Todas');

  const scales = ['Todas', 'Artesanal', 'Semindustrial', 'Industrial', 'Transversal'];
  const filtered = scaleFilter === 'Todas' ? EQUIPMENT_DATA : EQUIPMENT_DATA.filter((e) => e.scale === scaleFilter);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-600" />
            Galería de Maquinaria y Equipos
          </h1>
          <p className="text-sm text-[#6B5E53] mt-1">
            Equipos utilizados en la manufactura del pan tipo rollo, clasificados por nivel de tecnificación.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {scales.map((s) => (
            <button
              key={s}
              onClick={() => setScaleFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                scaleFilter === s
                  ? 'bg-[#1E293B] text-white border-[#1E293B]'
                  : 'bg-[#FAF6F0] text-[#4A3F35] border-[#E7DFD3] hover:bg-amber-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((eq) => (
          <div key={eq.id} className="rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-bold text-[#1E293B]">{eq.name}</h2>
                <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  {eq.scale}
                </span>
              </div>

              <div className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {eq.phaseLabel}
              </div>

              <div className="rounded-xl bg-[#FAF6F0] border border-[#E7DFD3] p-3.5 text-sm text-[#4A3F35]">
                <span className="font-bold text-[#1E293B] block text-xs uppercase mb-1">Función principal</span>
                {eq.functionDesc}
              </div>

              <div className="text-sm text-[#4A3F35]">
                <span className="font-bold text-[#1E293B]">Contribución productiva: </span>
                {eq.contribution}
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 flex items-start gap-2">
                <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900 mb-0.5">Mantenimiento y seguridad</span>
                  {eq.maintenanceAndSafety}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              {eq.phaseIds.map((pid) => (
                <button
                  key={pid}
                  onClick={() => onSelectPhase(pid - 1)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition cursor-pointer"
                >
                  Ir a Fase {pid} →
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
