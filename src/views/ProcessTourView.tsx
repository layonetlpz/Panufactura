import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Maximize2,
  Minimize2,
  HelpCircle,
  Camera,
  Eye,
  EyeOff,
  PanelRightClose,
  PanelRightOpen,
  X,
  Focus,
  Info,
  ArrowRightLeft,
  Wrench,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Repeat,
  Presentation,
  Scissors,
  Gauge,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';
import {
  CameraPreset,
  HotspotInfo,
  MACHINES_INFO,
  PHASE_3D_CONFIGS,
  QualityLevel,
  SimulationVariables,
} from '../engine3d/simulationConfig';

interface Props {
  activeIndex: number;
  onChangeIndex: (idx: number) => void;
  visitedPhases: number[];
  simVars: SimulationVariables;
  onOpenVariables?: () => void;
  onOpenPresentation?: () => void;
}

export const ProcessTourView: React.FC<Props> = ({
  activeIndex,
  onChangeIndex,
  visitedPhases,
  simVars,
  onOpenVariables,
  onOpenPresentation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [phaseProgress, setPhaseProgress] = useState<number>(0.45);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('station');
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [quality, setQuality] = useState<QualityLevel>('ultra');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showCrumbCut, setShowCrumbCut] = useState<boolean>(false);
  const [cleanHudMode, setCleanHudMode] = useState<boolean>(false);
  const [measuredFps, setMeasuredFps] = useState<number>(60);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const [focusMachineId, setFocusMachineId] = useState<string | null>(null);
  const [sideOpen, setSideOpen] = useState<boolean>(true);
  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState<boolean>(false);
  const [mobileTechSheetOpen, setMobileTechSheetOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'tech' | 'vars' | 'io' | 'equip' | 'quality' | 'safety'
  >('tech');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const phase = PHASES_DATA[activeIndex] || PHASES_DATA[0];
  const phase3D = PHASE_3D_CONFIGS[activeIndex] || PHASE_3D_CONFIGS[0];
  const selectedMachine = selectedMachineId ? MACHINES_INFO[selectedMachineId] : null;
  const overallProgressPct = Math.round(
    ((activeIndex + phaseProgress) / PHASES_DATA.length) * 100
  );

  // Active kinematic sub-phase description based on phaseProgress (0..1)
  const activeSubPhase =
    phase3D.subPhases.find(
      (sp) => phaseProgress >= sp.range[0] && phaseProgress <= sp.range[1]
    ) || phase3D.subPhases[phase3D.subPhases.length - 1];

  // Continuous multimedia playback engine (50ms ticks, preserves state on pause)
  useEffect(() => {
    if (!isPlaying) return;
    const tickMs = 50;
    const stepPerTick = (tickMs / 5500) * speed;

    const timer = setInterval(() => {
      setPhaseProgress((prev) => {
        const next = prev + stepPerTick;
        if (next >= 1) {
          if (autoAdvance) {
            if (activeIndex < PHASES_DATA.length - 1) {
              onChangeIndex(activeIndex + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 1;
            }
          } else {
            return 0;
          }
        }
        return Number(next.toFixed(3));
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, autoAdvance, activeIndex, onChangeIndex]);

  // Reset manual machine focus when changing phase
  useEffect(() => {
    setFocusMachineId(null);
    setActiveHotspot(null);
    if (cameraPreset !== 'overview' && cameraPreset !== 'follow') {
      setCameraPreset('station');
    }
    setCameraTrigger((t) => t + 1);
  }, [activeIndex]);

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
      // ignore if browser denies fullscreen
    }
  };

  const selectPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setCameraTrigger((t) => t + 1);
  };

  const handleSelectPhase = (idx: number) => {
    setIsPlaying(false);
    onChangeIndex(idx);
    setPhaseProgress(0.45);
  };

  const handleTogglePlay = () => {
    if (!isPlaying && phaseProgress >= 0.99) {
      setPhaseProgress(0);
    }
    setIsPlaying((p) => !p);
  };

  const canInspectCrumb = phase.id >= 13 && phase.id <= 16;

  const cameraModes: { id: CameraPreset; label: string }[] = [
    { id: 'station', label: 'Estación' },
    { id: 'follow', label: 'Seguimiento' },
    { id: 'closeup', label: 'Detalle' },
    { id: 'interior', label: 'Interior' },
    { id: 'overview', label: 'General' },
    { id: 'top', label: 'Superior' },
    { id: 'side', label: 'Lateral' },
  ];

  const renderTechnicalTabsContent = () => (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-1 p-2 border-b border-[#E5DEC9] bg-[#FBF9F5]">
        {[
          { key: 'tech', label: 'Descripción', icon: <Info className="w-3.5 h-3.5" /> },
          { key: 'vars', label: 'Variables', icon: <Sliders className="w-3.5 h-3.5" /> },
          {
            key: 'io',
            label: 'Entradas/Sal.',
            icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
          },
          { key: 'equip', label: 'Maquinaria', icon: <Wrench className="w-3.5 h-3.5" /> },
          {
            key: 'quality',
            label: 'Calidad',
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          },
          {
            key: 'safety',
            label: 'Seguridad',
            icon: <ShieldAlert className="w-3.5 h-3.5" />,
          },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`inline-flex items-center justify-center gap-1 px-2 py-2 lg:py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              activeTab === t.key
                ? 'bg-[#14181F] text-white shadow-xs'
                : 'text-[#5C554B] hover:bg-[#F3EFE6]'
            }`}
          >
            {t.icon}
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 overflow-y-auto thin-scrollbar flex-1 space-y-3 text-xs">
        {activeTab === 'tech' && (
          <>
            {/* Kinematic Sub-Phases Breakdown */}
            <div className="rounded-xl bg-[#14181F] text-white p-3 space-y-1.5">
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#F4D06F] font-bold block">
                Secuencia Cinemática de la Fase (0.00 – 1.00)
              </span>
              {phase3D.subPhases.map((sp, i) => {
                const isCurrentSub =
                  phaseProgress >= sp.range[0] && phaseProgress <= sp.range[1];
                return (
                  <button
                    key={i}
                    onClick={() => setPhaseProgress(sp.range[0] + 0.05)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center justify-between gap-2 ${
                      isCurrentSub
                        ? 'bg-[#C87D20] text-white font-bold'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="truncate">{sp.label}</span>
                    <span className="font-mono-tech text-[10px] shrink-0">
                      {Math.round(sp.range[0] * 100)}–{Math.round(sp.range[1] * 100)}%
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-[#F3EFE6] border border-[#E5DEC9] p-3">
              <span className="font-bold text-[#9A3412] uppercase text-[10px] tracking-wider block mb-1">
                Objetivo de la Operación
              </span>
              <p className="text-[#181C23] font-medium leading-relaxed">{phase.objective}</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-[#14181F] block">Descripción técnica</span>
              <p className="text-[#5C554B] leading-relaxed">{phase.whatHappens}</p>
            </div>
            <div className="rounded-xl bg-[#1B4332]/8 border border-[#1B4332]/20 p-3">
              <span className="font-bold text-[#1B4332] block mb-0.5">
                Impacto en el pan rollo terminado
              </span>
              <p className="text-[#181C23] leading-relaxed">{phase.impactOnFinalProduct}</p>
            </div>
          </>
        )}

        {activeTab === 'vars' && (
          <div className="space-y-2.5">
            {phase.variables.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5DEC9] p-3 bg-[#FBF9F5] flex items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-[#14181F]">{v.label}</div>
                  {v.note && (
                    <div className="text-[11px] text-[#5C554B] mt-0.5">{v.note}</div>
                  )}
                </div>
                <span className="font-mono-tech font-bold text-[#9A3412] bg-[#C87D20]/15 px-2.5 py-1 rounded-lg shrink-0">
                  {v.referenceValue}
                </span>
              </div>
            ))}
            {onOpenVariables && (
              <button
                onClick={onOpenVariables}
                className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#14181F] hover:bg-[#252B37] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#F4D06F]" />
                Simular alteraciones en Laboratorio de Variables
              </button>
            )}
          </div>
        )}

        {activeTab === 'io' && (
          <div className="space-y-3">
            <div>
              <span className="font-bold text-[#14181F] block mb-1.5">
                Entradas ({phase.inputState})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {phase.inputs.map((inp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#F3EFE6] border border-[#E5DEC9] text-[#181C23] font-medium"
                  >
                    {inp}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#C87D20]/10 border border-[#C87D20]/30 p-3">
              <span className="font-bold text-[#9A3412] block mb-0.5">
                Transformación físico-química / operativa
              </span>
              <p className="text-[#181C23] leading-relaxed">{phase.transformation}</p>
            </div>
            <div>
              <span className="font-bold text-[#14181F] block mb-1.5">Salidas de la fase</span>
              {phase.outputs.map((out, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#1B4332]/10 border border-[#1B4332]/25 p-2.5 text-[#1B4332] font-bold"
                >
                  {out}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'equip' && (
          <div className="space-y-2.5">
            {phase.equipment.map((eq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5DEC9] p-3 bg-[#FBF9F5] space-y-1"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-bold text-[#14181F]">{eq.name}</span>
                  <span className="text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded-full bg-[#F3EFE6] border border-[#E5DEC9]">
                    {eq.scale}
                  </span>
                </div>
                <p className="text-[#5C554B] leading-relaxed">{eq.role}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-2.5">
            <div className="rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-3">
              <span className="font-bold block text-[#14181F] mb-0.5">Qué verificar</span>
              <p className="text-[#5C554B]">{phase.qualityControl.toVerify}</p>
            </div>
            <div className="rounded-xl border border-[#1B4332]/30 bg-[#1B4332]/8 p-3">
              <span className="font-bold block text-[#1B4332] mb-0.5">
                Criterio de aceptación
              </span>
              <p className="text-[#181C23]">{phase.qualityControl.adequateConditions}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
              <span className="font-bold block text-rose-900 mb-0.5">Errores frecuentes</span>
              <p className="text-rose-950">{phase.qualityControl.commonErrors}</p>
            </div>
            <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3">
              <span className="font-bold block text-amber-900 mb-0.5">Acción correctiva</span>
              <p className="text-amber-950">{phase.qualityControl.correctiveActions}</p>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-2.5">
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
              <span className="font-bold block text-rose-900 mb-0.5">Peligros asociados</span>
              <p className="text-rose-950">{phase.safetyAndHygiene.risks}</p>
            </div>
            <div className="rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-3">
              <span className="font-bold block text-[#14181F] mb-0.5">
                Buenas Prácticas de Manufactura (BPM)
              </span>
              <p className="text-[#5C554B]">{phase.safetyAndHygiene.hygiene}</p>
            </div>
            <div className="rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-3">
              <span className="font-bold block text-[#14181F] mb-0.5">
                Prevención de contaminación cruzada
              </span>
              <p className="text-[#5C554B]">
                {phase.safetyAndHygiene.contaminationPrevention}
              </p>
            </div>
            <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3">
              <span className="font-bold block text-amber-900 mb-0.5">
                Gestión de alérgenos
              </span>
              <p className="text-amber-950">{phase.safetyAndHygiene.allergens}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-3 ${
        isFullscreen ? 'bg-[#FBF9F5] p-3 sm:p-4 h-screen overflow-y-auto' : ''
      }`}
    >
      {/* ==================== 1. SIMULATOR COMMAND BAR (COMPACT ON MOBILE, FULL ON DESKTOP) ==================== */}
      <div className="rounded-2xl bg-[#14181F] text-white px-3 py-2.5 sm:px-4 sm:py-3 shadow-md border border-[#2D3545] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#C87D20] to-[#B45309] text-[11px] sm:text-xs font-mono-tech font-bold shrink-0 shadow-sm">
            F{String(phase.id).padStart(2, '0')}/18
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-base font-bold leading-tight truncate">
              {phase.name}
            </div>
            <div className="hidden sm:flex text-[11px] text-[#F4D06F] items-center gap-1.5 truncate">
              <span>{phase.zone}</span>
              <span>·</span>
              <span className="text-slate-300 truncate">{phase3D.operationLabel}</span>
            </div>
          </div>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as QualityLevel)}
            aria-label="Calidad gráfica 3D"
            className="bg-white/10 border border-white/15 text-[11px] sm:text-xs font-semibold rounded-xl px-2 py-1.5 text-white cursor-pointer"
          >
            <option value="ultra" className="text-slate-900">
              ULTRA
            </option>
            <option value="high" className="text-slate-900">
              HIGH
            </option>
            <option value="medium" className="text-slate-900">
              MED
            </option>
            <option value="low" className="text-slate-900">
              LOW
            </option>
          </select>

          <button
            onClick={() => {
              const next = !showCrumbCut;
              setShowCrumbCut(next);
              if (next) {
                if (!canInspectCrumb) onChangeIndex(14);
                selectPreset('closeup');
              }
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              showCrumbCut
                ? 'bg-[#C87D20] border-[#F4D06F] text-white'
                : 'bg-white/8 border-white/15 text-slate-200 hover:bg-white/15'
            }`}
            title="Corte transversal de miga 3D"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Corte Miga</span>
          </button>

          <button
            onClick={() => setShowHotspots((s) => !s)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              showHotspots
                ? 'bg-[#C87D20]/30 border-[#C87D20] text-[#F4D06F]'
                : 'bg-white/8 border-white/15 text-slate-300'
            }`}
            title="Mostrar u ocultar hotspots 3D"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hotspots</span>
          </button>

          {/* Desktop-only extended toolbar buttons */}
          <button
            onClick={() => {
              const nextClean = !cleanHudMode;
              setCleanHudMode(nextClean);
              if (nextClean) {
                setShowHotspots(false);
                setSideOpen(false);
              } else {
                setShowHotspots(true);
                setSideOpen(true);
              }
            }}
            className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              cleanHudMode
                ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                : 'bg-white/8 border-white/15 text-slate-300 hover:bg-white/15'
            }`}
            title="Modo inspección limpia"
          >
            {cleanHudMode ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Focus className="w-3.5 h-3.5" />
            )}
            <span>Vista Limpia</span>
          </button>

          {onOpenVariables && (
            <button
              onClick={onOpenVariables}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-semibold border border-white/15 text-slate-200 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#F4D06F]" />
              <span>Variables</span>
            </button>
          )}

          <button
            onClick={() => setSideOpen((o) => !o)}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-semibold border border-white/15 cursor-pointer"
            title="Mostrar u ocultar ficha lateral"
          >
            {sideOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-[#F4D06F]" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-[#F4D06F]" />
            )}
            <span>{sideOpen ? 'Ocultar ficha' : 'Ver ficha'}</span>
          </button>

          {onOpenPresentation && (
            <button
              onClick={onOpenPresentation}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-emerald-100 text-xs font-bold border border-emerald-500/30 cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Aula</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 cursor-pointer"
            title="Pantalla completa"
            aria-label="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowHelp((h) => !h)}
            className="p-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 cursor-pointer"
            title="Guía de controles 3D"
            aria-label="Guía de controles 3D"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HELP POPOVER */}
      {showHelp && (
        <div className="rounded-2xl bg-[#F3EFE6] border border-[#C87D20]/50 p-3.5 text-xs text-[#181C23] flex items-start justify-between gap-3 shadow-sm">
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#14181F]">
              Guía de Interacción Táctil y Cinemática 3D
            </div>
            <p className="text-[#5C554B]">
              • <strong>En teléfonos y tabletas:</strong> desliza con 1 dedo sobre la escena para
              rotar la cámara, pellizca con 2 dedos para acercar/alejar y toca cualquier máquina o
              punto numerado para ver sus datos debajo del visor.
            </p>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="p-1.5 hover:bg-black/5 rounded-lg cursor-pointer shrink-0"
            aria-label="Cerrar ayuda"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== 2. CENTRAL WORKSPACE: 3D VIEWPORT + DESKTOP SIDE SHEET ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* 3D Canvas Viewport: Maximum unobstructed height on Mobile (54svh portrait, 74svh landscape) & 575px on Desktop */}
        <div
          className={`${
            sideOpen ? 'lg:col-span-8' : 'lg:col-span-12'
          } relative h-[54svh] min-h-[340px] max-h-[520px] max-lg:landscape:h-[74svh] lg:h-[575px] lg:max-h-none rounded-2xl border border-[#E5DEC9] shadow-sm overflow-hidden bg-[#E5E0D6]`}
        >
          <GraphicsEngine
            activePhaseId={phase.id}
            visualKey={phase.visualStateKey}
            visualCaption={phase.visualCaption}
            isPlaying={isPlaying}
            speed={speed}
            cameraPreset={cameraPreset}
            cameraTrigger={cameraTrigger}
            quality={quality}
            simVars={simVars}
            selectedMachineId={selectedMachineId}
            onSelectMachine={(id) => setSelectedMachineId(id)}
            focusMachineId={focusMachineId}
            showHotspots={showHotspots && !cleanHudMode}
            phaseProgress={phaseProgress}
            showCrumbCut={showCrumbCut}
            onFpsSample={setMeasuredFps}
            activeHotspot={activeHotspot}
            onSelectHotspot={setActiveHotspot}
          />

          {/* MOBILE-ONLY: Ultra-compact non-obstructive corner status chip (takes <4% of top corner, never blocks machine or dough) */}
          <div className="lg:hidden absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14181F]/80 backdrop-blur-md text-white text-[11px] font-mono-tech border border-white/15 pointer-events-none">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span>{phase.shortName}</span>
            <span className="text-[#F4D06F] font-bold">{Math.round(phaseProgress * 100)}%</span>
          </div>

          {/* DESKTOP-ONLY: Top-Left 7 Camera Perspectives Bar (On mobile it lives below the canvas so it never wraps over the 3D scene!) */}
          <div className="hidden lg:flex absolute top-3 left-3 z-10 flex-wrap gap-1">
            {cameraModes.map((cam) => (
              <button
                key={cam.id}
                onClick={() => selectPreset(cam.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold backdrop-blur-md border transition cursor-pointer ${
                  cameraPreset === cam.id
                    ? 'bg-[#14181F]/92 text-[#F4D06F] border-[#C87D20] shadow-md'
                    : 'bg-white/88 text-[#14181F] border-black/10 hover:bg-white'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>{cam.label}</span>
              </button>
            ))}
          </div>

          {/* DESKTOP-ONLY: Bottom-Right Telemetry & Measured FPS Pill */}
          {!cleanHudMode && (
            <div className="hidden lg:flex absolute bottom-3 right-3 z-10 items-center gap-2 rounded-xl bg-[#14181F]/90 backdrop-blur-md text-white px-3 py-2 text-[11px] border border-white/15 pointer-events-none shadow-lg">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono-tech">
                {isPlaying ? `ACTIVO (${speed}x)` : 'PAUSA'} · {Math.round(phaseProgress * 100)}%
              </span>
              <span className="text-slate-400">|</span>
              <span className="font-mono-tech text-emerald-300 flex items-center gap-1">
                <Gauge className="w-3 h-3" /> {measuredFps} FPS
              </span>
            </div>
          )}

          {/* DESKTOP-ONLY: Bottom-Left Kinematic Sub-Phase & Dough State HUD (Moved below canvas on mobile!) */}
          {!cleanHudMode && (
            <div className="hidden lg:block absolute bottom-3 left-3 max-w-lg z-10 rounded-xl bg-[#14181F]/92 backdrop-blur-md text-white px-4 py-2.5 text-xs border border-white/15 pointer-events-none shadow-lg space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#F4D06F] font-bold">
                  Cinemática Activa ({Math.round(activeSubPhase.range[0] * 100)}%–
                  {Math.round(activeSubPhase.range[1] * 100)}%)
                </span>
                <span className="font-mono-tech text-[10px] text-emerald-300">
                  ASME: {phase.asme}
                </span>
              </div>
              <div className="font-bold text-white leading-snug">{activeSubPhase.label}</div>
              <div className="text-[11px] text-slate-300 leading-snug">{phase.visualCaption}</div>
            </div>
          )}

          {/* DESKTOP-ONLY: Selected Machine Floating Card (On mobile it renders below the canvas!) */}
          {selectedMachine && !cleanHudMode && (
            <div className="hidden lg:block absolute top-14 right-3 z-20 w-80 rounded-2xl bg-[#14181F]/95 backdrop-blur-md text-white border border-[#C87D20]/60 p-4 shadow-2xl space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono-tech font-bold uppercase text-[#F4D06F]">
                    {selectedMachine.phaseRange}
                  </div>
                  <h3 className="font-bold text-sm text-white">{selectedMachine.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMachineId(null)}
                  className="p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                  aria-label="Cerrar tarjeta de equipo"
                >
                  <X className="w-4 h-4 text-slate-300" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedMachine.description}
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setFocusMachineId(selectedMachine.id);
                    setCameraPreset('station');
                    setCameraTrigger((t) => t + 1);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-[#C87D20] hover:bg-[#B45309] text-white text-[11px] font-bold cursor-pointer"
                >
                  <Focus className="w-3 h-3" /> Estación
                </button>
                <button
                  onClick={() => {
                    setFocusMachineId(selectedMachine.id);
                    setCameraPreset('interior');
                    setCameraTrigger((t) => t + 1);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer"
                >
                  <Camera className="w-3 h-3" /> Interior
                </button>
                <button
                  onClick={() => {
                    setFocusMachineId(null);
                    setCameraPreset('overview');
                    setCameraTrigger((t) => t + 1);
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold cursor-pointer"
                >
                  General
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP-ONLY: Right Side Engineering Sheet */}
        {sideOpen && (
          <div className="hidden lg:flex lg:col-span-4 rounded-2xl bg-white border border-[#E5DEC9] shadow-sm flex-col h-[575px] overflow-hidden">
            <div className="p-4 border-b border-[#E5DEC9] bg-[#F3EFE6]/70">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#C87D20]/15 text-[#9A3412]">
                  {phase.classification}
                </span>
                <span className="text-[11px] font-mono-tech font-bold text-[#1B4332]">
                  ASME: {phase.asme}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#14181F] mt-1">
                {phase.id}. {phase.name}
              </h2>
            </div>
            {renderTechnicalTabsContent()}
          </div>
        )}
      </div>

      {/* ==================== 2B. MOBILE/TABLET EXTERNAL CAMERA BAR & CONTEXTUAL CARDS (< 1024px) ==================== */}
      <div className="lg:hidden space-y-2.5">
        {/* Touch-friendly External Camera Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {cameraModes.map((cam) => (
            <button
              key={cam.id}
              onClick={() => selectPreset(cam.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                cameraPreset === cam.id
                  ? 'bg-[#14181F] text-[#F4D06F] border-[#C87D20] shadow-xs'
                  : 'bg-white text-[#14181F] border-[#E5DEC9]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cam.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Contextual Hotspot Card (Only appears below canvas when user taps a hotspot pin) */}
        {activeHotspot && showHotspots && (
          <div className="rounded-2xl bg-[#14181F] text-white p-3.5 border border-[#C87D20] shadow-md space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#F4D06F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C87D20]" />
                Componente: {activeHotspot.label}
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="px-2 py-0.5 rounded-lg bg-white/10 text-xs font-semibold text-slate-200 cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{activeHotspot.description}</p>
          </div>
        )}

        {/* Mobile Contextual Selected Machine Card (Appears below canvas when user taps a machine in 3D) */}
        {selectedMachine && (
          <div className="rounded-2xl bg-[#14181F] text-white p-4 border border-[#C87D20]/60 shadow-md space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono-tech font-bold uppercase text-[#F4D06F]">
                  Equipo Seleccionado · {selectedMachine.phaseRange}
                </div>
                <h3 className="font-bold text-sm text-white">{selectedMachine.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMachineId(null)}
                className="p-1.5 rounded-lg bg-white/10 text-slate-200 cursor-pointer"
                aria-label="Cerrar equipo seleccionado"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedMachine.description}</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setFocusMachineId(selectedMachine.id);
                  setCameraPreset('station');
                  setCameraTrigger((t) => t + 1);
                }}
                className="py-2 px-2.5 rounded-xl bg-[#C87D20] text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
              >
                <Focus className="w-3.5 h-3.5" /> Estación
              </button>
              <button
                onClick={() => {
                  setFocusMachineId(selectedMachine.id);
                  setCameraPreset('interior');
                  setCameraTrigger((t) => t + 1);
                }}
                className="py-2 px-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" /> Interior
              </button>
              <button
                onClick={() => {
                  setFocusMachineId(null);
                  setCameraPreset('overview');
                  setCameraTrigger((t) => t + 1);
                }}
                className="py-2 px-2.5 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
              >
                General
              </button>
            </div>
          </div>
        )}

        {/* Mobile Collapsible Phase Summary Card (Replaces the obstructive floating HUD box!) */}
        <div className="rounded-2xl bg-white border border-[#E5DEC9] p-3.5 shadow-xs space-y-2">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-mono-tech uppercase font-bold text-[#9A3412]">
                <span>Cinemática ({Math.round(phaseProgress * 100)}%)</span>
                <span>·</span>
                <span className="text-[#1B4332]">ASME: {phase.asme}</span>
              </div>
              <div className="text-xs font-bold text-[#14181F] leading-snug">
                {activeSubPhase.label}
              </div>
              {!mobileSummaryExpanded && (
                <p className="text-[11px] text-[#5C554B] truncate">{phase.visualCaption}</p>
              )}
            </div>
            <button
              onClick={() => setMobileSummaryExpanded((e) => !e)}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F3EFE6] hover:bg-[#E5DEC9] text-[#14181F] text-xs font-bold cursor-pointer"
            >
              <span>{mobileSummaryExpanded ? 'Ocultar' : 'Ver detalles'}</span>
              {mobileSummaryExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {mobileSummaryExpanded && (
            <div className="pt-2 border-t border-[#F3EFE6] space-y-2 text-xs">
              <p className="text-[#181C23] leading-relaxed">
                <strong className="text-[#9A3412]">Estado de la masa: </strong>
                {phase.visualCaption}
              </p>
              <p className="text-[#5C554B] leading-relaxed">{phase.whatHappens}</p>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono-tech uppercase font-bold text-[#5C554B] block">
                  Sub-operaciones de la etapa (toca para saltar):
                </span>
                {phase3D.subPhases.map((sp, i) => {
                  const isCurrent =
                    phaseProgress >= sp.range[0] && phaseProgress <= sp.range[1];
                  return (
                    <button
                      key={i}
                      onClick={() => setPhaseProgress(sp.range[0] + 0.05)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] flex items-center justify-between gap-2 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#14181F] text-[#F4D06F] font-bold'
                          : 'bg-[#FBF9F5] text-[#5C554B] border border-[#E5DEC9]'
                      }`}
                    >
                      <span className="truncate">{sp.label}</span>
                      <span className="font-mono-tech text-[10px] shrink-0">
                        {Math.round(sp.range[0] * 100)}–{Math.round(sp.range[1] * 100)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== 3. MULTIMEDIA PLAYBACK DECK & TIMELINE (TOUCH-OPTIMIZED) ==================== */}
      <div className="rounded-2xl bg-white border border-[#E5DEC9] p-3.5 sm:p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Transport Buttons (Comfortable 44px touch height on mobile) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSelectPhase(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="min-h-[42px] min-w-[42px] sm:min-h-0 sm:min-w-0 p-2.5 rounded-xl border border-[#E5DEC9] hover:bg-[#F3EFE6] disabled:opacity-40 cursor-pointer flex items-center justify-center"
              title="Etapa anterior"
              aria-label="Etapa anterior"
            >
              <SkipBack className="w-4 h-4 text-[#14181F]" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer ${
                isPlaying
                  ? 'bg-[#14181F] text-white hover:bg-[#252B37]'
                  : 'bg-gradient-to-r from-[#C87D20] to-[#B45309] text-white hover:opacity-95'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reproducir</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleSelectPhase(Math.min(PHASES_DATA.length - 1, activeIndex + 1))}
              disabled={activeIndex === PHASES_DATA.length - 1}
              className="min-h-[42px] min-w-[42px] sm:min-h-0 sm:min-w-0 p-2.5 rounded-xl border border-[#E5DEC9] hover:bg-[#F3EFE6] disabled:opacity-40 cursor-pointer flex items-center justify-center"
              title="Siguiente etapa"
              aria-label="Siguiente etapa"
            >
              <SkipForward className="w-4 h-4 text-[#14181F]" />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                onChangeIndex(0);
                setPhaseProgress(0);
              }}
              className="min-h-[42px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E5DEC9] hover:bg-[#F3EFE6] text-xs font-semibold text-[#5C554B] cursor-pointer"
              title="Reiniciar recorrido a Fase 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            <button
              onClick={() => setAutoAdvance((a) => !a)}
              className={`min-h-[42px] sm:min-h-0 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                autoAdvance
                  ? 'bg-[#1B4332]/10 border-[#1B4332]/30 text-[#1B4332]'
                  : 'bg-[#FBF9F5] border-[#E5DEC9] text-[#5C554B]'
              }`}
              title="Alternar entre avance continuo de las 18 fases o bucle en la fase actual"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{autoAdvance ? '1–18' : 'Bucle'}</span>
            </button>
          </div>

          {/* Intra-Phase Progress Scrubber */}
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#14181F] truncate">
                Progreso Fase {phase.id}:
              </span>
              <span className="font-mono-tech font-bold text-[#9A3412] shrink-0 ml-2">
                {Math.round(phaseProgress * 100)}% · Global: {overallProgressPct}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={phaseProgress}
              onChange={(e) => {
                setPhaseProgress(Number(e.target.value));
              }}
              aria-label="Progreso de transformación de la fase actual"
              className="w-full accent-[#C87D20] cursor-pointer h-2.5 rounded-lg"
            />
          </div>

          {/* 5 Playback Speeds Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-1 text-xs shrink-0">
            <span className="text-[#5C554B] font-semibold mr-1">Velocidad:</span>
            <div className="flex items-center gap-1">
              {[0.25, 0.5, 1, 2, 4].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpeed(sp)}
                  className={`min-h-[36px] px-2.5 py-1.5 rounded-xl font-mono-tech font-bold border transition cursor-pointer ${
                    speed === sp
                      ? 'bg-[#14181F] text-white border-[#14181F]'
                      : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Quick Phase Dropdown + Desktop 18-Phase Interactive Grid */}
        <div className="pt-2.5 border-t border-[#F3EFE6] space-y-2">
          {/* Mobile Direct Phase Dropdown for instant 1-thumb selection */}
          <div className="sm:hidden flex items-center gap-2">
            <label
              htmlFor="mobile-phase-select"
              className="text-xs font-bold text-[#14181F] shrink-0"
            >
              Etapa:
            </label>
            <select
              id="mobile-phase-select"
              value={activeIndex}
              onChange={(e) => handleSelectPhase(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] text-xs font-bold text-[#14181F]"
            >
              {PHASES_DATA.map((pItem, idx) => (
                <option key={pItem.id} value={idx}>
                  Fase {pItem.id}/18: {pItem.name} ({pItem.zone})
                </option>
              ))}
            </select>
          </div>

          {/* Horizontal swipe phase pills on mobile, 2-row 9-col grid on desktop */}
          <div className="hidden sm:flex items-center justify-between text-[11px] text-[#5C554B]">
            <span className="font-semibold">
              Línea de tiempo maestro (18 etapas sincronizadas con cámara, maquinaria y masa)
            </span>
            <span className="font-mono-tech">{visitedPhases.length} de 18 fases visitadas</span>
          </div>

          <div className="flex sm:grid sm:grid-cols-6 lg:grid-cols-9 gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {PHASES_DATA.map((pItem, idx) => {
              const isActive = idx === activeIndex;
              const isVisited = visitedPhases.includes(pItem.id);
              return (
                <button
                  key={pItem.id}
                  onClick={() => handleSelectPhase(idx)}
                  title={`Fase ${pItem.id}: ${pItem.name}`}
                  className={`shrink-0 w-28 sm:w-auto px-2.5 py-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer flex flex-col justify-between text-left ${
                    isActive
                      ? 'bg-[#14181F] text-white border-[#14181F] ring-2 ring-[#C87D20] shadow-xs'
                      : isVisited
                      ? 'bg-[#F3EFE6] text-[#14181F] border-[#C87D20]/40 hover:bg-[#EAE3D5]'
                      : 'bg-[#FBF9F5] text-[#5C554B] border-[#E5DEC9] hover:bg-[#F3EFE6]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono-tech text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-[#C87D20] text-white'
                          : isVisited
                          ? 'bg-[#1B4332]/15 text-[#1B4332]'
                          : 'bg-black/5 text-[#5C554B]'
                      }`}
                    >
                      {String(pItem.id).padStart(2, '0')}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F4D06F]" />}
                  </div>
                  <div className="truncate w-full mt-1 font-bold text-[10px]">
                    {pItem.shortName}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== 4. MOBILE EXPANDABLE BOTTOM TECHNICAL SHEET (< 1024px, Section 3.D) ==================== */}
      <div className="lg:hidden rounded-2xl bg-white border border-[#E5DEC9] shadow-sm overflow-hidden">
        <button
          onClick={() => setMobileTechSheetOpen((o) => !o)}
          className="w-full p-4 bg-[#F3EFE6]/80 flex items-center justify-between gap-3 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-[#14181F] text-[#F4D06F] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono-tech uppercase font-bold text-[#9A3412]">
                Ficha Técnica · {phase.classification}
              </div>
              <div className="text-sm font-bold text-[#14181F] truncate">
                {phase.id}. {phase.name}
              </div>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5DEC9] text-xs font-bold text-[#14181F]">
            <span>{mobileTechSheetOpen ? 'Contraer' : 'Explorar 6 secciones'}</span>
            {mobileTechSheetOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </button>

        {mobileTechSheetOpen && (
          <div className="border-t border-[#E5DEC9] max-h-[460px] flex flex-col">
            {renderTechnicalTabsContent()}
          </div>
        )}
      </div>
    </div>
  );
};
