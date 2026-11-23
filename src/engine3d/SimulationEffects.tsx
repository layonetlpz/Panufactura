import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { QualityLevel } from './simulationConfig';

interface Props {
  activePhaseId: number;
  quality: QualityLevel;
  isPlaying?: boolean;
}

export const SimulationEffects: React.FC<Props> = ({
  activePhaseId,
  quality,
  isPlaying = true,
}) => {
  const steamRef = useRef<THREE.InstancedMesh>(null);
  const flourRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count =
    quality === 'ultra' ? 32 : quality === 'high' ? 24 : quality === 'medium' ? 14 : 0;

  const steamSeeds = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        x: (Math.random() - 0.5) * 1.05,
        z: (Math.random() - 0.5) * 0.65,
        offset: i * 0.31,
      })),
    []
  );

  const flourSeeds = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        x: (Math.random() - 0.5) * 1.1,
        z: (Math.random() - 0.5) * 0.85,
        offset: i * 0.37,
      })),
    []
  );

  const showSteam =
    activePhaseId === 6 ||
    activePhaseId === 11 ||
    activePhaseId === 13 ||
    activePhaseId === 14;
  const showFlour =
    activePhaseId === 3 || activePhaseId === 4 || activePhaseId === 5 || activePhaseId === 8;

  useFrame((state) => {
    if (count === 0) return;
    const t = isPlaying ? state.clock.elapsedTime : 1.5;

    if (showSteam && steamRef.current) {
      const basePos: [number, number, number] =
        activePhaseId === 6 || activePhaseId === 11
          ? [0.5, 0.65, -2.25]
          : activePhaseId === 13
          ? [9.35, 1.42, -2.0]
          : [6.0, 1.38, 2.6];

      for (let i = 0; i < count; i++) {
        const s = steamSeeds[i];
        const cycle = (t * 0.48 + s.offset) % 1;
        dummy.position.set(
          basePos[0] + s.x,
          basePos[1] + cycle * 1.05,
          basePos[2] + s.z
        );
        const sc = (1 - cycle) * 0.072;
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        steamRef.current.setMatrixAt(i, dummy.matrix);
      }
      steamRef.current.instanceMatrix.needsUpdate = true;
    }

    if (showFlour && flourRef.current) {
      const basePos: [number, number, number] =
        activePhaseId === 3
          ? [-7.15, 1.1, -2.4]
          : activePhaseId === 8
          ? [4.15, 1.15, -2.8]
          : [-3.5, 1.12, -2.35];

      for (let i = 0; i < count; i++) {
        const s = flourSeeds[i];
        const cycle = (t * 0.35 + s.offset) % 1;
        dummy.position.set(
          basePos[0] + s.x * 0.75,
          basePos[1] + Math.sin(t + i) * 0.12 + cycle * 0.35,
          basePos[2] + s.z * 0.75
        );
        const sc = 0.018 * (1 - cycle * 0.5);
        dummy.scale.set(sc, sc, sc);
        dummy.updateMatrix();
        flourRef.current.setMatrixAt(i, dummy.matrix);
      }
      flourRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (quality === 'low' || count === 0) return null;

  return (
    <>
      {showSteam && (
        <instancedMesh ref={steamRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={activePhaseId === 13 ? '#FED7AA' : '#FFFFFF'}
            transparent
            opacity={activePhaseId === 6 || activePhaseId === 11 ? 0.2 : 0.26}
            depthWrite={false}
          />
        </instancedMesh>
      )}
      {showFlour && (
        <instancedMesh ref={flourRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial
            color="#FEF9C3"
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </instancedMesh>
      )}
    </>
  );
};
