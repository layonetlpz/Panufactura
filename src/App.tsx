import React, { useEffect, useState } from 'react';
import {
  Wheat,
  Menu,
  X,
  Presentation,
  Home,
  Play,
  Sliders,
  GitBranch,
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  GraduationCap,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PHASES_DATA } from './data/phasesData';
import { DEFAULT_SIM_VARS, SimulationVariables } from './engine3d/simulationConfig';
import { DashboardView, AppView } from './views/DashboardView';
import { ProcessTourView } from './views/ProcessTourView';
import { VariablesSimView } from './views/VariablesSimView';
import { FormulationView } from './views/FormulationView';
import { EquipmentView } from './views/EquipmentView';
import { QualityView } from './views/QualityView';
import { FlowDiagramView } from './views/FlowDiagramView';
import { BatchControlView } from './views/BatchControlView';
import { PresentationModeView } from './views/PresentationModeView';
import { QuizView } from './views/QuizView';

const VISITED_KEY = 'panufactura_visited_phases_v1';

interface NavItemConfig {
  id: AppView;
  label: string;
  shortLabel: string;
  category: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
}

export function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [simVars, setSimVars] = useState<SimulationVariables>(DEFAULT_SIM_VARS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [visitedPhases, setVisitedPhases] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(VISITED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [1];
  });

  useEffect(() => {
    const phaseId = PHASES_DATA[activePhaseIndex]?.id;
    if (phaseId && !visitedPhases.includes(phaseId)) {
      const next = [...visitedPhases, phaseId];
      setVisitedPhases(next);
      try {
        localStorage.setItem(VISITED_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
    }
  }, [activePhaseIndex, visitedPhases]);

  const handleNavigate = (target: AppView, phaseIdx?: number) => {
    if (phaseIdx !== undefined) {
      setActivePhaseIndex(phaseIdx);
    }
    setView(target);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProgress = () => {
    const initial = [PHASES_DATA[activePhaseIndex]?.id || 1];
    setVisitedPhases(initial);
    try {
      localStorage.setItem(VISITED_KEY, JSON.stringify(initial));
    } catch {
      // ignore
    }
  };

  const navSections: { group: string; items: NavItemConfig[] }[] = [
    {
      group: 'Núcleo Interactivo',
      items: [
        {
          id: 'dashboard',
          label: 'Inicio',
          shortLabel: 'Inicio',
          category: 'Plataforma Principal',
          subtitle: 'Centro de control académico y acceso al proceso industrial',
          icon: <Home className="w-4 h-4" />,
        },
        {
          id: 'tour',
          label: 'Simulación 3D',
          shortLabel: 'Simulador 3D',
          category: 'Planta Virtual WebGL',
          subtitle: 'Recorrido tridimensional interactivo por las 18 fases de manufactura',
          badge: '18 Fases',
          icon: <Play className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'Ingeniería de Proceso',
      items: [
        {
          id: 'variables',
          label: 'Análisis de Variables',
          shortLabel: 'Variables',
          category: 'Laboratorio Operativo',
          subtitle: 'Simulación paramétrica de tiempos, temperaturas, humedad y peso unitario',
          badge: '7 Vars',
          icon: <Sliders className="w-4 h-4" />,
        },
        {
          id: 'formulation',
          label: 'Formulación',
          shortLabel: 'Formulación',
          category: 'Ingeniería de Alimentos',
          subtitle: 'Calculadora profesional de porcentaje panadero y escalamiento de lote',
          badge: '169,3%',
          icon: <Wheat className="w-4 h-4" />,
        },
        {
          id: 'diagram',
          label: 'Diagrama de Flujo',
          shortLabel: 'Diagrama',
          category: 'Ingeniería de Métodos',
          subtitle: 'Diagrama ASME interactivo con operaciones, inspecciones y decisiones',
          icon: <GitBranch className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'Planta y Calidad',
      items: [
        {
          id: 'equipment',
          label: 'Maquinaria y Equipos',
          shortLabel: 'Equipos (10)',
          category: 'Infraestructura Industrial',
          subtitle: 'Catálogo técnico de equipos, componentes, seguridad y mantenimiento',
          badge: '10',
          icon: <Wrench className="w-4 h-4" />,
        },
        {
          id: 'quality',
          label: 'Calidad e Inocuidad',
          shortLabel: 'Calidad',
          category: 'Gestión Sanitaria',
          subtitle: 'Control de calidad, BPM (Res. 2674/2013), HACCP y matriz de defectos',
          icon: <ShieldCheck className="w-4 h-4" />,
        },
        {
          id: 'batch',
          label: 'Control de Producción',
          shortLabel: 'Lotes',
          category: 'Trazabilidad de Planta',
          subtitle: 'Seguimiento simulado de orden de producción, liberación e incidencias',
          icon: <ClipboardCheck className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'Validación Académica',
      items: [
        {
          id: 'quiz',
          label: 'Evaluación',
          shortLabel: 'Evaluación',
          category: 'Módulo de Aprendizaje',
          subtitle: 'Verificación de competencias técnicas por ejes temáticos',
          badge: '12 Ítems',
          icon: <GraduationCap className="w-4 h-4" />,
        },
      ],
    },
  ];

  const allNavItems = navSections.flatMap((s) => s.items);
  const currentNav = allNavItems.find((i) => i.id === view) || allNavItems[0];
  const currentPhase = PHASES_DATA[activePhaseIndex] || PHASES_DATA[0];
  const progressPct = Math.round((visitedPhases.length / PHASES_DATA.length) * 100);

  const isVarsModified =
    simVars.kneadTime !== DEFAULT_SIM_VARS.kneadTime ||
    simVars.fermTime !== DEFAULT_SIM_VARS.fermTime ||
    simVars.fermTemp !== DEFAULT_SIM_VARS.fermTemp ||
    simVars.fermHumidity !== DEFAULT_SIM_VARS.fermHumidity ||
    simVars.portionWeight !== DEFAULT_SIM_VARS.portionWeight ||
    simVars.bakeTemp !== DEFAULT_SIM_VARS.bakeTemp ||
    simVars.bakeTime !== DEFAULT_SIM_VARS.bakeTime;

  if (view === 'presentation') {
    return (
      <PresentationModeView
        activeIndex={activePhaseIndex}
        onChangeIndex={setActivePhaseIndex}
        simVars={simVars}
        onExit={() => setView('tour')}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FBF9F5] text-[#181C23]">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside
        aria-label="Navegación principal"
        className={`hidden lg:flex flex-col shrink-0 bg-[#14181F] text-[#F3EFE6] border-r border-[#262D3A] transition-all duration-200 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-68'
        }`}
      >
        {/* Brand Identity */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-3 text-left cursor-pointer group overflow-hidden"
            title="Ir al inicio de PANUFACTURA"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C87D20] to-[#9A3412] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
              <Wheat className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span>PANUFACTURA</span>
                  <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-[#C87D20]/25 text-[#F4D06F] border border-[#C87D20]/40">
                    3.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Simulador Industrial 3D
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto thin-scrollbar py-4 px-3 space-y-5">
          {navSections.map((sec) => (
            <div key={sec.group} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400/80 mb-1.5">
                  {sec.group}
                </div>
              )}
              {sec.items.map((item) => {
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C87D20] to-[#B45309] text-white shadow-md shadow-[#C87D20]/20'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#E5A93C]'}`}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono-tech px-1.5 py-0.5 rounded-md shrink-0 ${
                          isActive
                            ? 'bg-black/25 text-amber-100'
                            : 'bg-white/8 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Progress & Collapse Controls */}
        <div className="p-3 border-t border-white/10 space-y-2.5 bg-[#0F1319]">
          {!sidebarCollapsed ? (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Avance del recorrido
                </span>
                <span className="font-mono-tech font-bold text-[#F4D06F]">
                  {visitedPhases.length}/18 ({progressPct}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C87D20] to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <button
                onClick={() => handleNavigate('tour', activePhaseIndex)}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white flex items-center justify-between pt-0.5 cursor-pointer"
              >
                <span className="truncate">
                  Fase actual: <strong className="text-amber-300">#{currentPhase.id} {currentPhase.shortName}</strong>
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavigate('tour', activePhaseIndex)}
              title={`Avance: ${progressPct}% (Fase ${currentPhase.id})`}
              className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-center font-mono-tech text-[11px] font-bold text-[#F4D06F] cursor-pointer"
            >
              {progressPct}%
            </button>
          )}

          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            title={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span>Compactar menú</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT COLUMN ==================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Contextual Top Bar */}
        <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E5DEC9]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            {/* Left: Mobile Logo / Toggle + Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="lg:hidden p-2 rounded-xl bg-[#14181F] text-white cursor-pointer"
                aria-label="Abrir menú de navegación"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5C554B] whitespace-nowrap overflow-hidden">
                  <button
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-[#C87D20] transition cursor-pointer shrink-0"
                  >
                    PANUFACTURA
                  </button>
                  <ChevronRight className="w-3 h-3 text-slate-400 hidden xl:inline shrink-0" />
                  <span className="hidden xl:inline text-slate-500 shrink-0">{currentNav.category}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[#9A3412] font-bold truncate">{currentNav.label}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#14181F] truncate">
                  {currentNav.subtitle}
                </div>
              </div>
            </div>

            {/* Right: Active Phase Pill, Modified Vars Indicator & Classroom Presentation Mode */}
            <div className="flex items-center gap-2 shrink-0">
              {isVarsModified && (
                <button
                  onClick={() => handleNavigate('variables')}
                  className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold cursor-pointer"
                  title="Parámetros modificados en el laboratorio de variables"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Variables editadas
                </button>
              )}

              <button
                onClick={() => handleNavigate('tour', activePhaseIndex)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F3EFE6] hover:bg-[#EAE3D5] border border-[#E5DEC9] text-xs font-semibold text-[#181C23] transition cursor-pointer"
                title="Ir a la fase activa en el Simulador 3D"
              >
                <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
                <span>Fase {currentPhase.id}/18:</span>
                <strong className="text-[#9A3412]">{currentPhase.shortName}</strong>
              </button>

              <button
                onClick={() => handleNavigate('presentation')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white text-xs font-bold shadow-sm border border-[#C87D20]/40 transition cursor-pointer"
              >
                <Presentation className="w-4 h-4 text-[#F4D06F]" />
                <span className="hidden sm:inline">Modo Exposición</span>
                <span className="sm:hidden">Exponer</span>
              </button>
            </div>
          </div>

          {/* Mobile Slide-Down Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#E5DEC9] bg-[#14181F] text-white px-4 py-4 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#C87D20] text-white">
                    <Wheat className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">PANUFACTURA 3.0</div>
                    <div className="text-[11px] text-amber-300">
                      Avance: {visitedPhases.length}/18 fases ({progressPct}%)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('presentation')}
                  className="px-3 py-1.5 rounded-lg bg-[#C87D20] text-white text-xs font-bold cursor-pointer"
                >
                  Modo Exposición
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left cursor-pointer ${
                      view === item.id
                        ? 'bg-[#C87D20] text-white'
                        : 'bg-white/5 text-slate-200 hover:bg-white/10'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Main Workspace Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 animate-view-enter">
          {view === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              visitedPhases={visitedPhases}
              activePhaseIndex={activePhaseIndex}
              simVars={simVars}
              onResetProgress={handleResetProgress}
            />
          )}
          {view === 'tour' && (
            <ProcessTourView
              activeIndex={activePhaseIndex}
              onChangeIndex={setActivePhaseIndex}
              visitedPhases={visitedPhases}
              simVars={simVars}
              onOpenVariables={() => handleNavigate('variables')}
              onOpenPresentation={() => handleNavigate('presentation')}
            />
          )}
          {view === 'variables' && (
            <VariablesSimView
              simVars={simVars}
              onChangeVars={setSimVars}
              onOpenInTour={(phaseIdx) => handleNavigate('tour', phaseIdx)}
            />
          )}
          {view === 'formulation' && (
            <FormulationView onNavigateToBatch={() => handleNavigate('batch')} />
          )}
          {view === 'equipment' && (
            <EquipmentView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
          )}
          {view === 'quality' && (
            <QualityView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
          )}
          {view === 'diagram' && (
            <FlowDiagramView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
          )}
          {view === 'batch' && (
            <BatchControlView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
          )}
          {view === 'quiz' && <QuizView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#E5DEC9] bg-[#F3EFE6]/70 py-4 px-4 sm:px-6 text-xs text-[#5C554B]">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="font-semibold text-[#181C23]">
              PANUFACTURA 3.0 · Plataforma Educativa de Manufactura del Pan Tipo Rollo
            </div>
            <div className="text-center sm:text-right">
              Motor WebGL 2 (Three.js + React Three Fiber) · Propuesta Piloto Académica No Validada Experimentalmente
            </div>
          </div>
        </footer>
      </div>

      {/* ==================== MOBILE BOTTOM QUICK BAR ==================== */}
      <nav
        aria-label="Acceso rápido móvil"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#14181F] text-white border-t border-white/10 px-2 py-1.5 grid grid-cols-5 gap-1"
      >
        {[
          { id: 'dashboard' as AppView, label: 'Inicio', icon: <Home className="w-4 h-4" /> },
          { id: 'tour' as AppView, label: '3D', icon: <Play className="w-4 h-4" /> },
          { id: 'variables' as AppView, label: 'Variables', icon: <Sliders className="w-4 h-4" /> },
          { id: 'quality' as AppView, label: 'Calidad', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => handleNavigate(m.id)}
            className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
              view === m.id ? 'bg-[#C87D20] text-white' : 'text-slate-300'
            }`}
          >
            {m.icon}
            <span className="mt-0.5">{m.label}</span>
          </button>
        ))}
        <button
          onClick={() => setMobileMenuOpen((o) => !o)}
          className={`flex flex-col items-center justify-center py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
            mobileMenuOpen ? 'bg-white/20 text-white' : 'text-amber-300'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span className="mt-0.5">Módulos</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
