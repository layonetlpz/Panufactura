import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ArrowRight,
  GitCompare,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { DEFAULT_SIM_VARS, SimulationVariables } from '../engine3d/simulationConfig';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';

interface Props {
  simVars: SimulationVariables;
  onChangeVars: (next: SimulationVariables) => void;
  onOpenInTour?: (phaseIndex: number) => void;
}

interface ScenarioPreset {
  id: string;
  label: string;
  badge: string;
  previewPhase: number;
  params: SimulationVariables;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'optimal',
    label: 'Referencia Piloto Óptima',
    badge: 'Estándar',
    previewPhase: 13,
    params: DEFAULT_SIM_VARS,
  },
  {
    id: 'under-knead',
    label: 'Sub-amasado (Gluten débil)',
    badge: 'Fase 5',
    previewPhase: 5,
    params: { ...DEFAULT_SIM_VARS, kneadTime: 4 },
  },
  {
    id: 'under-ferm',
    label: 'Fermentación insuficiente / fría',
    badge: 'Fase 11',
    previewPhase: 11,
    params: { ...DEFAULT_SIM_VARS, fermTime: 22, fermTemp: 21, fermHumidity: 55 },
  },
  {
    id: 'over-ferm',
    label: 'Sobrefermentación y colapso',
    badge: 'Fase 11',
    previewPhase: 11,
    params: { ...DEFAULT_SIM_VARS, fermTime: 90, fermTemp: 38, fermHumidity: 88 },
  },
  {
    id: 'dry-crust',
    label: 'Encostramiento por baja HR',
    badge: 'Fase 11',
    previewPhase: 11,
    params: { ...DEFAULT_SIM_VARS, fermHumidity: 52 },
  },
  {
    id: 'under-bake',
    label: 'Horneado insuficiente (Crudo)',
    badge: 'Fase 13',
    previewPhase: 13,
    params: { ...DEFAULT_SIM_VARS, bakeTemp: 150, bakeTime: 9 },
  },
  {
    id: 'over-bake',
    label: 'Arrebato térmico / Quemado',
    badge: 'Fase 13',
    previewPhase: 13,
    params: { ...DEFAULT_SIM_VARS, bakeTemp: 230, bakeTime: 24 },
  },
  {
    id: 'heavy-portion',
    label: 'Porción sobredimensionada (115 g)',
    badge: 'Fase 10',
    previewPhase: 10,
    params: { ...DEFAULT_SIM_VARS, portionWeight: 115 },
  },
];

interface VariableDefinition {
  key: keyof SimulationVariables;
  name: string;
  description: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  optMin: number;
  optMax: number;
  refValue: number;
  refLabel: string;
  phaseId: number;
  lowInfo: {
    effect: string;
    defect: string;
    risk: string;
    action: string;
  };
  highInfo: {
    effect: string;
    defect: string;
    risk: string;
    action: string;
  };
}

const VARIABLE_DEFS: VariableDefinition[] = [
  {
    key: 'kneadTime',
    name: 'Tiempo de amasado intensivo',
    description: 'Trabajo mecánico en espiral (Velocidad 2) para hidratar y enlazar glutenina y gliadina.',
    unit: 'min',
    min: 2,
    max: 20,
    step: 1,
    optMin: 8,
    optMax: 12,
    refValue: 10,
    refLabel: '8 – 12 min',
    phaseId: 5,
    lowInfo: {
      effect: 'Desarrollo incompleto de la matriz viscoelástica de gluten; masa áspera y opaca.',
      defect: 'Masa poco desarrollada y pan de bajo volumen',
      risk: 'Baja retención de CO₂ durante la fermentación y miga compacta.',
      action: 'Prolongar el amasado 1–2 min adicionales hasta superar la prueba del velo.',
    },
    highInfo: {
      effect: 'Exceso de cizalla mecánica y calentamiento por fricción (> 29 °C).',
      defect: 'Masa demasiado pegajosa por ruptura de enlaces disulfuro',
      risk: 'Pérdida de tenacidad, dificultad de boleado y colapso en cámara.',
      action: 'Detener amasadora al lograr membrana translúcida y enfriar agua de fórmula.',
    },
  },
  {
    key: 'fermTime',
    name: 'Tiempo de fermentación final',
    description: 'Permanencia de los rollos formados en cámara para generación de CO₂ por Saccharomyces cerevisiae.',
    unit: 'min',
    min: 15,
    max: 100,
    step: 5,
    optMin: 45,
    optMax: 60,
    refValue: 52,
    refLabel: '45 – 60 min',
    phaseId: 11,
    lowInfo: {
      effect: 'Gasificación insuficiente antes de fijar la estructura en el horno.',
      defect: 'Fermentación insuficiente y miga densa',
      risk: 'Piezas pequeñas, pesadas y con corteza desgarrada por expansión brusca.',
      action: 'Mantener en cámara hasta que la pieza duplique volumen y responda al tacto suave.',
    },
    highInfo: {
      effect: 'Adelgazamiento extremo de las paredes alveolares y acumulación de ácidos orgánicos.',
      defect: 'Fermentación excesiva y colapso estructural',
      risk: 'Aplastamiento de los rollos al entrar al horno, corteza arrugada y aroma ácido.',
      action: 'Establecer temporizador con alarma a los 50 min y cargar al horno sin demora.',
    },
  },
  {
    key: 'fermTemp',
    name: 'Temperatura de cámara de fermentación',
    description: 'Condición térmica ambiental que regula la cinética metabólica de la levadura.',
    unit: '°C',
    min: 18,
    max: 42,
    step: 1,
    optMin: 28,
    optMax: 32,
    refValue: 30,
    refLabel: '28 – 32 °C',
    phaseId: 11,
    lowInfo: {
      effect: 'Cinética fermentativa lenta; retraso en el ciclo productivo.',
      defect: 'Fermentación lenta / Bajo volumen si se hornea a tiempo fijo',
      risk: 'Cuello de botella en planta o pan apelmazado.',
      action: 'Ajustar setpoint PID de cámara a 30 °C y verificar cierre hermético de puertas.',
    },
    highInfo: {
      effect: 'Aceleración descontrolada de levadura y ablandamiento excesivo de la grasa.',
      defect: 'Sobrefermentación térmica y pérdida de forma cilíndrica',
      risk: 'Desestabilización de la red de gluten y acidez secundaria.',
      action: 'Reducir temperatura de cámara a 28–32 °C y verificar calibración del sensor.',
    },
  },
  {
    key: 'fermHumidity',
    name: 'Humedad relativa de fermentación',
    description: 'Saturación de vapor en cámara para preservar la elasticidad superficial del rollo.',
    unit: '%',
    min: 50,
    max: 95,
    step: 5,
    optMin: 75,
    optMax: 85,
    refValue: 80,
    refLabel: '75 – 85% HR',
    phaseId: 11,
    lowInfo: {
      effect: 'Deshidratación superficial prematura de la masa cruda.',
      defect: 'Encostramiento superficial y corteza dura/opaca',
      risk: 'La piel seca frena el salto de horno (oven spring) y agrieta el rollo.',
      action: 'Aumentar generación de vapor al 80% HR o cubrir bandejas con película limpia.',
    },
    highInfo: {
      effect: 'Condensación de gotas de agua sobre la masa y las latas.',
      defect: 'Superficie pegajosa, ampollas en corteza y coloración manchada',
      risk: 'Adherencia excesiva a la bandeja y ampollas translúcidas al hornear.',
      action: 'Regular higrostato al 80% HR y evitar goteo directo sobre los panes.',
    },
  },
  {
    key: 'portionWeight',
    name: 'Peso por pieza cruda dividida',
    description: 'Masa unitaria obtenida en la Fase 7 (División) para cada rollo de pan de sal.',
    unit: 'g',
    min: 50,
    max: 120,
    step: 5,
    optMin: 77,
    optMax: 83,
    refValue: 80,
    refLabel: '80 g (±3 g)',
    phaseId: 10,
    lowInfo: {
      effect: 'Menor relación volumen/área superficial; transferencia térmica muy rápida.',
      defect: 'Piezas subdimensionadas y resequedad de miga',
      risk: 'Sobrecocción si se hornea con el tiempo estándar de 15 min.',
      action: 'Calibrar divisora volumétrica y verificar con balanza de control cada 10 piezas.',
    },
    highInfo: {
      effect: 'Mayor radio térmico hasta el núcleo del rollo y menor número de unidades por lote.',
      defect: 'Pan crudo en el centro o piezas pegadas en la bandeja',
      risk: 'Centro húmedo/pastoso (< 82 °C) con tiempo estándar de cocción.',
      action: 'Reajustar corte a 80 g o incrementar tiempo de horneado a temperatura moderada.',
    },
  },
  {
    key: 'bakeTemp',
    name: 'Temperatura de horneado',
    description: 'Temperatura de convección en cámara de cocción (Fase 13).',
    unit: '°C',
    min: 140,
    max: 240,
    step: 5,
    optMin: 180,
    optMax: 200,
    refValue: 190,
    refLabel: '180 – 200 °C',
    phaseId: 13,
    lowInfo: {
      effect: 'Flujo de calor lento; baja presión de vapor interna y escasa reacción de Maillard.',
      defect: 'Corteza pálida, bajo salto de horno y miga seca por cocción prolongada',
      risk: 'Producto sin el color dorado ni el aroma característico del pan rollo.',
      action: 'Precalentar el horno a 190 °C durante al menos 20 min antes de cargar las latas.',
    },
    highInfo: {
      effect: 'Pardeamiento de Maillard y caramelización acelerados en los primeros minutos.',
      defect: 'Corteza quemada / oscura con centro potencialmente crudo (arrebato)',
      risk: 'Rechazo sensorial por amargor y falta de gelatinización en el centro.',
      action: 'Reducir setpoint a 190 °C y comprobar temperatura interna con termómetro (~95 °C).',
    },
  },
  {
    key: 'bakeTime',
    name: 'Tiempo de horneado',
    description: 'Duración de exposición térmica en el horno hasta alcanzar ~82–96 °C en el centro.',
    unit: 'min',
    min: 6,
    max: 28,
    step: 1,
    optMin: 12,
    optMax: 18,
    refValue: 15,
    refLabel: '12 – 18 min',
    phaseId: 13,
    lowInfo: {
      effect: 'Gelatinización del almidón y coagulación proteica incompletas en el núcleo.',
      defect: 'Pan crudo en el centro y colapso al enfriar',
      risk: 'Miga pastosa e inestabilidad estructural al salir a las rejillas.',
      action: 'Mantener entre 14 y 16 min verificando dorado y temperatura interna > 85 °C.',
    },
    highInfo: {
      effect: 'Deshidratación excesiva de la miga y engrosamiento de la corteza.',
      defect: 'Corteza excesivamente dura y pérdida del carácter de pan blandito',
      risk: 'Merma de peso superior al 15% y envejecimiento prematuro.',
      action: 'Descargar bandejas inmediatamente al sonar la alarma de 15 minutos.',
    },
  },
];

export const VariablesSimView: React.FC<Props> = ({
  simVars,
  onChangeVars,
  onOpenInTour,
}) => {
  const [previewPhase, setPreviewPhase] = useState<number>(13);
  const [previewProgress, setPreviewProgress] = useState<number>(0.85);

  const evaluations = VARIABLE_DEFS.map((def) => {
    const val = simVars[def.key];
    const diff = val - def.refValue;
    const diffStr =
      diff === 0
        ? '0 (En valor central de referencia)'
        : `${diff > 0 ? '+' : ''}${diff} ${def.unit} vs. ref (${def.refValue} ${def.unit})`;

    if (val < def.optMin) {
      return {
        ...def,
        val,
        diff,
        diffStr,
        status: 'low' as const,
        statusLabel: 'Por debajo del rango',
        ...def.lowInfo,
      };
    }
    if (val > def.optMax) {
      return {
        ...def,
        val,
        diff,
        diffStr,
        status: 'high' as const,
        statusLabel: 'Por encima del rango',
        ...def.highInfo,
      };
    }
    return {
      ...def,
      val,
      diff,
      diffStr,
      status: 'ok' as const,
      statusLabel: 'Rango óptimo',
      effect: 'Comportamiento esperado según principios tecnológicos de panificación.',
      defect: 'Sin defecto previsible por esta variable',
      risk: 'Riesgo controlado dentro de la ventana operativa piloto.',
      action: 'Mantener monitoreo preventivo y registrar en bitácora de lote.',
    };
  });

  const outOfRangeCount = evaluations.filter((e) => e.status !== 'ok').length;

  // Didactic comparative metrics (Reference = 100% nominal indices)
  const glutenIndex = Math.round(
    Math.max(25, Math.min(130, (simVars.kneadTime / DEFAULT_SIM_VARS.kneadTime) * 100))
  );
  const volumeIndex = Math.round(
    Math.max(
      35,
      Math.min(
        145,
        ((simVars.fermTime / 52) * 0.6 + (simVars.fermTemp / 30) * 0.4) *
          (simVars.kneadTime < 6 ? 0.75 : 1) *
          100
      )
    )
  );
  const maillardIndex = Math.round(
    Math.max(
      20,
      Math.min(160, ((simVars.bakeTemp / 190) * 0.65 + (simVars.bakeTime / 15) * 0.35) * 100)
    )
  );
  const softnessIndex = Math.round(
    Math.max(
      25,
      Math.min(
        115,
        100 -
          Math.max(0, (simVars.bakeTime - 16) * 4) -
          Math.max(0, (75 - simVars.fermHumidity) * 1.2) -
          Math.abs(simVars.kneadTime - 10) * 2.5
      )
    )
  );

  return (
    <div className="space-y-6">
      {/* Methodological Disclaimer */}
      <div className="rounded-2xl bg-[#F3EFE6] border border-[#C87D20]/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#9A3412] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#181C23]">
            <strong className="text-[#14181F]">Laboratorio Paramétrico Didáctico: </strong>
            Los controles modifican la geometría 3D, el volumen y la coloración de Maillard en
            tiempo real a partir de los rangos técnicos documentados. Los índices comparativos son
            aproximaciones pedagógicas y no sustituyen pruebas reológicas o sensoriales de
            laboratorio.
          </div>
        </div>
        <button
          onClick={() => {
            onChangeVars(DEFAULT_SIM_VARS);
            setPreviewPhase(13);
            setPreviewProgress(0.85);
          }}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white text-xs font-bold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#F4D06F]" />
          Restablecer referencia piloto
        </button>
      </div>

      {/* Pedagogical Presets Strip */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#14181F]">
              Escenarios Pedagógicos Preconfigurados
            </h2>
            <p className="text-xs text-[#5C554B]">
              Selecciona una condición operativa para cargar sus variables y observar su efecto en
              el visor 3D
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              outOfRangeCount === 0
                ? 'bg-[#1B4332]/10 text-[#1B4332]'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {outOfRangeCount === 0
              ? '7/7 variables en rango óptimo'
              : `${outOfRangeCount} variable(s) fuera del rango de referencia`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                onChangeVars(sc.params);
                setPreviewPhase(sc.previewPhase);
                setPreviewProgress(0.85);
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border border-[#E5DEC9] bg-[#FBF9F5] hover:bg-[#F3EFE6] hover:border-[#C87D20] text-[#14181F] transition cursor-pointer"
            >
              <span>{sc.label}</span>
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-black/5 text-[#5C554B]">
                {sc.badge}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Split: Left 5 Cols (Sliders + 3D Live Preview) | Right 7 Cols (Comparative View + Evaluations) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 7 Parametric Sliders + Live 3D Chamber */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live 3D Specimen Preview */}
          <div className="rounded-2xl bg-[#14181F] text-white border border-[#2D3545] p-4 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono-tech uppercase text-[#F4D06F]">
                  Respuesta Visual 3D en Vivo
                </div>
                <h3 className="text-sm font-bold">Inspección de Masa y Producto</h3>
              </div>
              <div className="flex gap-1">
                {[
                  { p: 5, lbl: 'F5 Amasado' },
                  { p: 10, lbl: 'F10 Rollo' },
                  { p: 11, lbl: 'F11 Ferment.' },
                  { p: 13, lbl: 'F13 Horno' },
                ].map((b) => (
                  <button
                    key={b.p}
                    onClick={() => setPreviewPhase(b.p)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      previewPhase === b.p
                        ? 'bg-[#C87D20] text-white'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {b.lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10">
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
                phaseProgress={previewProgress}
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex-1 flex items-center gap-2 text-xs">
                <span className="text-slate-400 shrink-0">Avance de etapa:</span>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={previewProgress}
                  onChange={(e) => setPreviewProgress(Number(e.target.value))}
                  aria-label="Avance de etapa en vista previa 3D"
                  className="w-full accent-[#C87D20] cursor-pointer"
                />
                <span className="font-mono-tech text-[#F4D06F] w-10 text-right">
                  {Math.round(previewProgress * 100)}%
                </span>
              </div>
              {onOpenInTour && (
                <button
                  onClick={() => onOpenInTour(previewPhase - 1)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-[#F4D06F] cursor-pointer"
                >
                  Ver planta <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 7 Variable Control Sliders */}
          <div className="rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#14181F] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C87D20]" />
                Panel de Control de Variables (7)
              </h2>
              <span className="text-[11px] font-mono-tech text-[#5C554B]">
                Rango verde = Óptimo
              </span>
            </div>

            <div className="space-y-4">
              {VARIABLE_DEFS.map((v) => {
                const currentVal = simVars[v.key];
                const isOptimal = currentVal >= v.optMin && currentVal <= v.optMax;
                const optStartPct = ((v.optMin - v.min) / (v.max - v.min)) * 100;
                const optWidthPct = ((v.optMax - v.optMin) / (v.max - v.min)) * 100;

                return (
                  <div
                    key={v.key}
                    className={`p-3 rounded-xl border transition ${
                      isOptimal
                        ? 'bg-[#FBF9F5] border-[#E5DEC9]'
                        : 'bg-amber-50/60 border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span className="font-bold text-[#14181F]">{v.name}</span>
                      <div className="flex items-center gap-1.5 font-mono-tech">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isOptimal
                              ? 'bg-[#1B4332]/10 text-[#1B4332]'
                              : 'bg-amber-200/80 text-amber-950'
                          }`}
                        >
                          {currentVal} {v.unit}
                        </span>
                        <span className="text-[11px] text-[#5C554B]">
                          (Ref: {v.refLabel})
                        </span>
                      </div>
                    </div>

                    {/* Visual Optimal Window Bar */}
                    <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="absolute top-0 bottom-0 bg-[#1B4332]/40"
                        style={{ left: `${optStartPct}%`, width: `${optWidthPct}%` }}
                        title={`Rango óptimo: ${v.refLabel}`}
                      />
                    </div>

                    <input
                      type="range"
                      min={v.min}
                      max={v.max}
                      step={v.step}
                      value={currentVal}
                      aria-label={v.name}
                      onChange={(e) => {
                        onChangeVars({ ...simVars, [v.key]: Number(e.target.value) });
                        setPreviewPhase(v.phaseId);
                      }}
                      className="w-full accent-[#C87D20] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] font-mono-tech text-[#5C554B]">
                      <span>Mín: {v.min} {v.unit}</span>
                      <span>Óptimo: {v.refLabel}</span>
                      <span>Máx: {v.max} {v.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Comparative Analysis (Ref vs Modified) + 7 Detailed Diagnostic Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Comparative Matrix: Condición de Referencia vs Condición Modificada */}
          <section className="rounded-2xl bg-white border border-[#E5DEC9] p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#14181F] text-[#F4D06F]">
                  <GitCompare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#14181F]">
                    Vista Comparativa: Condición de Referencia vs. Condición Modificada
                  </h2>
                  <p className="text-xs text-[#5C554B]">
                    Evaluación didáctica de índices del proceso (Referencia Piloto = 100%)
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-side Parameter Summary Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F3EFE6] text-[#14181F] text-left border-b border-[#E5DEC9]">
                    <th className="p-2.5">Variable Operativa</th>
                    <th className="p-2.5 font-mono-tech">Referencia Piloto</th>
                    <th className="p-2.5 font-mono-tech">Valor Seleccionado</th>
                    <th className="p-2.5 font-mono-tech">Diferencia</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((ev) => (
                    <tr key={ev.key} className="border-b border-[#F3EFE6]">
                      <td className="p-2.5 font-bold text-[#14181F]">{ev.name}</td>
                      <td className="p-2.5 font-mono-tech text-[#5C554B]">
                        {ev.refValue} {ev.unit} ({ev.refLabel})
                      </td>
                      <td className="p-2.5 font-mono-tech font-bold text-[#14181F]">
                        {ev.val} {ev.unit}
                      </td>
                      <td className="p-2.5 font-mono-tech text-[#9A3412]">
                        {ev.diff > 0 ? `+${ev.diff}` : ev.diff} {ev.unit}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ev.status === 'ok'
                              ? 'bg-[#1B4332]/10 text-[#1B4332]'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {ev.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4 Comparative Didactic Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                {
                  label: 'Desarrollo de Red de Gluten',
                  val: glutenIndex,
                  optimalRange: '85% – 115%',
                  note:
                    glutenIndex < 80
                      ? 'Red débil (sub-amasado)'
                      : glutenIndex > 120
                      ? 'Sobre-amasado (ruptura)'
                      : 'Elasticidad y tenacidad óptimas',
                },
                {
                  label: 'Expansión Volumétrica (CO₂)',
                  val: volumeIndex,
                  optimalRange: '90% – 115%',
                  note:
                    volumeIndex < 85
                      ? 'Volumen bajo / miga densa'
                      : volumeIndex > 120
                      ? 'Riesgo de colapso estructural'
                      : 'Crecimiento alveolar uniforme',
                },
                {
                  label: 'Coloración Superficial (Maillard)',
                  val: maillardIndex,
                  optimalRange: '90% – 112%',
                  note:
                    maillardIndex < 85
                      ? 'Corteza pálida / cruda'
                      : maillardIndex > 120
                      ? 'Pardeamiento excesivo / quemado'
                      : 'Dorado característico pan rollo',
                },
                {
                  label: 'Suavidad de Miga (Pan Blandito)',
                  val: softnessIndex,
                  optimalRange: '85% – 105%',
                  note:
                    softnessIndex < 80
                      ? 'Corteza rígida o miga reseca'
                      : 'Textura blanda y corteza fina',
                },
              ].map((ind, idx) => {
                const isGood = ind.val >= 85 && ind.val <= 118;
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#14181F]">{ind.label}</span>
                      <span className="font-mono-tech font-bold text-[#9A3412]">
                        {ind.val}% <span className="text-[10px] text-[#5C554B]">(Ref: 100%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isGood ? 'bg-[#1B4332]' : 'bg-[#C87D20]'
                        }`}
                        style={{ width: `${Math.min(100, (ind.val / 140) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-[#5C554B]">{ind.note}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Detailed Diagnostic Cards per Variable */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#5C554B]">
              Diagnóstico Técnico por Variable (Efectos, Defectos y Acciones)
            </h3>
            {evaluations.map((ev) => (
              <div
                key={ev.key}
                className={`rounded-2xl border p-4 bg-white shadow-xs transition ${
                  ev.status === 'ok'
                    ? 'border-[#E5DEC9]'
                    : 'border-amber-400 ring-1 ring-amber-400/30'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {ev.status === 'ok' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#1B4332]" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-[#9A3412]" />
                      )}
                      <h4 className="font-bold text-sm text-[#14181F]">{ev.name}</h4>
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#F3EFE6] text-[#5C554B]">
                        Fase {ev.phaseId}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C554B] mt-0.5">{ev.description}</p>
                  </div>

                  <div className="text-right font-mono-tech text-xs">
                    <div className="font-bold text-[#14181F]">
                      Actual: {ev.val} {ev.unit}
                    </div>
                    <div className="text-[11px] text-[#9A3412]">{ev.diffStr}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-2 border-t border-[#F3EFE6]">
                  <div className="rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] p-2.5">
                    <span className="font-bold block text-[#14181F] mb-0.5">
                      Efecto técnico esperado
                    </span>
                    <p className="text-[#5C554B] leading-relaxed">{ev.effect}</p>
                  </div>
                  <div
                    className={`rounded-xl border p-2.5 ${
                      ev.status === 'ok'
                        ? 'bg-[#FBF9F5] border-[#E5DEC9]'
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <span className="font-bold block text-rose-900 mb-0.5">
                      Posible defecto / Riesgo
                    </span>
                    <p className="text-rose-950 font-semibold">{ev.defect}</p>
                    <p className="text-rose-900/80 text-[11px] mt-0.5">{ev.risk}</p>
                  </div>
                  <div className="rounded-xl bg-[#1B4332]/8 border border-[#1B4332]/20 p-2.5">
                    <span className="font-bold text-[#1B4332] flex items-center gap-1 mb-0.5">
                      <Wrench className="w-3 h-3" /> Acción preventiva / correctiva
                    </span>
                    <p className="text-[#181C23] leading-relaxed">{ev.action}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
