import React, { useEffect, useState } from 'react';
import {
  Wheat, Menu, X, Presentation, Home, Play, Sliders,
  GitBranch, Wrench, ShieldCheck, ClipboardCheck, GraduationCap
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

export function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [simVars, setSimVars] = useState<SimulationVariables>(DEFAULT_SIM_VARS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visitedPhases, setVisitedPhases] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(VISITED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
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
        // ignore
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

  const navItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { id: 'tour', label: 'Simulador 3D', icon: <Play className="w-4 h-4" /> },
    { id: 'variables', label: 'Variables', icon: <Sliders className="w-4 h-4" /> },
    { id: 'formulation', label: 'Formulación', icon: <Wheat className="w-4 h-4" /> },
    { id: 'equipment', label: 'Equipos', icon: <Wrench className="w-4 h-4" /> },
    { id: 'quality', label: 'Calidad', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'diagram', label: 'Diagrama', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'batch', label: 'Control Lote', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'quiz', label: 'Evaluación', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  if (view === 'presentation') {
    return (
      <PresentationModeView
        activeIndex={activePhaseIndex}
        onChangeIndex={setActivePhaseIndex}
        onExit={() => setView('tour')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1E293B] text-white shadow-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-none">PANUFACTURA 3D</div>
              <div className="text-[11px] text-amber-300 font-medium">Motor WebGL · Three.js</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  view === item.id
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigate('presentation')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/15 cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-amber-300" />
              Exposición
            </button>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="xl:hidden p-2 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 bg-[#1E293B] px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                  view === item.id ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-200'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavigate('presentation')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30 cursor-pointer"
            >
              <Presentation className="w-4 h-4" />
              Modo Exposición
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {view === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} visitedPhases={visitedPhases} />
        )}
        {view === 'tour' && (
          <ProcessTourView
            activeIndex={activePhaseIndex}
            onChangeIndex={setActivePhaseIndex}
            visitedPhases={visitedPhases}
            simVars={simVars}
          />
        )}
        {view === 'variables' && (
          <VariablesSimView simVars={simVars} onChangeVars={setSimVars} />
        )}
        {view === 'formulation' && <FormulationView />}
        {view === 'equipment' && (
          <EquipmentView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
        )}
        {view === 'quality' && <QualityView />}
        {view === 'diagram' && (
          <FlowDiagramView onSelectPhase={(idx) => handleNavigate('tour', idx)} />
        )}
        {view === 'batch' && <BatchControlView />}
        {view === 'quiz' && <QuizView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7DFD3] bg-white py-3.5 px-4 text-center text-xs text-[#6B5E53]">
        PANUFACTURA 3D · Simulador Académico WebGL (Three.js + React Three Fiber) · Propuesta Piloto No Validada Experimentalmente
      </footer>
    </div>
  );
}

export default App;
