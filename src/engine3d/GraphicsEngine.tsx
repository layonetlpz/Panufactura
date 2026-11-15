import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2')) ||
      !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
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
}) => {
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);

  useEffect(() => {
    setWebglOk(detectWebGL());
  }, []);

  useEffect(() => {
    const onVis = () => setIsTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Reset open hotspot when phase changes
  useEffect(() => {
    setActiveHotspot(null);
  }, [activePhaseId]);

  if (!webglOk) {
    return <GraphicsFallback visualKey={visualKey} phaseId={activePhaseId} caption={visualCaption} />;
  }

  const phaseCfg = PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];
  const dpr: [number, number] = quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [1, 1];
  const effectivePlaying = isPlaying && isTabVisible;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#E2E8F0]">
      <Canvas
        shadows={quality !== 'low'}
        dpr={dpr}
        camera={{ position: [-10.5, 3.8, 2.8], fov: 45, near: 0.2, far: 100 }}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance' }}
        onPointerMissed={() => {
          onSelectMachine(null);
          setActiveHotspot(null);
        }}
      >
        <color attach="background" args={['#E6EBF2']} />
        <fog attach="fog" args={['#E6EBF2', 22, 48]} />

        <Suspense fallback={null}>
          <BakeryLighting quality={quality} ovenActive={activePhaseId === 13} />
          <BakeryEnvironment />
          <PlantMachines
            activeMachineId={phaseCfg.machineId}
            activePhaseId={activePhaseId}
            selectedMachineId={selectedMachineId}
            onSelectMachine={(id) => onSelectMachine(id)}
            isPlaying={effectivePlaying}
            speed={speed}
            simVars={simVars}
          />
          <DoughModel
            activePhaseId={activePhaseId}
            isPlaying={effectivePlaying}
            speed={speed}
            simVars={simVars}
          />
          <SimulationEffects activePhaseId={activePhaseId} quality={quality} />
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
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
