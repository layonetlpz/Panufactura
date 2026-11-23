import React, { useEffect, useState } from 'react';
import {
  ClipboardCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Play,
  CheckCheck,
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import {
  INGREDIENTS_DATA,
  PILOT_UNIT_WEIGHT_G,
  TOTAL_BAKER_PERCENT,
} from '../data/formulationData';

type PhaseStatus = 'Pendiente' | 'En proceso' | 'Aprobada' | 'Requiere revisión';

interface BatchIncident {
  id: string;
  phaseId: number;
  note: string;
  timestamp: string;
}

interface BatchState {
  batchId: string;
  flourGrams: number;
  targetUnits: number;
  unitWeight: number;
  date: string;
  statuses: Record<number, PhaseStatus>;
  incidents: BatchIncident[];
}

interface Props {
  onSelectPhase?: (phaseIndex: number) => void;
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
    targetUnits: 21,
    unitWeight: PILOT_UNIT_WEIGHT_G,
    date: new Date().toISOString().slice(0, 10),
    statuses,
    incidents: [],
  };
};

export const BatchControlView: React.FC<Props> = ({ onSelectPhase }) => {
  const [batch, setBatch] = useState<BatchState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...createInitialState(),
          ...parsed,
          statuses: { ...createInitialState().statuses, ...(parsed.statuses || {}) },
          incidents: Array.isArray(parsed.incidents) ? parsed.incidents : [],
        };
      }
    } catch {
      // ignore storage errors
    }
    return createInitialState();
  });

  const [newIncidentPhase, setNewIncidentPhase] = useState<number>(1);
  const [newIncidentNote, setNewIncidentNote] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Todas');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
    } catch {
      // ignore storage errors
    }
  }, [batch]);

  const safeFlour = Math.max(100, batch.flourGrams || 0);
  const safeUnitW = Math.max(25, batch.unitWeight || PILOT_UNIT_WEIGHT_G);
  const totalDough = (safeFlour * TOTAL_BAKER_PERCENT) / 100;
  const theoreticalUnits = Math.floor(totalDough / safeUnitW);

  const statusValues = PHASES_DATA.map((p) => batch.statuses[p.id] || 'Pendiente');
  const approvedCount = statusValues.filter((s) => s === 'Aprobada').length;
  const inProcessCount = statusValues.filter((s) => s === 'En proceso').length;
  const reviewCount = statusValues.filter((s) => s === 'Requiere revisión').length;
  const pendingCount = statusValues.filter((s) => s === 'Pendiente').length;
  const progressPct = Math.round((approvedCount / PHASES_DATA.length) * 100);

  const batchEvaluationResult =
    reviewCount > 0
      ? {
          title: 'Lote con etapas en revisión / retención preventiva',
          desc: `Se registran ${reviewCount} fase(s) que requieren acción correctiva antes de liberar el lote.`,
          cls: 'bg-rose-50 border-rose-300 text-rose-950',
        }
      : approvedCount === PHASES_DATA.length
      ? {
          title: 'Lote simulado 100% liberado y conforme',
          desc: 'Todas las 18 fases y sus verificaciones de calidad/BPM han sido aprobadas satisfactoriamente.',
          cls: 'bg-[#1B4332]/10 border-[#1B4332]/30 text-[#1B4332]',
        }
      : {
          title: 'Orden de producción simulada en ejecución',
          desc: `${approvedCount} fases completadas, ${inProcessCount} en curso y ${pendingCount} controles pendientes.`,
          cls: 'bg-[#F3EFE6] border-[#C87D20]/40 text-[#181C23]',
        };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentNote.trim()) return;
    const item: BatchIncident = {
      id: `INC-${Date.now()}`,
      phaseId: newIncidentPhase,
      note: newIncidentNote.trim(),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };
    setBatch({
      ...batch,
      statuses: { ...batch.statuses, [newIncidentPhase]: 'Requiere revisión' },
      incidents: [item, ...batch.incidents],
    });
    setNewIncidentNote('');
  };

  const handleMarkAllApproved = () => {
    const next: Record<number, PhaseStatus> = {};
    PHASES_DATA.forEach((p) => {
      next[p.id] = 'Aprobada';
    });
    setBatch({ ...batch, statuses: next });
  };

  const statusBadge = (s: PhaseStatus) => {
    switch (s) {
      case 'Aprobada':
        return 'bg-[#1B4332] text-white border-[#1B4332]';
      case 'En proceso':
        return 'bg-[#C87D20] text-white border-[#C87D20]';
      case 'Requiere revisión':
        return 'bg-rose-600 text-white border-rose-600';
      default:
        return 'bg-[#14181F] text-white border-[#14181F]';
    }
  };

  const filteredPhases = PHASES_DATA.filter((ph) => {
    const st = batch.statuses[ph.id] || 'Pendiente';
    return statusFilter === 'Todas' || st === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Educational Disclaimer */}
      <div className="rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C554B]">
        <div>
          <strong className="text-[#14181F]">Nota de Simulación Académica: </strong>
          Esta herramienta modela una orden de producción y su bitácora de trazabilidad con
          almacenamiento local en el navegador (`localStorage`). No corresponde a un registro
          industrial real.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllApproved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Aprobar 18 fases
          </button>
          <button
            onClick={() => setBatch(createInitialState())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5DEC9] hover:bg-[#FBF9F5] text-[#14181F] font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#9A3412]" /> Reiniciar lote
          </button>
        </div>
      </div>

      {/* ==================== 1. BATCH HEADER & FORMULATION SUMMARY ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#14181F] flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-[#C87D20]" />
              Control de Producción y Seguimiento de Lote Simulado
            </h1>
            <p className="text-xs sm:text-sm text-[#5C554B] mt-0.5">
              Configura los parámetros de la orden de producción y verifica el cumplimiento de las
              18 etapas.
            </p>
          </div>
        </div>

        {/* 5 Editable Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#FBF9F5] p-4 rounded-2xl border border-[#E5DEC9]">
          <div>
            <label htmlFor="batch-id" className="block text-xs font-bold text-[#14181F] mb-1">
              Identificador del lote
            </label>
            <input
              id="batch-id"
              type="text"
              value={batch.batchId}
              onChange={(e) => setBatch({ ...batch, batchId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
          </div>
          <div>
            <label htmlFor="batch-date" className="block text-xs font-bold text-[#14181F] mb-1">
              Fecha programada
            </label>
            <input
              id="batch-date"
              type="date"
              value={batch.date}
              onChange={(e) => setBatch({ ...batch, date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
          </div>
          <div>
            <label htmlFor="batch-flour" className="block text-xs font-bold text-[#14181F] mb-1">
              Cantidad de harina [g]
            </label>
            <input
              id="batch-flour"
              type="number"
              min={100}
              step={100}
              value={batch.flourGrams}
              onChange={(e) => {
                const f = Math.max(100, Number(e.target.value) || 100);
                const estU = Math.floor(((f * TOTAL_BAKER_PERCENT) / 100) / safeUnitW);
                setBatch({ ...batch, flourGrams: f, targetUnits: estU });
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
          </div>
          <div>
            <label htmlFor="batch-piece-w" className="block text-xs font-bold text-[#14181F] mb-1">
              Peso de pieza cruda [g]
            </label>
            <input
              id="batch-piece-w"
              type="number"
              min={30}
              max={200}
              step={5}
              value={batch.unitWeight}
              onChange={(e) => {
                const w = Math.max(30, Number(e.target.value) || 80);
                const estU = Math.floor(totalDough / w);
                setBatch({ ...batch, unitWeight: w, targetUnits: estU });
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
          </div>
          <div>
            <label htmlFor="batch-units" className="block text-xs font-bold text-[#14181F] mb-1">
              Unidades programadas
            </label>
            <input
              id="batch-units"
              type="number"
              min={1}
              value={batch.targetUnits}
              onChange={(e) => setBatch({ ...batch, targetUnits: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-white text-sm font-mono-tech font-bold text-[#14181F]"
            />
            <div className="text-[10px] text-[#5C554B] mt-0.5 font-mono-tech">
              Rendimiento teórico masa: ~{theoreticalUnits} u.
            </div>
          </div>
        </div>

        {/* Status Metrics & Result Evaluation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-[#1B4332]/10 border border-[#1B4332]/25 p-3">
            <div className="text-xs text-[#1B4332] font-bold">Fases Aprobadas</div>
            <div className="text-2xl font-mono-tech font-bold text-[#1B4332]">
              {approvedCount} / 18
            </div>
          </div>
          <div className="rounded-xl bg-[#C87D20]/15 border border-[#C87D20]/30 p-3">
            <div className="text-xs text-[#9A3412] font-bold">En Proceso</div>
            <div className="text-2xl font-mono-tech font-bold text-[#9A3412]">
              {inProcessCount}
            </div>
          </div>
          <div className="rounded-xl bg-[#F3EFE6] border border-[#E5DEC9] p-3">
            <div className="text-xs text-[#5C554B] font-bold">Controles Pendientes</div>
            <div className="text-2xl font-mono-tech font-bold text-[#14181F]">
              {pendingCount}
            </div>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
            <div className="text-xs text-rose-900 font-bold">Requiere Revisión</div>
            <div className="text-2xl font-mono-tech font-bold text-rose-700">
              {reviewCount}
            </div>
          </div>
        </div>

        {/* Result Banner */}
        <div className={`rounded-xl border p-4 flex items-center justify-between gap-4 ${batchEvaluationResult.cls}`}>
          <div className="flex items-start gap-3">
            {reviewCount > 0 ? (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">{batchEvaluationResult.title}</div>
              <div className="text-xs opacity-90 mt-0.5">{batchEvaluationResult.desc}</div>
            </div>
          </div>
          <div className="text-right font-mono-tech shrink-0">
            <div className="text-xs opacity-75">Avance Global</div>
            <div className="text-lg font-bold">{progressPct}%</div>
          </div>
        </div>

        {/* Calculated Formulation Breakdown for this Batch */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold uppercase text-[#5C554B]">
            Requerimiento de Materias Primas para {batch.batchId} (Masa total:{' '}
            <span className="font-mono-tech text-[#14181F]">{totalDough.toFixed(1)} g</span>)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {INGREDIENTS_DATA.map((ing) => (
              <div
                key={ing.id}
                className="p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] text-xs"
              >
                <div className="text-[11px] text-[#5C554B] truncate">{ing.name}</div>
                <div className="font-mono-tech font-bold text-[#14181F] mt-0.5">
                  {((safeFlour * ing.bakerPercent) / 100).toFixed(1)} g
                </div>
                <div className="text-[10px] font-mono-tech text-[#9A3412]">
                  {ing.bakerPercent}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 2. INCIDENT LOG & STAGE VERIFICATION CHECKLIST ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 Cols: Incident Registration */}
        <section className="lg:col-span-4 rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#14181F] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#9A3412]" />
            Bitácora de Incidencias ({batch.incidents.length})
          </h2>

          <form onSubmit={handleAddIncident} className="space-y-3">
            <div>
              <label htmlFor="inc-phase" className="block text-xs font-bold text-[#14181F] mb-1">
                Fase asociada
              </label>
              <select
                id="inc-phase"
                value={newIncidentPhase}
                onChange={(e) => setNewIncidentPhase(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] text-xs font-semibold text-[#14181F]"
              >
                {PHASES_DATA.map((p) => (
                  <option key={p.id} value={p.id}>
                    Fase {p.id}: {p.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="inc-note" className="block text-xs font-bold text-[#14181F] mb-1">
                Descripción de desviación o hallazgo
              </label>
              <textarea
                id="inc-note"
                rows={2}
                value={newIncidentNote}
                onChange={(e) => setNewIncidentNote(e.target.value)}
                placeholder="Ej. Temperatura de cámara cayó a 24 °C por puerta mal cerrada..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] text-xs text-[#14181F]"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F4D06F]" />
              Registrar incidencia en lote
            </button>
          </form>

          {batch.incidents.length === 0 ? (
            <div className="rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] p-4 text-xs text-[#5C554B] text-center">
              Sin incidencias registradas en {batch.batchId}.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto thin-scrollbar">
              {batch.incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="rounded-xl bg-rose-50/70 border border-rose-200 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">
                      Fase {inc.phaseId} · {inc.timestamp}
                    </span>
                    <button
                      onClick={() =>
                        setBatch({
                          ...batch,
                          incidents: batch.incidents.filter((i) => i.id !== inc.id),
                        })
                      }
                      className="text-rose-700 hover:text-rose-950 p-0.5 cursor-pointer"
                      title="Eliminar incidencia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-rose-950">{inc.note}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right 8 Cols: 18-Phase Verification Checklist */}
        <section className="lg:col-span-8 rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#14181F]">
              Checklist de Verificación por Etapa ({filteredPhases.length})
            </h2>
            <div className="flex flex-wrap gap-1">
              {(['Todas', 'Pendiente', 'En proceso', 'Aprobada', 'Requiere revisión'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#14181F] text-white border-[#14181F]'
                        : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9]'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredPhases.map((ph) => {
              const currentStatus = batch.statuses[ph.id] || 'Pendiente';
              return (
                <div
                  key={ph.id}
                  className="rounded-xl border border-[#E5DEC9] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBF9F5]/60 hover:bg-[#F3EFE6]/50 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#14181F]">
                        {ph.id}. {ph.name}
                      </span>
                      {onSelectPhase && (
                        <button
                          onClick={() => onSelectPhase(ph.id - 1)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3EFE6] hover:bg-[#C87D20] hover:text-white text-[10px] font-bold text-[#14181F] transition cursor-pointer"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" /> 3D
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-[#5C554B]">
                      <strong className="text-[#181C23]">Control:</strong>{' '}
                      {ph.qualityControl.toVerify}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {(
                      ['Pendiente', 'En proceso', 'Aprobada', 'Requiere revisión'] as PhaseStatus[]
                    ).map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          setBatch({
                            ...batch,
                            statuses: { ...batch.statuses, [ph.id]: st },
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          currentStatus === st
                            ? statusBadge(st)
                            : 'bg-white text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
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
    </div>
  );
};
