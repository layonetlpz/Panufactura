import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BakeryEnvironment } from './BakeryEnvironment';
import { BakeryLighting } from './BakeryLighting';
import { PlantMachines } from './machines/PlantMachines';
import { DoughModel } from './DoughModel';
import { SimulationEffects } from './SimulationEffects';
import { CameraController } from './CameraController';
import { InteractionManager } from './InteractionManager';
import { GraphicsFallback } from './GraphicsFallback';
import {
  CameraPreset,
  HotspotInfo,
  PHASE_3D_CONFIGS,
  QualityLevel,
  SimulationVariables,
} from './simulationConfig';

interface Props {
  activePhaseId: number;
  visualKey: string;
  visualCaption: string;
  isPlaying: boolean;
  speed: number;
  cameraPreset: CameraPreset;
  cameraTrigger: number;
  quality: QualityLevel;
  simVars: SimulationVariables;
  selectedMachineId: string | null;
  onSelectMachine: (id: string | null) => void;
  focusMachineId: string | null;
  showHotspots: boolean;
  phaseProgress?: number;
  showCrumbCut?: boolean;
  onFpsSample?: (fps: number) => void;
}

class CanvasErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const FpsSampler: React.FC<{ onSample?: (fps: number) => void }> = ({ onSample }) => {
  const frames = useRef(0);
  const acc = useRef(0);
  useFrame((_, delta) => {
    if (!onSample) return;
    frames.current += 1;
    acc.current += delta;
    if (acc.current >= 1.5) {
      const fps = Math.round(frames.current / acc.current);
      onSample(fps);
      frames.current = 0;
      acc.current = 0;
    }
  });
  return null;
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return (
      !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) ||
      !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    );
  } catch {
    return false;
  }
}

export const GraphicsEngine: React.FC<Props> = ({
  activePhaseId,
  visualKey,
  visualCaption,
  isPlaying,
  speed,
  cameraPreset,
  cameraTrigger,
  quality,
  simVars,
  selectedMachineId,
  onSelectMachine,
  focusMachineId,
  showHotspots,
  phaseProgress,
  showCrumbCut = false,
  onFpsSample,
}) => {
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const trackedProductPosRef = useRef<THREE.Vector3>(new THREE.Vector3(-10.05, 0.22, -1.45));

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  useEffect(() => {
    const onVis = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    setActiveHotspot(null);
  }, [activePhaseId]);

  const fallbackNode = (
    <GraphicsFallback visualKey={visualKey} phaseId={activePhaseId} caption={visualCaption} />
  );

  if (!webglOk) {
    return fallbackNode;
  }

  const phaseCfg =
    PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];

  const dpr: [number, number] =
    quality === 'ultra'
      ? [1.25, 2]
      : quality === 'high'
      ? [1, 1.75]
      : quality === 'medium'
      ? [1, 1.35]
      : [1, 1];
  const effectivePlaying = isPlaying && isTabVisible;

  return (
    <CanvasErrorBoundary fallback={fallbackNode}>
      <div className="relative w-full h-full overflow-hidden bg-[#E5E0D6]">
        <Canvas
          shadows={quality !== 'low'}
          dpr={dpr}
          camera={{ position: [-10.5, 3.4, 2.5], fov: 43, near: 0.15, far: 100 }}
          gl={{
            antialias: quality !== 'low',
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.06,
          }}
          onPointerMissed={() => {
            onSelectMachine(null);
            setActiveHotspot(null);
          }}
        >
          <color attach="background" args={['#E7E2D8']} />
          <fog attach="fog" args={['#E7E2D8', 24, 54]} />

          <Suspense fallback={null}>
            <FpsSampler onSample={onFpsSample} />
            <BakeryLighting
              quality={quality}
              ovenActive={activePhaseId === 13}
              prooferActive={activePhaseId === 6 || activePhaseId === 11}
            />
            <BakeryEnvironment />
            <PlantMachines
              activeMachineId={phaseCfg.machineId}
              activePhaseId={activePhaseId}
              selectedMachineId={selectedMachineId}
              onSelectMachine={(id) => onSelectMachine(id)}
              isPlaying={effectivePlaying}
              speed={speed}
              simVars={simVars}
              phaseProgress={phaseProgress}
            />
            <DoughModel
              activePhaseId={activePhaseId}
              isPlaying={effectivePlaying}
              speed={speed}
              simVars={simVars}
              phaseProgress={phaseProgress}
              showCrumbCut={showCrumbCut}
              onPositionUpdate={(pos) => trackedProductPosRef.current.copy(pos)}
            />
            <SimulationEffects
              activePhaseId={activePhaseId}
              quality={quality}
              isPlaying={effectivePlaying}
            />
            <InteractionManager
              activeMachineId={phaseCfg.machineId}
              selectedMachineId={selectedMachineId}
              showHotspots={showHotspots}
              activeHotspotId={activeHotspot?.id || null}
              onSelectHotspot={setActiveHotspot}
            />
            <CameraController
              activePhaseId={activePhaseId}
              cameraPreset={cameraPreset}
              focusMachineId={focusMachineId}
              cameraTrigger={cameraTrigger}
              trackedProductPos={trackedProductPosRef}
            />
          </Suspense>
        </Canvas>

        {/* Active Hotspot Detail Overlay outside Canvas */}
        {activeHotspot && showHotspots && (
          <div className="absolute bottom-16 left-3 z-20 max-w-xs rounded-xl bg-[#14181F]/95 text-[#FBF9F5] p-3.5 text-xs shadow-2xl border border-[#C87D20] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="font-bold text-[#F4D06F]">{activeHotspot.label}</span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-[10px] font-mono-tech text-slate-400 hover:text-white cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed">{activeHotspot.description}</p>
          </div>
        )}
      </div>
    </CanvasErrorBoundary>
  );
};
