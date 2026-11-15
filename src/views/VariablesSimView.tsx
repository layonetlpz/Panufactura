import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, CheckCircle2, Info } from 'lucide-react';
import { DEFAULT_SIM_VARS, SimulationVariables } from '../engine3d/simulationConfig';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';

interface Props {
  simVars: SimulationVariables;
  onChangeVars: (next: SimulationVariables) => void;
}

interface ScenarioPreset {
  id: string;
  label: string;
  previewPhase: number;
  params: SimulationVariables;
}

const SCENARIOS: ScenarioPreset[] = [
  { id: 'optimal', label: 'Referencia Piloto Óptima', previewPhase: 13, params: DEFAULT_SIM_VARS },
  { id: 'under-knead', label: 'Amasado insuficiente', previewPhase: 5, params: { ...DEFAULT_SIM_VARS, kneadTime: 4 } },
  { id: 'under-ferm', label: 'Fermentación insuficiente', previewPhase: 11, params: { ...DEFAULT_SIM_VARS, fermTime: 20, fermTemp: 21, fermHumidity: 55 } },
  { id: 'over-ferm', label: 'Fermentación excesiva', previewPhase: 11, params: { ...DEFAULT_SIM_VARS, fermTime: 90, fermTemp: 38 } },
  { id: 'under-bake', label: 'Horneado insuficiente', previewPhase: 13, params: { ...DEFAULT_SIM_VARS, bakeTemp: 150, bakeTime: 9 } },
  { id: 'over-bake', label: 'Horneado excesivo', previewPhase: 13, params: { ...DEFAULT_SIM_VARS, bakeTemp: 230, bakeTime: 24 } },
  { id: 'unequal-weight', label: 'Porciones sobredimensionadas', previewPhase: 10, params: { ...DEFAULT_SIM_VARS, portionWeight: 115 } },
];

export const VariablesSimView: React.FC<Props> = ({ simVars, onChangeVars }) => {
  const [previewPhase, setPreviewPhase] = useState<number>(13);

  const evaluateVariable = (
    name: string,
    val: number,
    refLabel: string,
    min: number,
    max: number,
    unit: string,
    lowEffect: { effect: string; risk: string; rec: string },
    highEffect: { effect: string; risk: string; rec: string }
  ) => {
    const mid = (min + max) / 2;
    const diff = val - mid;
    const diffStr = `${diff > 0 ? '+' : ''}${diff.toFixed(0)} ${unit} frente al centro de referencia`;
    if (val < min) {
      return { name, refLabel, val: `${val} ${unit}`, diffStr, status: 'warning' as const, ...lowEffect };
    }
    if (val > max) {
      return { name, refLabel, val: `${val} ${unit}`, diffStr, status: 'danger' as const, ...highEffect };
    }
    return {
      name,
      refLabel,
      val: `${val} ${unit}`,
      diffStr: 'Dentro del rango de referencia',
      status: 'ok' as const,
      effect: 'Comportamiento esperado según principios tecnológicos de panificación.',
      risk: 'Bajo riesgo de defecto asociado a esta variable.',
      rec: 'Mantener monitoreo y registro en bitácora de lote.',
    };
  };

  const evaluations = [
    evaluateVariable('Tiempo de amasado', simVars.kneadTime, '8 – 12 min', 8, 12, 'min', {
      effect: 'Red de gluten poco desarrollada; masa menos homogénea.',
      risk: 'Alto riesgo de pan de bajo volumen y miga compacta.',
      rec: 'Prolongar el amasado hasta superar la prueba del velo.',
    }, {
      effect: 'Sobre-amasado por exceso de trabajo mecánico y fricción.',
      risk: 'Ruptura de gluten, masa pegajosa y colapso.',
      rec: 'Reducir tiempo y controlar T final de masa (24–28 °C).',
    }),
    evaluateVariable('Tiempo de fermentación final', simVars.fermTime, '45 – 60 min', 45, 60, 'min', {
      effect: 'Producción insuficiente de CO₂ antes del horneado.',
      risk: 'Pan pesado, de bajo volumen y miga densa.',
      rec: 'Permitir reposo hasta duplicar volumen con resiliencia táctil.',
    }, {
      effect: 'Exceso de expansión y debilitamiento de las paredes celulares.',
      risk: 'Fermentación excesiva, colapso estructural y sabor ácido.',
      rec: 'Hornear al alcanzar el volumen óptimo sin exceder tiempo.',
    }),
    evaluateVariable('Temperatura y humedad de fermentación', simVars.fermTemp, '28 – 32 °C', 28, 32, '°C', {
      effect: 'Actividad metabólica lenta de Saccharomyces cerevisiae.',
      risk: 'Fermentación insuficiente y retraso operativo.',
      rec: 'Ajustar cámara a 28–32 °C y 75–85% HR.',
    }, {
      effect: 'Aceleración excesiva difícil de controlar.',
      risk: 'Sobrefermentación, pérdida de estructura y acidez.',
      rec: 'Reducir temperatura de cámara y controlar T inicial de masa.',
    }),
    evaluateVariable('Temperatura de horneado', simVars.bakeTemp, '180 – 200 °C', 180, 200, '°C', {
      effect: 'Transferencia de calor lenta; menor oven spring.',
      risk: 'Coloración superficial limitada y cocción incompleta.',
      rec: 'Precalentar el horno a 180–200 °C antes de cargar.',
    }, {
      effect: 'Pardeamiento acelerado antes de cocer el centro.',
      risk: 'Corteza quemada/oscura y centro potencialmente crudo.',
      rec: 'Disminuir temperatura y verificar T interna (~82–96 °C).',
    }),
    evaluateVariable('Tiempo de horneado', simVars.bakeTime, '12 – 18 min', 12, 18, 'min', {
      effect: 'Gelatinización y coagulación incompletas.',
      risk: 'Producto crudo en el centro y colapso al enfriar.',
      rec: 'Completar cocción verificando con termómetro de punzón.',
    }, {
      effect: 'Evaporación excesiva de humedad.',
      risk: 'Corteza demasiado dura y pérdida de suavidad.',
      rec: 'Retirar del horno al alcanzar dorado uniforme.',
    }),
    evaluateVariable('Peso por porción cruda', simVars.portionWeight, '80 g (±3 g)', 77, 83, 'g', {
      effect: 'Piezas pequeñas que se cuecen más rápido.',
      risk: 'Resequedad o sobrecocción en bandeja mixta.',
      rec: 'Controlar pesaje en fase de división.',
    }, {
      effect: 'Mayor masa térmica en el centro de cada rollo.',
      risk: 'Piezas desiguales y riesgo de centro crudo.',
      rec: 'Uniformar corte a 80 g o ajustar tiempo de horneado.',
    }),
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-950">
          <span className="font-bold">Modelo visual y didáctico: </span>
          Las variables ajustan la representación 3D del volumen, la textura superficial y la coloración según principios de la investigación técnica. No representa un simulador científico validado en laboratorio.
        </div>
      </div>

      {/* Scenarios */}
      <div className="rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1E293B]">Escenarios pedagógicos rápidos</h2>
          <button
            onClick={() => {
              onChangeVars(DEFAULT_SIM_VARS);
              setPreviewPhase(13);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restablecer referencia
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                onChangeVars(sc.params);
                setPreviewPhase(sc.previewPhase);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-700 transition cursor-pointer"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders + Live 3D Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white border border-[#E7DFD3] p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1E293B]">Ajuste de variables</h2>
            {[
              { key: 'kneadTime', label: 'Tiempo de amasado', min: 2, max: 20, step: 1, unit: 'min', ref: '8–12 min', phase: 5 },
              { key: 'fermTime', label: 'Tiempo de fermentación final', min: 15, max: 100, step: 5, unit: 'min', ref: '45–60 min', phase: 11 },
              { key: 'fermTemp', label: 'Temperatura de fermentación', min: 18, max: 42, step: 1, unit: '°C', ref: '28–32 °C', phase: 11 },
              { key: 'fermHumidity', label: 'Humedad de fermentación', min: 50, max: 95, step: 5, unit: '%', ref: '75–85%', phase: 11 },
              { key: 'bakeTemp', label: 'Temperatura de horneado', min: 140, max: 240, step: 5, unit: '°C', ref: '180–200 °C', phase: 13 },
              { key: 'bakeTime', label: 'Tiempo de horneado', min: 6, max: 28, step: 1, unit: 'min', ref: '12–18 min', phase: 13 },
              { key: 'portionWeight', label: 'Peso por porción cruda', min: 50, max: 120, step: 5, unit: 'g', ref: '80 g', phase: 10 },
            ].map((s) => (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1E293B]">{s.label}</span>
                  <span className="text-amber-800">
                    {simVars[s.key as keyof SimulationVariables]} {s.unit}{' '}
                    <span className="text-slate-400 font-normal">(Ref: {s.ref})</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={simVars[s.key as keyof SimulationVariables]}
                  onChange={(e) => {
                    onChangeVars({ ...simVars, [s.key]: Number(e.target.value) });
                    setPreviewPhase(s.phase);
                  }}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Live 3D Preview Box */}
          <div className="rounded-2xl bg-white border border-[#E7DFD3] p-3 shadow-sm space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#1E293B]">Vista 3D en tiempo real</span>
              <div className="flex gap-1">
                {[
                  { p: 5, lbl: 'Amasado' },
                  { p: 11, lbl: 'Ferment.' },
                  { p: 13, lbl: 'Horno' },
                ].map((b) => (
                  <button
                    key={b.p}
                    onClick={() => setPreviewPhase(b.p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                      previewPhase === b.p ? 'bg-[#1E293B] text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {b.lbl}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 w-full">
              <GraphicsEngine
                activePhaseId={previewPhase}
                visualKey="baking"
                visualCaption="Efecto visual didáctico en tiempo real."
                isPlaying={true}
                speed={1}
                cameraPreset="closeup"
                cameraTrigger={previewPhase}
                quality="medium"
                simVars={simVars}
                selectedMachineId={null}
                onSelectMachine={() => {}}
                focusMachineId={null}
                showHotspots={false}
              />
            </div>
          </div>
        </div>

        {/* Evaluation Cards */}
        <div className="lg:col-span-7 space-y-3">
          {evaluations.map((ev, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 bg-white shadow-sm ${
                ev.status === 'ok' ? 'border-emerald-200' : ev.status === 'warning' ? 'border-amber-300' : 'border-rose-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {ev.status === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-600" />
                  )}
                  <h3 className="font-bold text-sm text-[#1E293B]">{ev.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">Ref: {ev.refLabel}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Sel: {ev.val}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-2">Diferencia: {ev.diffStr}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5">
                  <span className="font-bold block text-slate-700 mb-0.5">Efecto posible</span>
                  {ev.effect}
                </div>
                <div className="rounded-lg bg-rose-50/60 p-2.5">
                  <span className="font-bold block text-rose-800 mb-0.5">Riesgo de defecto</span>
                  {ev.risk}
                </div>
                <div className="rounded-lg bg-emerald-50/60 p-2.5">
                  <span className="font-bold block text-emerald-800 mb-0.5">Recomendación</span>
                  {ev.rec}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
