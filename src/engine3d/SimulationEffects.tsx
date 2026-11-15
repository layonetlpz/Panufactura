import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QualityLevel } from './simulationConfig';

interface Props {
  activePhaseId: number;
  quality: QualityLevel;
}

export const SimulationEffects: React.FC<Props> = ({ activePhaseId, quality }) => {
  const steamRef = useRef<THREE.InstancedMesh>(null);
  const flourRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count = quality === 'low' ? 10 : 22;

  const steamSeeds = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ x: (Math.random() - 0.5) * 1.1, z: (Math.random() - 0.5) * 0.7, offset: i * 0.35 })),
    []
  );

  const flourSeeds = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({ x: (Math.random() - 0.5) * 1.4, z: (Math.random() - 0.5) * 1.0, offset: i * 0.4 })),
    []
  );

  const showSteam = activePhaseId === 13 || activePhaseId === 14;
  const showFlour = activePhaseId === 3 || activePhaseId === 4 || activePhaseId === 5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (showSteam && steamRef.current) {
      const basePos: [number, number, number] = activePhaseId === 13 ? [9.5, 1.5, -2.0] : [6.0, 1.45, 2.6];
      for (let i = 0; i < count; i++) {
        const s = steamSeeds[i];
        const cycle = ((t * 0.55 + s.offset) % 1);
        dummy.position.set(basePos[0] + s.x, basePos[1] + cycle * 1.1, basePos[2] + s.z);
        const sc = (1 - cycle) * 0.08;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        steamRef.current.setMatrixAt(i, dummy.matrix);
      }
      steamRef.current.instanceMatrix.needsUpdate = true;
    }

    if (showFlour && flourRef.current) {
      const basePos: [number, number, number] = activePhaseId === 3 ? [-7.0, 1.15, -2.4] : [-3.5, 1.25, -2.35];
      for (let i = 0; i < count; i++) {
        const s = flourSeeds[i];
        const cycle = ((t * 0.35 + s.offset) % 1);
        dummy.position.set(basePos[0] + s.x, basePos[1] + Math.sin(t + i) * 0.15 + cycle * 0.4, basePos[2] + s.z);
        const sc = 0.022 * (1 - cycle * 0.5);
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        flourRef.current.setMatrixAt(i, dummy.matrix);
      }
      flourRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (quality === 'low') return null;

  return (
    <>
      {showSteam && (
        <instancedMesh ref={steamRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.28} depthWrite={false} />
        </instancedMesh>
      )}
      {showFlour && (
        <instancedMesh ref={flourRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#FEF9C3" transparent opacity={0.45} depthWrite={false} />
        </instancedMesh>
      )}
    </>
  );
};
