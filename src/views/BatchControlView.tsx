import React, { useEffect, useState } from 'react';
import { ClipboardCheck, RotateCcw } from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { INGREDIENTS_DATA, PILOT_UNIT_WEIGHT_G, TOTAL_BAKER_PERCENT } from '../data/formulationData';

type PhaseStatus = 'Pendiente' | 'En proceso' | 'Aprobada' | 'Requiere revisión';

interface BatchState {
  batchId: string;
  flourGrams: number;
  targetUnits: number;
  unitWeight: number;
  date: string;
  statuses: Record<number, PhaseStatus>;
}

const STORAGE_KEY = 'panufactura_batch_v1';

const createInitialState = (): BatchState => {
  const statuses: Record<number, PhaseStatus> = {};
  PHASES_DATA.forEach((p) => {
    statuses[p.id] = 'Pendiente';
  });
  return {
    batchId: 'LOTE-PILOTO-01',
    flourGrams: 1000,
    targetUnits: 20,
    unitWeight: PILOT_UNIT_WEIGHT_G,
    date: new Date().toISOString().slice(0, 10),
    statuses,
  };
};

export const BatchControlView: React.FC = () => {
  const [batch, setBatch] = useState<BatchState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return createInitialState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
    } catch {
      // ignore storage errors
    }
  }, [batch]);

  const approvedCount = Object.values(batch.statuses).filter((s) => s === 'Aprobada').length;
  const progressPct = Math.round((approvedCount / PHASES_DATA.length) * 100);
  const totalDough = ((batch.flourGrams || 0) * TOTAL_BAKER_PERCENT) / 100;

  const statusBadge = (s: PhaseStatus) => {
    switch (s) {
      case 'Aprobada':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'En proceso':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Requiere revisión':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Batch header form */}
      <section className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-amber-600" />
              Control de Lote y Trazabilidad (Simulación Local)
            </h1>
            <p className="text-sm text-[#6B5E53] mt-1">
              Los datos ingresados se conservan automáticamente en el navegador (localStorage).
            </p>
          </div>
          <button
            onClick={() => setBatch(createInitialState())}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar lote
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#E7DFD3]">
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Identificador del lote</label>
            <input
              type="text"
              value={batch.batchId}
              onChange={(e) => setBatch({ ...batch, batchId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Harina (g)</label>
            <input
              type="number"
              min={100}
              step={100}
              value={batch.flourGrams}
              onChange={(e) => setBatch({ ...batch, flourGrams: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Piezas previstas</label>
            <input
              type="number"
              min={1}
              value={batch.targetUnits}
              onChange={(e) => setBatch({ ...batch, targetUnits: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Peso por pieza (g)</label>
            <input
              type="number"
              min={30}
              value={batch.unitWeight}
              onChange={(e) => setBatch({ ...batch, unitWeight: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1E293B] mb-1">Fecha de simulación</label>
            <input
              type="date"
              value={batch.date}
              onChange={(e) => setBatch({ ...batch, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold"
            />
          </div>
        </div>

        {/* Calculated formulation strip */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase text-slate-500">
            Insumos calculados para {batch.batchId} (Masa cruda estimada: {totalDough.toFixed(0)} g)
          </div>
          <div className="flex flex-wrap gap-2">
            {INGREDIENTS_DATA.map((ing) => (
              <div key={ing.id} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-semibold text-[#1E293B]">{ing.name}: </span>
                <span className="font-bold text-amber-800">
                  {(((batch.flourGrams || 0) * ing.bakerPercent) / 100).toFixed(1)} g
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span>Progreso de liberación del lote</span>
            <span>{approvedCount} / {PHASES_DATA.length} fases aprobadas ({progressPct}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="rounded-2xl bg-white border border-[#E7DFD3] p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[#1E293B] mb-4">Registro de verificación por etapa</h2>
        <div className="space-y-2.5">
          {PHASES_DATA.map((ph) => {
            const currentStatus = batch.statuses[ph.id] || 'Pendiente';
            return (
              <div
                key={ph.id}
                className="rounded-xl border border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF6F0]/50"
              >
                <div>
                  <div className="font-bold text-sm text-[#1E293B]">{ph.id}. {ph.name}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <span className="font-semibold">Verificar:</span> {ph.qualityControl.toVerify}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {(['Pendiente', 'En proceso', 'Aprobada', 'Requiere revisión'] as PhaseStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() =>
                        setBatch({
                          ...batch,
                          statuses: { ...batch.statuses, [ph.id]: st },
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        currentStatus === st
                          ? statusBadge(st) + ' ring-2 ring-offset-1 ring-amber-500/40'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
