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
  const { camera, size } = useThree();
  const isTransitioning = useRef(true);
  const userInteracting = useRef(false);
  const desiredPos = useRef(new THREE.Vector3(0, 10, 16));
  const desiredTarget = useRef(new THREE.Vector3(0, 1, 0));

  // Compute portrait pullback factor so vertical mobile screens (< 1.0 aspect ratio) frame the entire machine and dough tray without cropping
  const aspect = size.width / Math.max(1, size.height);
  const portraitPullback =
    aspect < 1.05
      ? THREE.MathUtils.clamp(1 / Math.pow(Math.max(0.45, aspect), 0.36), 1.12, 1.42)
      : 1.0;

  useEffect(() => {
    const phaseCfg =
      PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];
    const machine = focusMachineId ? MACHINES_INFO[focusMachineId] : null;

    const rawPos = new THREE.Vector3();
    const rawTarget = new THREE.Vector3();

    if (cameraPreset === 'overview') {
      rawPos.set(0, 11.2, 16.2);
      rawTarget.set(0, 0.85, -0.2);
    } else if (cameraPreset === 'top') {
      rawPos.set(0, 18.5, 0.4);
      rawTarget.set(0, 0, -0.2);
    } else if (cameraPreset === 'side') {
      rawPos.set(16.2, 4.0, 0.4);
      rawTarget.set(0, 1.0, -0.4);
    } else if (cameraPreset === 'interior') {
      rawTarget.set(...phaseCfg.interiorTarget);
      rawPos.set(...phaseCfg.interiorPos);
    } else if (cameraPreset === 'closeup') {
      const baseT = machine ? machine.focusPosition : phaseCfg.doughPos;
      const isBowl = phaseCfg.machineId === 'mixer';
      rawTarget.set(baseT[0], baseT[1] + (isBowl ? 0.14 : 0.06), baseT[2]);
      const zOffset = baseT[2] > 0 ? 1.2 : isBowl ? 0.92 : 1.12;
      const yOffset = isBowl ? 0.92 : 0.55;
      rawPos.set(baseT[0] + 0.28, baseT[1] + yOffset, baseT[2] + zOffset);
    } else if (cameraPreset === 'follow') {
      const pPos = trackedProductPos?.current;
      const bx = pPos ? pPos.x : phaseCfg.doughPos[0];
      const by = pPos ? pPos.y : phaseCfg.doughPos[1];
      const bz = pPos ? pPos.z : phaseCfg.doughPos[2];
      rawTarget.set(bx, by + 0.08, bz);
      rawPos.set(bx + 0.9, by + 1.15, bz + 2.1);
    } else {
      // 'station'
      if (machine) {
        rawTarget.set(...machine.focusPosition);
        rawPos.set(...machine.cameraPosition);
      } else {
        rawTarget.set(...phaseCfg.target);
        rawPos.set(...phaseCfg.cameraPos);
      }
    }

    // Apply portrait distance adjustment along view vector so narrow mobile viewports never crop the station
    const offset = rawPos.clone().sub(rawTarget).multiplyScalar(portraitPullback);
    desiredTarget.current.copy(rawTarget);
    desiredPos.current.copy(rawTarget).add(offset);

    userInteracting.current = false;
    isTransitioning.current = true;
  }, [
    activePhaseId,
    cameraPreset,
    focusMachineId,
    cameraTrigger,
    trackedProductPos,
    portraitPullback,
  ]);

  useFrame(() => {
    if (!controlsRef.current) return;

    if (cameraPreset === 'follow' && !userInteracting.current && trackedProductPos?.current) {
      const p = trackedProductPos.current;
      desiredTarget.current.set(p.x, p.y + 0.08, p.z);
      desiredPos.current.set(
        p.x + 0.85 * portraitPullback,
        p.y + 1.05 * portraitPullback,
        p.z + 1.95 * portraitPullback
      );
      isTransitioning.current = true;
    }

    if (!isTransitioning.current) return;

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
      rotateSpeed={0.85}
      zoomSpeed={0.95}
      panSpeed={0.8}
      minDistance={0.55}
      maxDistance={28}
      maxPolarAngle={Math.PI / 2 - 0.03}
      minPolarAngle={0.08}
      onStart={() => {
        userInteracting.current = true;
        isTransitioning.current = false;
      }}
    />
  );
};
