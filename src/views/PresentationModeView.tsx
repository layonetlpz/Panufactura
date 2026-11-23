import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Camera,
  Maximize2,
  Minimize2,
  Eye,
  Wheat,
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';
import {
  CameraPreset,
  PHASE_3D_CONFIGS,
  SimulationVariables,
} from '../engine3d/simulationConfig';

interface Props {
  activeIndex: number;
  onChangeIndex: (idx: number) => void;
  simVars: SimulationVariables;
  onExit: () => void;
}

export const PresentationModeView: React.FC<Props> = ({
  activeIndex,
  onChangeIndex,
  simVars,
  onExit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('station');
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [phaseProgress, setPhaseProgress] = useState<number>(0.65);

  const phase = PHASES_DATA[activeIndex] || PHASES_DATA[0];
  const phase3D = PHASE_3D_CONFIGS[activeIndex] || PHASE_3D_CONFIGS[0];

  // Animate intra-phase progress loop while playing in presentation mode
  useEffect(() => {
    setPhaseProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setPhaseProgress((prev) => (prev >= 1 ? 0.15 : Number((prev + 0.04).toFixed(2))));
    }, 150);
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // ignore if browser blocks fullscreen
    }
  };

  // Classroom keyboard shortcuts: ArrowRight (next), ArrowLeft (prev), Space (play/pause), Escape (exit)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeIndex < PHASES_DATA.length - 1) onChangeIndex(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeIndex > 0) onChangeIndex(activeIndex - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, onChangeIndex, onExit]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0F1319] text-[#FBF9F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto"
    >
      {/* ==================== TOP PROJECTOR BAR ==================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C87D20] text-white flex items-center justify-center shadow">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech font-bold uppercase tracking-widest text-[#F4D06F]">
                PANUFACTURA 3.0 · MODO EXPOSICIÓN EN AULA
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono-tech text-emerald-300">
                {phase.zone}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Atajos: <strong className="text-slate-200">← / →</strong> Cambiar fase ·{' '}
              <strong className="text-slate-200">Espacio</strong> Reproducir/Pausar 3D ·{' '}
              <strong className="text-slate-200">Esc</strong> Salir
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isPlaying
                ? 'bg-[#C87D20] text-white border-[#F4D06F]/40'
                : 'bg-white/10 text-slate-200 border-white/15'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? 'Simulación activa' : 'En pausa'}
          </button>

          <button
            onClick={() => setShowHotspots((h) => !h)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              showHotspots
                ? 'bg-white/15 text-amber-300 border-amber-400/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            <Eye className="w-4 h-4" /> Hotspots
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/35 text-rose-200 border border-rose-500/30 text-xs font-bold cursor-pointer"
          >
            <X className="w-4 h-4" /> Salir (Esc)
          </button>
        </div>
      </div>

      {/* ==================== MAIN SPLIT STAGE: EXPANDED 3D VIEWER + LARGE SLIDE ==================== */}
      <div className="my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-[460px]">
        {/* Left 7 Columns: Expanded 3D WebGL Viewer */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-white/15 bg-[#1E242E] min-h-[340px] sm:min-h-[440px]">
          <GraphicsEngine
            activePhaseId={phase.id}
            visualKey={phase.visualStateKey}
            visualCaption={phase.visualCaption}
            isPlaying={isPlaying}
            speed={1}
            cameraPreset={cameraPreset}
            cameraTrigger={cameraTrigger}
            quality="high"
            simVars={simVars}
            selectedMachineId={null}
            onSelectMachine={() => {}}
            focusMachineId={null}
            showHotspots={showHotspots}
            phaseProgress={phaseProgress}
          />

          {/* Camera angle quick buttons */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
            {(
              [
                { id: 'station', label: 'Estación' },
                { id: 'closeup', label: 'Primer plano' },
                { id: 'overview', label: 'Planta completa' },
                { id: 'top', label: 'Superior' },
              ] as { id: CameraPreset; label: string }[]
            ).map((cam) => (
              <button
                key={cam.id}
                onClick={() => {
                  setCameraPreset(cam.id);
                  setCameraTrigger((t) => t + 1);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md border transition cursor-pointer ${
                  cameraPreset === cam.id
                    ? 'bg-[#14181F]/90 text-[#F4D06F] border-[#C87D20]'
                    : 'bg-white/85 text-slate-900 border-white/40 hover:bg-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                {cam.label}
              </button>
            ))}
          </div>

          {/* Bottom 3D Caption Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-10 rounded-xl bg-[#14181F]/90 backdrop-blur-md p-3.5 border border-white/15 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono-tech uppercase text-[#F4D06F]">
                Operación 3D · {phase3D.operationLabel}
              </div>
              <div className="text-sm text-white font-medium mt-0.5">{phase.visualCaption}</div>
            </div>
            <div className="text-right shrink-0 font-mono-tech">
              <div className="text-[10px] text-slate-400">ASME</div>
              <div className="text-xs font-bold text-emerald-300">{phase.asme}</div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: High-Contrast Projector Typography Card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#181E27] border border-white/10 p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#C87D20] text-white text-xs font-mono-tech font-bold">
                FASE {phase.id} DE {PHASES_DATA.length}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-amber-400/30">
                {phase.classification}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
              {phase.name}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              {phase.whatHappens}
            </p>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#F4D06F]">
                Objetivo e Impacto en el Producto
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {phase.objective} {phase.impactOnFinalProduct}
              </p>
            </div>

            {/* Key Variables & Quality Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-xs font-bold uppercase text-emerald-300 mb-2">
                  Parámetros de Control
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  {phase.variables.map((v, i) => (
                    <li key={i} className="flex items-start justify-between gap-2">
                      <span className="text-slate-300">{v.label}:</span>
                      <strong className="font-mono-tech text-[#F4D06F] text-right">
                        {v.referenceValue}
                      </strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-xs font-bold uppercase text-amber-300 mb-1.5">
                  Verificación de Calidad
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {phase.qualityControl.toVerify}
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                  <strong className="text-white">Salida:</strong> {phase.outputs[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Intra-phase progress indicator */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Transformación de etapa: {Math.round(phaseProgress * 100)}%</span>
            <span>Equipo: {phase.equipment[0]?.name}</span>
          </div>
        </div>
      </div>

      {/* ==================== BOTTOM SLIDE DECK CONTROLS ==================== */}
      <div className="border-t border-white/10 pt-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onChangeIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-sm font-bold cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" /> Anterior (←)
          </button>

          {/* 18 Phase Dots Scrubber */}
          <div className="hidden md:flex items-center gap-1.5">
            {PHASES_DATA.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => onChangeIndex(idx)}
                title={`Fase ${p.id}: ${p.name}`}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'w-8 bg-[#C87D20]'
                    : idx < activeIndex
                    ? 'w-2.5 bg-emerald-500/70 hover:bg-emerald-400'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="text-sm font-mono-tech font-bold text-slate-300 md:hidden">
            {activeIndex + 1} / {PHASES_DATA.length}
          </div>

          <button
            onClick={() => onChangeIndex(Math.min(PHASES_DATA.length - 1, activeIndex + 1))}
            disabled={activeIndex === PHASES_DATA.length - 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C87D20] hover:bg-[#B45309] disabled:opacity-30 text-sm font-bold cursor-pointer"
          >
            Siguiente (→) <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
