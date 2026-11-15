import React, { useEffect, useRef, useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Maximize2, Minimize2,
  HelpCircle, Camera, Eye, PanelRightClose, PanelRightOpen, X, Focus,
  Info, ArrowRightLeft, Wrench, CheckCircle2, ShieldAlert, Sliders
} from 'lucide-react';
import { PHASES_DATA } from '../data/phasesData';
import { GraphicsEngine } from '../engine3d/GraphicsEngine';
import {
  CameraPreset,
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
}

export const ProcessTourView: React.FC<Props> = ({
  activeIndex,
  onChangeIndex,
  visitedPhases,
  simVars,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('station');
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [focusMachineId, setFocusMachineId] = useState<string | null>(null);
  const [sideOpen, setSideOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'tech' | 'vars' | 'io' | 'equip' | 'quality' | 'safety'>('tech');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const phase = PHASES_DATA[activeIndex];
  const phase3D = PHASE_3D_CONFIGS[activeIndex] || PHASE_3D_CONFIGS[0];
  const selectedMachine = selectedMachineId ? MACHINES_INFO[selectedMachineId] : null;
  const progressPct = Math.round(((activeIndex + 1) / PHASES_DATA.length) * 100);

  // Playback timer synced with speed (0.5x = 8s, 1x = 4.5s, 2x = 2.25s per phase)
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(4500 / speed);
    const timer = setInterval(() => {
      if (activeIndex < PHASES_DATA.length - 1) {
        onChangeIndex(activeIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, activeIndex, speed, onChangeIndex]);

  // Reset manual machine focus when changing phase
  useEffect(() => {
    setFocusMachineId(null);
    setCameraPreset('station');
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

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-3 ${isFullscreen ? 'bg-[#FAF6F0] p-3 h-screen overflow-y-auto' : ''}`}
    >
      {/* TOP BAR */}
      <div className="rounded-xl bg-[#1E293B] text-white px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-xs font-bold">
            Fase {phase.id} / {PHASES_DATA.length}
          </span>
          <div>
            <div className="text-sm sm:text-base font-bold leading-tight">{phase.name}</div>
            <div className="text-[11px] text-amber-300">
              {phase.zone} · {phase3D.operationLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Progress pill */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-slate-300">Progreso:</span>
            <span className="font-bold text-amber-300">{progressPct}%</span>
            <span className="text-slate-400">({visitedPhases.length}/18 visitadas)</span>
          </div>

          {/* Quality selector */}
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as QualityLevel)}
            className="bg-white/10 border border-white/15 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-white cursor-pointer"
            title="Calidad gráfica 3D"
          >
            <option value="high" className="text-slate-900">Calidad: Alta</option>
            <option value="medium" className="text-slate-900">Calidad: Media</option>
            <option value="low" className="text-slate-900">Calidad: Baja</option>
          </select>

          <button
            onClick={() => setShowHotspots((s) => !s)}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              showHotspots
                ? 'bg-amber-600/30 border-amber-400/50 text-amber-200'
                : 'bg-white/10 border-white/15 text-slate-300'
            }`}
            title="Mostrar/ocultar hotspots 3D"
          >
            <Eye className="w-3.5 h-3.5" /> Hotspots
          </button>

          <button
            onClick={() => setSideOpen((o) => !o)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/15 cursor-pointer"
            title="Mostrar/ocultar panel técnico"
          >
            {sideOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{sideOpen ? 'Ocultar ficha' : 'Ver ficha'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer"
            title="Pantalla completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowHelp((h) => !h)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 cursor-pointer"
            title="Ayuda de navegación 3D"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HELP POPOVER */}
      {showHelp && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-xs text-amber-950 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold">Controles del Simulador 3D PANUFACTURA</div>
            <p>
              • <strong>Rotar cámara:</strong> clic izquierdo + arrastrar · <strong>Zoom:</strong> rueda del ratón · <strong>Mover vista:</strong> clic derecho + arrastrar.
            </p>
            <p>
              • <strong>Interacción:</strong> haz clic sobre cualquier máquina (amasadora, cámara, horno, mesa) para resaltarla o pulsa los puntos <strong>Hotspot</strong> para ver detalles de sus componentes.
            </p>
          </div>
          <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-amber-200 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CENTRAL ZONE: 3D SCENE + SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 3D Canvas Area */}
        <div className={`${sideOpen ? 'lg:col-span-8' : 'lg:col-span-12'} relative h-[430px] sm:h-[520px] lg:h-[570px] rounded-2xl border border-[#E7DFD3] shadow-sm overflow-hidden bg-[#E6EBF2]`}>
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
            showHotspots={showHotspots}
          />

          {/* Camera Presets Overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
            {[
              { id: 'station', label: 'Estación actual' },
              { id: 'overview', label: 'Vista general' },
              { id: 'closeup', label: 'Primer plano' },
              { id: 'top', label: 'Superior' },
              { id: 'side', label: 'Lateral' },
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => selectPreset(cam.id as CameraPreset)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition cursor-pointer ${
                  cameraPreset === cam.id
                    ? 'bg-[#1E293B]/90 text-white border-amber-400'
                    : 'bg-white/85 text-slate-800 border-slate-300 hover:bg-white'
                }`}
              >
                <Camera className="w-3 h-3" />
                {cam.label}
              </button>
            ))}
          </div>

          {/* Stage Visual Caption HUD */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-10 rounded-xl bg-[#1E293B]/85 backdrop-blur-md text-white px-3.5 py-2.5 text-xs border border-white/15 pointer-events-none">
            <span className="font-bold text-amber-300">Estado de la masa: </span>
            {phase.visualCaption}
          </div>

          {/* Selected Machine Info Card */}
          {selectedMachine && (
            <div className="absolute top-14 right-3 z-20 w-72 rounded-xl bg-white/95 backdrop-blur-md border border-amber-300 p-4 shadow-xl space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-bold uppercase text-amber-700">{selectedMachine.phaseRange}</div>
                  <h3 className="font-bold text-sm text-[#1E293B]">{selectedMachine.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMachineId(null)}
                  className="p-1 rounded hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <p className="text-xs text-[#4A3F35] leading-relaxed">{selectedMachine.description}</p>
              <button
                onClick={() => {
                  setFocusMachineId(selectedMachine.id);
                  setCameraPreset('station');
                  setCameraTrigger((t) => t + 1);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Focus className="w-3.5 h-3.5" /> Enfocar cámara en equipo
              </button>
            </div>
          )}
        </div>

        {/* Side Technical Panel */}
        {sideOpen && (
          <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E7DFD3] shadow-sm flex flex-col h-[520px] lg:h-[570px] overflow-hidden">
            <div className="p-4 border-b border-[#E7DFD3] bg-[#FAF6F0]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase text-amber-800">{phase.classification}</span>
                <span className="text-[11px] font-semibold text-slate-500">ASME: {phase.asme}</span>
              </div>
              <h2 className="text-lg font-bold text-[#1E293B] mt-0.5">{phase.id}. {phase.name}</h2>
            </div>

            <div className="flex flex-wrap gap-1 p-2 border-b border-[#E7DFD3] bg-slate-50">
              {[
                { key: 'tech', label: 'Técnica', icon: <Info className="w-3 h-3" /> },
                { key: 'vars', label: 'Variables', icon: <Sliders className="w-3 h-3" /> },
                { key: 'io', label: 'E/S', icon: <ArrowRightLeft className="w-3 h-3" /> },
                { key: 'equip', label: 'Equipos', icon: <Wrench className="w-3 h-3" /> },
                { key: 'quality', label: 'Calidad', icon: <CheckCircle2 className="w-3 h-3" /> },
                { key: 'safety', label: 'Inocuidad', icon: <ShieldAlert className="w-3 h-3" /> },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as typeof activeTab)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                    activeTab === t.key ? 'bg-[#1E293B] text-white' : 'text-slate-600 hover:bg-white'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs">
              {activeTab === 'tech' && (
                <>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <span className="font-bold text-amber-900 block mb-0.5">Objetivo</span>
                    {phase.objective}
                  </div>
                  <div>
                    <span className="font-bold text-[#1E293B] block mb-0.5">Qué sucede</span>
                    <p className="text-[#4A3F35] leading-relaxed">{phase.whatHappens}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E293B] block mb-0.5">Por qué es necesaria</span>
                    <p className="text-[#4A3F35] leading-relaxed">{phase.whyNecessary}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E293B] block mb-0.5">Impacto en el producto final</span>
                    <p className="text-[#4A3F35] leading-relaxed">{phase.impactOnFinalProduct}</p>
                  </div>
                </>
              )}

              {activeTab === 'vars' && (
                <div className="space-y-2">
                  {phase.variables.map((v, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-2.5 bg-slate-50 flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#1E293B]">{v.label}</div>
                        {v.note && <div className="text-[11px] text-slate-500">{v.note}</div>}
                      </div>
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                        {v.referenceValue}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'io' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-[#1E293B] block mb-1">Entradas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.inputs.map((inp, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">{inp}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-2.5">
                    <span className="font-bold text-amber-900 block mb-0.5">Transformación</span>
                    {phase.transformation}
                  </div>
                  <div>
                    <span className="font-bold text-[#1E293B] block mb-1">Salidas</span>
                    {phase.outputs.map((out, i) => (
                      <div key={i} className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-emerald-950 font-medium">
                        {out}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'equip' && (
                <div className="space-y-2">
                  {phase.equipment.map((eq, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-2.5 bg-[#FAF6F0]/60">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-[#1E293B]">{eq.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200">{eq.scale}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{eq.role}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'quality' && (
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-slate-200 p-2.5">
                    <span className="font-bold block text-slate-700">Verificar</span>
                    {phase.qualityControl.toVerify}
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5">
                    <span className="font-bold block text-emerald-900">Condiciones adecuadas</span>
                    {phase.qualityControl.adequateConditions}
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-2.5">
                    <span className="font-bold block text-rose-900">Errores habituales</span>
                    {phase.qualityControl.commonErrors}
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
                    <span className="font-bold block text-amber-900">Acción correctiva</span>
                    {phase.qualityControl.correctiveActions}
                  </div>
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-2.5">
                    <span className="font-bold block text-rose-900">Riesgos</span>
                    {phase.safetyAndHygiene.risks}
                  </div>
                  <div className="rounded-lg border border-slate-200 p-2.5">
                    <span className="font-bold block text-slate-700">Higiene y manipulación</span>
                    {phase.safetyAndHygiene.hygiene}
                  </div>
                  <div className="rounded-lg border border-slate-200 p-2.5">
                    <span className="font-bold block text-slate-700">Prevención de contaminación</span>
                    {phase.safetyAndHygiene.contaminationPrevention}
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-2.5">
                    <span className="font-bold block text-amber-900">Alérgenos</span>
                    {phase.safetyAndHygiene.allergens}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM TIMELINE & PLAYBACK CONTROLS */}
      <div className="rounded-2xl bg-white border border-[#E7DFD3] p-3.5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPlaying(false);
                onChangeIndex(Math.max(0, activeIndex - 1));
              }}
              disabled={activeIndex === 0}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              title="Retroceder fase"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                onChangeIndex(Math.min(PHASES_DATA.length - 1, activeIndex + 1));
              }}
              disabled={activeIndex === PHASES_DATA.length - 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              title="Avanzar fase"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                onChangeIndex(0);
              }}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold mr-1">Velocidad:</span>
            {[0.5, 1, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => setSpeed(sp)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition cursor-pointer ${
                  speed === sp
                    ? 'bg-[#1E293B] text-white border-[#1E293B]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* 18-Phase Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PHASES_DATA.map((pItem, idx) => {
            const isActive = idx === activeIndex;
            const isVisited = visitedPhases.includes(pItem.id);
            return (
              <button
                key={pItem.id}
                onClick={() => {
                  setIsPlaying(false);
                  onChangeIndex(idx);
                }}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1E293B] text-white border-[#1E293B]'
                    : isVisited
                    ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${isActive ? 'bg-amber-500 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}>
                  {pItem.id}
                </span>
                <span>{pItem.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
