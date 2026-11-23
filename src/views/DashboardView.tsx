import React, { useState } from 'react';
import {
  Play,
  Sliders,
  GitBranch,
  Wheat,
  ShieldCheck,
  ClipboardCheck,
  Presentation,
  GraduationCap,
  Wrench,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  Gauge,
  Compass,
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';
import { SimulationVariables } from '../engine3d/simulationConfig';

export type AppView =
  | 'dashboard'
  | 'tour'
  | 'variables'
  | 'formulation'
  | 'equipment'
  | 'quality'
  | 'diagram'
  | 'batch'
  | 'presentation'
  | 'quiz';

interface Props {
  onNavigate: (view: AppView, phaseIndex?: number) => void;
  visitedPhases: number[];
  activePhaseIndex: number;
  simVars: SimulationVariables;
  onResetProgress: () => void;
}

export const DashboardView: React.FC<Props> = ({
  onNavigate,
  visitedPhases,
  activePhaseIndex,
  simVars,
  onResetProgress,
}) => {
  const [heroPreviewPhaseId, setHeroPreviewPhaseId] = useState<number>(13);

  const progressPct = Math.round((visitedPhases.length / PHASES_DATA.length) * 100);
  const currentPhase = PHASES_DATA[activePhaseIndex] || PHASES_DATA[0];
  const heroPhase = PHASES_DATA.find((p) => p.id === heroPreviewPhaseId) || PHASES_DATA[12];

  // Next unvisited phase suggestion
  const nextUnvisitedPhase =
    PHASES_DATA.find((p) => !visitedPhases.includes(p.id)) || currentPhase;

  return (
    <div className="space-y-8">
      {/* ==================== 1. EDITORIAL & TECHNOLOGICAL HERO ==================== */}
      <section className="relative rounded-3xl bg-[#14181F] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#2D3545] overflow-hidden">
        {/* Subtle architectural grid background accent */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #C87D20 0%, transparent 45%), radial-gradient(circle at 85% 80%, #1B4332 0%, transparent 45%)',
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-[#C87D20]/40 text-[#F4D06F] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C87D20]" />
              <span>Ingeniería Industrial y de Alimentos · Simulación WebGL 2</span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono-tech uppercase tracking-widest text-slate-400">
                PANUFACTURA 3.0 · PLATAFORMA DE MANUFACTURA
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-white">
                Del trigo al proceso industrial
              </h1>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              Laboratorio interactivo y planta tridimensional para el estudio integral de la fabricación del{' '}
              <span className="text-[#F4D06F] font-semibold">
                pan de sal tradicional tipo rollo
              </span>{' '}
              (estilo pan blandito colombiano, sin relleno). Explora las 18 operaciones unitarias,
              modifica variables críticas y analiza la transformación progresiva de la masa en tiempo real.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('tour', activePhaseIndex)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C87D20] to-[#B45309] hover:from-[#D98A26] hover:to-[#C87D20] text-white font-bold text-sm shadow-lg shadow-[#C87D20]/25 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Iniciar simulación 3D
              </button>

              <button
                onClick={() => onNavigate('diagram')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-[#F4D06F]" />
                Explorar el proceso
              </button>

              <button
                onClick={() => onNavigate('presentation', activePhaseIndex)}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#1B4332]/70 hover:bg-[#1B4332] text-emerald-100 font-semibold text-sm border border-emerald-500/30 transition cursor-pointer"
              >
                <Presentation className="w-4 h-4 text-emerald-300" />
                Modo exposición
              </button>
            </div>

            {/* Verified Project Data Strip */}
            <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] text-slate-400">Secuencia técnica</div>
                <div className="text-lg font-bold font-mono-tech text-white">18 Fases</div>
                <div className="text-[11px] text-[#F4D06F]">5 zonas de planta</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] text-slate-400">Unidad de referencia</div>
                <div className="text-lg font-bold font-mono-tech text-white">80 g crudo</div>
                <div className="text-[11px] text-emerald-300">Pan rollo sin relleno</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] text-slate-400">Fórmula base</div>
                <div className="text-lg font-bold font-mono-tech text-white">169,3%</div>
                <div className="text-[11px] text-slate-300">1.693 g (~21 unid.)</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] text-slate-400">Avance actual</div>
                <div className="text-lg font-bold font-mono-tech text-[#F4D06F]">{progressPct}%</div>
                <div className="text-[11px] text-slate-300">{visitedPhases.length}/18 visitadas</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Bakery Showcase */}
          <div className="lg:col-span-5 space-y-3">
            <div className="rounded-2xl bg-[#1E242E] border border-white/15 p-3.5 shadow-2xl space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-slate-200 whitespace-nowrap">
                    Vista 3D en Vivo
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {[
                    { id: 1, label: 'Recepción' },
                    { id: 5, label: 'Amasado' },
                    { id: 11, label: 'Ferment.' },
                    { id: 13, label: 'Horneado' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setHeroPreviewPhaseId(st.id)}
                      className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                        heroPreviewPhaseId === st.id
                          ? 'bg-[#C87D20] text-white'
                          : 'bg-white/8 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-white/10">
                <GraphicsEngine
                  activePhaseId={heroPreviewPhaseId}
                  visualKey={heroPhase.visualStateKey}
                  visualCaption={heroPhase.visualCaption}
                  isPlaying={true}
                  speed={1}
                  cameraPreset="station"
                  cameraTrigger={heroPreviewPhaseId}
                  quality="medium"
                  simVars={simVars}
                  selectedMachineId={null}
                  onSelectMachine={() => {}}
                  focusMachineId={null}
                  showHotspots={false}
                />
              </div>
              <div className="rounded-xl bg-[#14181F]/90 px-3.5 py-2.5 border border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono-tech uppercase text-[#F4D06F]">
                    Estación Activa · Fase {heroPhase.id}/18
                  </div>
                  <div className="text-xs font-bold text-white truncate">{heroPhase.name}</div>
                </div>
                <button
                  onClick={() => onNavigate('tour', heroPreviewPhaseId - 1)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[#C87D20] hover:bg-[#B45309] text-white text-xs font-bold cursor-pointer"
                >
                  Abrir en 3D →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. CONTINUAR APRENDIZAJE (LEARNING CONTINUITY) ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold">
                Continuidad del Recorrido
              </span>
              <span className="text-xs font-mono-tech text-[#5C554B]">
                {visitedPhases.length} de {PHASES_DATA.length} etapas exploradas ({progressPct}%)
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#14181F]">
              Última fase consultada: Fase {currentPhase.id} — {currentPhase.name}
            </h2>
            <p className="text-sm text-[#5C554B]">
              {currentPhase.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('tour', activePhaseIndex)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white text-xs font-bold cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#F4D06F] fill-current" />
              Retomar Fase {currentPhase.id}
            </button>
            {nextUnvisitedPhase.id !== currentPhase.id && (
              <button
                onClick={() => onNavigate('tour', nextUnvisitedPhase.id - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C87D20]/15 hover:bg-[#C87D20]/25 text-[#9A3412] border border-[#C87D20]/30 text-xs font-bold cursor-pointer"
              >
                Siguiente pendiente: Fase {nextUnvisitedPhase.id} →
              </button>
            )}
            <button
              onClick={onResetProgress}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E5DEC9] hover:bg-[#F3EFE6] text-xs font-semibold text-[#5C554B] cursor-pointer"
              title="Reiniciar registro de fases visitadas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar avance
            </button>
          </div>
        </div>

        {/* 18-Phase Interactive Progress Strip (2 spacious rows of 9 on desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2 pt-1">
          {PHASES_DATA.map((ph, idx) => {
            const isVisited = visitedPhases.includes(ph.id);
            const isCurrent = idx === activePhaseIndex;
            return (
              <button
                key={ph.id}
                onClick={() => onNavigate('tour', idx)}
                title={`Fase ${ph.id}: ${ph.name} (${ph.zone})`}
                className={`group p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#14181F] text-white border-[#14181F] ring-2 ring-[#C87D20]'
                    : isVisited
                    ? 'bg-[#1B4332]/10 text-[#1B4332] border-[#1B4332]/30 hover:bg-[#1B4332]/20'
                    : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:border-[#C87D20]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono-tech text-[11px] font-bold">
                    {String(ph.id).padStart(2, '0')}
                  </span>
                  {isVisited && (
                    <CheckCircle2
                      className={`w-3 h-3 ${isCurrent ? 'text-[#F4D06F]' : 'text-[#1B4332]'}`}
                    />
                  )}
                </div>
                <div className="text-[10px] font-semibold truncate mt-1 w-full">
                  {ph.shortName}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================== 3. HIERARCHICAL BENTO MODULE ARCHITECTURE ==================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-wider text-[#9A3412] font-bold">
              Arquitectura Funcional de PANUFACTURA
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#14181F]">
              Módulos de Simulación, Ingeniería y Control
            </h2>
          </div>
          <span className="text-xs text-[#5C554B]">
            Selecciona un entorno de trabajo especializado
          </span>
        </div>

        {/* Tier 1: Flagship Interactive Engines (2 Large Featured Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Flagship 1: 3D Simulator */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#14181F] to-[#1E2633] text-white p-6 shadow-md border border-[#2D3545] flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C87D20] text-white text-xs font-bold">
                  <Compass className="w-3.5 h-3.5" /> Motor Principal · WebGL 2
                </span>
                <span className="text-xs font-mono-tech text-slate-300">
                  8 Estaciones · 18 Estados de Masa
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Recorrido y Simulador Tridimensional de Planta
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Navega por la planta de panificación con cámaras orbitales, selecciona máquinas
                mediante raycasting 3D, inspecciona componentes con hotspots y controla la
                transformación continua de la masa con el nuevo reproductor multimedia.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {[
                  'Iluminación PBR y Sombras',
                  'Transformación Progresiva de Masa',
                  'Línea de Tiempo Multimedia',
                  'Fichas Técnicas ASME / BPM',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="text-xs text-slate-300">
                Estación actual: <strong className="text-[#F4D06F]">{currentPhase.name}</strong>
              </div>
              <button
                onClick={() => onNavigate('tour', activePhaseIndex)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C87D20] hover:bg-[#B45309] text-white text-xs font-bold transition cursor-pointer"
              >
                Abrir Simulador 3D <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flagship 2: Process Variables Laboratory */}
          <div className="lg:col-span-5 rounded-2xl bg-white border-2 border-[#C87D20]/40 p-6 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-[#C87D20]/15 text-[#9A3412]">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold">
                  Laboratorio Paramétrico
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#14181F]">
                Simulador de Variables Operativas
              </h3>
              <p className="text-sm text-[#5C554B] leading-relaxed">
                Experimenta con 7 variables críticas (amasado, fermentación, temperatura, humedad,
                peso unitario y horneado). Compara la condición de referencia contra escenarios de
                falla y observa la respuesta en el modelo 3D.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="rounded-lg bg-[#FBF9F5] border border-[#E5DEC9] p-2">
                  <span className="text-[#5C554B] block text-[10px]">Fermentación Ref.</span>
                  <strong className="font-mono-tech text-[#14181F]">28–32 °C · 75–85%</strong>
                </div>
                <div className="rounded-lg bg-[#FBF9F5] border border-[#E5DEC9] p-2">
                  <span className="text-[#5C554B] block text-[10px]">Horneado Ref.</span>
                  <strong className="font-mono-tech text-[#14181F]">180–200 °C · 15 min</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('variables')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white text-xs font-bold transition cursor-pointer"
            >
              Ingresar al Laboratorio de Variables <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Core Engineering & Formulation Modules (4-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              view: 'formulation' as AppView,
              title: 'Formulación y Calculadora',
              badge: 'Harina = 100%',
              desc: 'Porcentaje panadero validado matemáticamente, función tecnológica por ingrediente y escalamiento de lote.',
              metric: '1.000 g base → 1.693 g masa',
              icon: <Wheat className="w-5 h-5 text-[#C87D20]" />,
            },
            {
              view: 'equipment' as AppView,
              title: 'Catálogo de Maquinaria',
              badge: '10 Equipos',
              desc: 'Fichas de ingeniería con esquemas técnicos, componentes, variables asociadas, seguridad LOTO y mantenimiento.',
              metric: 'Artesanal a Industrial',
              icon: <Wrench className="w-5 h-5 text-[#1B4332]" />,
            },
            {
              view: 'quality' as AppView,
              title: 'Calidad, BPM e Inocuidad',
              badge: 'Res. 2674 / HACCP',
              desc: 'Controles por etapa, distinción entre BPM, PC y posible PCC térmico, y matriz visual de 11 defectos del pan.',
              metric: '11 defectos diagnosticados',
              icon: <ShieldCheck className="w-5 h-5 text-[#9A3412]" />,
            },
            {
              view: 'diagram' as AppView,
              title: 'Diagrama ASME Interactivo',
              badge: 'Flujo + Zoom',
              desc: 'Secuencia completa del proceso con simbología ASME, puntos de decisión, filtros por zona e inspector lateral.',
              metric: '18 etapas + 4 decisiones',
              icon: <GitBranch className="w-5 h-5 text-[#14181F]" />,
            },
          ].map((card) => (
            <button
              key={card.view}
              onClick={() => onNavigate(card.view)}
              className="text-left group rounded-2xl bg-white border border-[#E5DEC9] hover:border-[#C87D20] p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E5DEC9] group-hover:bg-[#C87D20]/10 transition">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-mono-tech font-bold px-2.5 py-0.5 rounded-full bg-[#F3EFE6] text-[#181C23]">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#14181F] group-hover:text-[#9A3412] transition">
                  {card.title}
                </h3>
                <p className="text-xs text-[#5C554B] leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F3EFE6] flex items-center justify-between text-xs">
                <span className="font-mono-tech text-[11px] text-[#5C554B]">{card.metric}</span>
                <span className="font-bold text-[#9A3412] inline-flex items-center">
                  Abrir <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Tier 3: Production Management, Classroom Presentation & Evaluation (3-Column Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-tech uppercase font-bold text-[#1B4332]">
                  Simulación de Planta
                </span>
                <h3 className="text-base font-bold text-[#14181F] mt-0.5">
                  Control de Lotes y Trazabilidad
                </h3>
              </div>
              <ClipboardCheck className="w-5 h-5 text-[#1B4332] shrink-0" />
            </div>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Gestiona una orden de producción simulada con cálculo automático de insumos, estados
              por etapa, bitácora de incidencias y persistencia local.
            </p>
            <button
              onClick={() => onNavigate('batch')}
              className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4332] hover:underline cursor-pointer"
            >
              Gestionar lote simulado <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-tech uppercase font-bold text-[#9A3412]">
                  Sustentación Académica
                </span>
                <h3 className="text-base font-bold text-[#14181F] mt-0.5">
                  Modo Exposición Profesional
                </h3>
              </div>
              <Presentation className="w-5 h-5 text-[#9A3412] shrink-0" />
            </div>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Interfaz optimizada para proyectores y salón de clases con visor 3D expandido,
              tipografía de alto contraste y control por teclado (←, →, Espacio, Esc).
            </p>
            <button
              onClick={() => onNavigate('presentation', activePhaseIndex)}
              className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#9A3412] hover:underline cursor-pointer"
            >
              Iniciar modo aula <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono-tech uppercase font-bold text-[#14181F]">
                  Autoevaluación Técnica
                </span>
                <h3 className="text-base font-bold text-[#14181F] mt-0.5">
                  Evaluación de Conocimientos
                </h3>
              </div>
              <GraduationCap className="w-5 h-5 text-[#14181F] shrink-0" />
            </div>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Banco de 12 preguntas estructuradas en 8 ejes temáticos (materias primas, amasado,
              fermentación, horneado, maquinaria, variables y BPM/HACCP).
            </p>
            <button
              onClick={() => onNavigate('quiz')}
              className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#14181F] hover:underline cursor-pointer"
            >
              Resolver cuestionario <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 4. ACADEMIC RIGOR & REFERENCE PRODUCT FOOTNOTE ==================== */}
      <section className="rounded-2xl bg-white border border-[#E5DEC9] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#1B4332]/10 text-[#1B4332] shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#14181F]">
              Nota Metodológica y Rigor Académico
            </h3>
            <p className="text-xs text-[#5C554B] leading-relaxed max-w-4xl">
              Producto de referencia: <strong>pan de sal tradicional tipo rollo, estilo pan blandito colombiano, sin relleno</strong>{' '}
              (porción cruda de 80 g; masa base de 1.693 g para ~21 unidades). La formulación y las
              relaciones causa-efecto del simulador constituyen una <strong>propuesta piloto académica y un modelo didáctico</strong>{' '}
              fundamentado en principios tecnológicos de panificación y normativa sanitaria colombiana
              (Resolución 2674 de 2013, Decreto 1944 de 1996, Decreto 60 de 2002); no representan
              mediciones experimentales ni registros industriales de una empresa particular.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('formulation')}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F3EFE6] hover:bg-[#E5DEC9] text-[#14181F] text-xs font-bold transition cursor-pointer"
        >
          <Gauge className="w-4 h-4 text-[#9A3412]" />
          Consultar ficha piloto
        </button>
      </section>
    </div>
  );
};
