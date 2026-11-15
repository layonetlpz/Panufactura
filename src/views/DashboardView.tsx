import React from 'react';
import {
  Play, Sliders, GitBranch, Wheat, ShieldCheck, ClipboardCheck,
  Presentation, GraduationCap, Wrench, ArrowRight, CheckCircle2
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { PhaseIllustration } from '../components/PhaseIllustration';

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
}

export const DashboardView: React.FC<Props> = ({ onNavigate, visitedPhases }) => {
  const progressPct = Math.round((visitedPhases.length / PHASES_DATA.length) * 100);

  const quickCards: { view: AppView; title: string; desc: string; icon: React.ReactNode; badge: string }[] = [
    {
      view: 'tour',
      title: 'Recorrido y Simulación Visual',
      desc: 'Explora paso a paso las 18 fases desde recepción de harina hasta distribución.',
      icon: <Play className="w-5 h-5 text-amber-700" />,
      badge: 'Módulo central',
    },
    {
      view: 'variables',
      title: 'Simulador de Variables',
      desc: 'Modifica tiempos, temperaturas y pesos para observar efectos didácticos y riesgos.',
      icon: <Sliders className="w-5 h-5 text-amber-700" />,
      badge: 'Modelo didáctico',
    },
    {
      view: 'diagram',
      title: 'Diagrama de Proceso',
      desc: 'Flujo interactivo con operaciones, inspecciones, almacenamientos y decisiones.',
      icon: <GitBranch className="w-5 h-5 text-amber-700" />,
      badge: 'ASME + Flujo',
    },
    {
      view: 'formulation',
      title: 'Ficha Técnica y Formulación',
      desc: 'Porcentaje panadero, función de ingredientes y calculadora de escalamiento.',
      icon: <Wheat className="w-5 h-5 text-amber-700" />,
      badge: 'Piloto 80 g',
    },
    {
      view: 'quality',
      title: 'Calidad, BPM e Inocuidad',
      desc: 'Controles por etapa, matriz interactiva de defectos y diferencia PC vs. PCC.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-700" />,
      badge: 'Res. 2674/2013',
    },
    {
      view: 'equipment',
      title: 'Maquinaria y Equipos',
      desc: 'Galería técnica desde báscula hasta horno y selladora por escala productiva.',
      icon: <Wrench className="w-5 h-5 text-amber-700" />,
      badge: '10 equipos',
    },
    {
      view: 'batch',
      title: 'Control de Lote',
      desc: 'Simula una orden de producción con checklist de calidad guardado localmente.',
      icon: <ClipboardCheck className="w-5 h-5 text-amber-700" />,
      badge: 'Trazabilidad',
    },
    {
      view: 'quiz',
      title: 'Evaluación de Conocimientos',
      desc: 'Cuestionario interactivo de 8 preguntas con retroalimentación inmediata.',
      icon: <GraduationCap className="w-5 h-5 text-amber-700" />,
      badge: 'Autoevaluación',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#273449] to-[#3A2A1D] text-white p-6 sm:p-10 shadow-lg border border-amber-900/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold tracking-wide uppercase">
              Simulador Educativo de Ingeniería Industrial y Alimentos
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              PANUFACTURA
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
              Simulador interactivo del proceso completo de manufactura del{' '}
              <span className="text-amber-300 font-semibold">pan de sal tradicional tipo rollo</span>{' '}
              (estilo pan blandito colombiano, sin relleno), desde la recepción de materias primas hasta la distribución final.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('tour', 0)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Iniciar recorrido (18 fases)
              </button>
              <button
                onClick={() => onNavigate('presentation', 0)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition cursor-pointer"
              >
                <Presentation className="w-4 h-4" />
                Modo exposición en aula
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <PhaseIllustration visualKey="baking" phaseId={13} />
            <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-amber-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Progreso del recorrido técnico
                </span>
                <span className="font-bold text-white">
                  {visitedPhases.length} / {PHASES_DATA.length} fases ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Reference Banner */}
      <section className="rounded-xl bg-amber-50 border border-amber-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-950">Producto y Formulación Piloto de Referencia</h2>
          <p className="text-sm text-amber-900/90 mt-1">
            Pan de sal tradicional tipo rollo (80 g de masa cruda/unidad; masa base total 1.693 g para ~21 unidades).
            Propuesta piloto basada en principios tecnológicos de panificación; no constituye una receta validada experimentalmente.
          </p>
        </div>
        <button
          onClick={() => onNavigate('formulation')}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium transition cursor-pointer"
        >
          Ver ficha y calculadora
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Module Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#1E293B]">Módulos del Simulador</h2>
          <span className="text-xs font-medium text-[#6B5E53] uppercase tracking-wider">Acceso directo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card) => (
            <button
              key={card.view}
              onClick={() => onNavigate(card.view)}
              className="text-left group rounded-xl bg-white border border-[#E7DFD3] hover:border-amber-500 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#1E293B] group-hover:text-amber-700 transition">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B5E53] mt-1.5 leading-relaxed">{card.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700">
                Abrir módulo <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
