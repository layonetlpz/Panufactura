import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CameraPreset, MACHINES_INFO, PHASE_3D_CONFIGS } from './simulationConfig';

interface Props {
  activePhaseId: number;
  cameraPreset: CameraPreset;
  focusMachineId: string | null;
  cameraTrigger: number;
}

export const CameraController: React.FC<Props> = ({
  activePhaseId,
  cameraPreset,
  focusMachineId,
  cameraTrigger,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const isTransitioning = useRef(true);
  const desiredPos = useRef(new THREE.Vector3(0, 10, 16));
  const desiredTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    const phaseCfg = PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];
    const machine = focusMachineId ? MACHINES_INFO[focusMachineId] : null;

    if (cameraPreset === 'overview') {
      desiredPos.current.set(0, 11.5, 16.5);
      desiredTarget.current.set(0, 0.8, 0);
    } else if (cameraPreset === 'top') {
      desiredPos.current.set(0, 18.5, 0.5);
      desiredTarget.current.set(0, 0, 0);
    } else if (cameraPreset === 'side') {
      desiredPos.current.set(16.5, 4.2, 0.5);
      desiredTarget.current.set(0, 1.0, 0);
    } else if (cameraPreset === 'closeup') {
      const baseT = machine ? machine.focusPosition : phaseCfg.target;
      desiredTarget.current.set(baseT[0], baseT[1], baseT[2]);
      desiredPos.current.set(baseT[0] + 0.8, baseT[1] + 1.15, baseT[2] + 2.3);
    } else {
      // 'station'
      if (machine) {
        desiredTarget.current.set(...machine.focusPosition);
        desiredPos.current.set(...machine.cameraPosition);
      } else {
        desiredTarget.current.set(...phaseCfg.target);
        desiredPos.current.set(...phaseCfg.cameraPos);
      }
    }
    isTransitioning.current = true;
  }, [activePhaseId, cameraPreset, focusMachineId, cameraTrigger]);

  useFrame(() => {
    if (!isTransitioning.current || !controlsRef.current) return;
    camera.position.lerp(desiredPos.current, 0.08);
    controlsRef.current.target.lerp(desiredTarget.current, 0.08);
    controlsRef.current.update();

    if (
      camera.position.distanceTo(desiredPos.current) < 0.05 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.05
    ) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.8}
      maxDistance={26}
      maxPolarAngle={Math.PI / 2 - 0.04}
      minPolarAngle={0.1}
      onStart={() => {
        // Release auto-transition immediately when user orbits/zooms manually
        isTransitioning.current = false;
      }}
    />
  );
};
