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
  trackedProductPos?: React.MutableRefObject<THREE.Vector3>;
}

export const CameraController: React.FC<Props> = ({
  activePhaseId,
  cameraPreset,
  focusMachineId,
  cameraTrigger,
  trackedProductPos,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const isTransitioning = useRef(true);
  const userInteracting = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(0, 10, 16));
  const desiredTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    const phaseCfg =
      PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];
    const machine = focusMachineId ? MACHINES_INFO[focusMachineId] : null;

    if (cameraPreset === 'overview') {
      desiredPos.current.set(0, 11.2, 16.2);
      desiredTarget.current.set(0, 0.85, -0.2);
    } else if (cameraPreset === 'top') {
      desiredPos.current.set(0, 18.5, 0.4);
      desiredTarget.current.set(0, 0, -0.2);
    } else if (cameraPreset === 'side') {
      desiredPos.current.set(16.2, 4.0, 0.4);
      desiredTarget.current.set(0, 1.0, -0.4);
    } else if (cameraPreset === 'interior') {
      desiredTarget.current.set(...phaseCfg.interiorTarget);
      desiredPos.current.set(...phaseCfg.interiorPos);
    } else if (cameraPreset === 'closeup') {
      const baseT = machine ? machine.focusPosition : phaseCfg.doughPos;
      const isBowl = phaseCfg.machineId === 'mixer';
      desiredTarget.current.set(baseT[0], baseT[1] + (isBowl ? 0.14 : 0.06), baseT[2]);
      const zOffset = baseT[2] > 0 ? 1.2 : isBowl ? 0.92 : 1.12;
      const yOffset = isBowl ? 0.92 : 0.55;
      desiredPos.current.set(baseT[0] + 0.28, baseT[1] + yOffset, baseT[2] + zOffset);
    } else if (cameraPreset === 'follow') {
      const pPos = trackedProductPos?.current;
      const bx = pPos ? pPos.x : phaseCfg.doughPos[0];
      const by = pPos ? pPos.y : phaseCfg.doughPos[1];
      const bz = pPos ? pPos.z : phaseCfg.doughPos[2];
      desiredTarget.current.set(bx, by + 0.08, bz);
      desiredPos.current.set(bx + 0.9, by + 1.15, bz + 2.1);
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

    userInteracting.current = false;
    isTransitioning.current = true;
  }, [activePhaseId, cameraPreset, focusMachineId, cameraTrigger, trackedProductPos]);

  useFrame(() => {
    if (!controlsRef.current) return;

    // In 'follow' mode, continuously update desired target to follow the moving product/tray
    if (cameraPreset === 'follow' && !userInteracting.current && trackedProductPos?.current) {
      const p = trackedProductPos.current;
      desiredTarget.current.set(p.x, p.y + 0.08, p.z);
      desiredPos.current.set(p.x + 0.85, p.y + 1.05, p.z + 1.95);
      isTransitioning.current = true;
    }

    if (!isTransitioning.current) return;

    // Clamp desired position so camera never clips through back wall or below floor
    desiredPos.current.y = Math.max(0.45, desiredPos.current.y);
    desiredPos.current.z = Math.max(-4.5, desiredPos.current.z);

    camera.position.lerp(desiredPos.current, 0.09);
    controlsRef.current.target.lerp(desiredTarget.current, 0.09);
    controlsRef.current.update();

    if (
      cameraPreset !== 'follow' &&
      camera.position.distanceTo(desiredPos.current) < 0.03 &&
      controlsRef.current.target.distanceTo(desiredTarget.current) < 0.03
    ) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      minDistance={0.55}
      maxDistance={26}
      maxPolarAngle={Math.PI / 2 - 0.03}
      minPolarAngle={0.08}
      onStart={() => {
        userInteracting.current = true;
        isTransitioning.current = false;
      }}
    />
  );
};
