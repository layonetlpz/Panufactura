import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHASE_3D_CONFIGS, SimulationVariables } from './simulationConfig';

interface Props {
  activePhaseId: number;
  isPlaying: boolean;
  speed: number;
  simVars: SimulationVariables;
}

const RAW_DOUGH_COLOR = new THREE.Color('#F5E6B8');
const UNDERBAKED_COLOR = new THREE.Color('#EAD39C');
const GOLDEN_CRUST_COLOR = new THREE.Color('#C87A28');
const OVERBAKED_COLOR = new THREE.Color('#4A220A');

export const DoughModel: React.FC<Props> = ({ activePhaseId, isPlaying, speed, simVars }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bulkRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef<number>(0);
  const prevPhaseRef = useRef<number>(activePhaseId);

  const cfg = PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];

  if (prevPhaseRef.current !== activePhaseId) {
    prevPhaseRef.current = activePhaseId;
    progressRef.current = 0;
  }

  // Didactic visual factors derived from SimulationVariables
  const weightScale = THREE.MathUtils.clamp(simVars.portionWeight / 80, 0.7, 1.35);
  const kneadFactor = THREE.MathUtils.clamp(simVars.kneadTime / 10, 0.4, 1.3);
  const fermRatio = (simVars.fermTime / 52) * (simVars.fermTemp / 30);
  const isOverFermented = simVars.fermTime > 70 || simVars.fermTemp > 35;
  const isUnderFermented = simVars.fermTime < 35 || simVars.fermTemp < 24;

  // Target baked color based on bakeTemp & bakeTime
  const bakeIntensity = (simVars.bakeTemp / 190) * (simVars.bakeTime / 15);
  const targetBakedColor =
    bakeIntensity < 0.78
      ? UNDERBAKED_COLOR
      : bakeIntensity > 1.25
      ? OVERBAKED_COLOR
      : GOLDEN_CRUST_COLOR;

  useFrame((state, delta) => {
    const dt = delta * speed;
    const playMult = isPlaying ? 1 : 0.4;
    progressRef.current = Math.min(1, progressRef.current + dt * 0.35 * playMult);

    if (groupRef.current) {
      // Smoothly move dough assembly to current station position
      groupRef.current.position.lerp(new THREE.Vector3(...cfg.doughPos), 0.12);
    }

    if (bulkRef.current) {
      const t = state.clock.elapsedTime;
      if (cfg.doughState === 'mixing') {
        bulkRef.current.rotation.y += dt * 2.5 * playMult;
        bulkRef.current.scale.set(1, 0.85, 1);
      } else if (cfg.doughState === 'kneading') {
        // Stretch and fold deformation
        const stretch = 1 + Math.sin(t * 5 * speed) * 0.14;
        const squash = 1 / Math.sqrt(stretch);
        bulkRef.current.rotation.y += dt * 4.5 * playMult;
        bulkRef.current.scale.set(stretch, squash * (kneadFactor < 0.7 ? 0.85 : 1), stretch);
      } else if (cfg.doughState === 'ferm1') {
        const rise = isUnderFermented ? 1.05 : isOverFermented ? 1.48 : 1.3;
        const s = THREE.MathUtils.lerp(1.0, rise, progressRef.current);
        bulkRef.current.scale.set(s, isOverFermented ? s * 0.82 : s * 1.05, s);
      } else {
        bulkRef.current.scale.set(1, 1, 1);
      }
    }
  });

  // Grid positions for divided/rounded/formed pieces (6 representative pieces on tray)
  const pieceOffsets: [number, number, number][] = [
    [-0.32, 0, -0.18],
    [0, 0, -0.18],
    [0.32, 0, -0.18],
    [-0.32, 0, 0.18],
    [0, 0, 0.18],
    [0.32, 0, 0.18],
  ];

  // Determine piece scale & color for multi-piece states
  const getPieceAppearance = () => {
    if (cfg.doughState === 'proofing' || cfg.doughState === 'scoring') {
      const expand = isUnderFermented ? 0.92 : isOverFermented ? 1.38 : 1.24;
      const heightMult = isOverFermented ? 0.78 : 1.15;
      return {
        color: RAW_DOUGH_COLOR,
        roughness: 0.65,
        scale: [weightScale * expand, weightScale * heightMult, weightScale * expand] as [number, number, number],
      };
    }
    if (cfg.doughState === 'baking') {
      return {
        color: targetBakedColor,
        roughness: bakeIntensity > 1.25 ? 0.88 : 0.48,
        scale: [weightScale * 1.26, weightScale * (isOverFermented ? 0.8 : 1.22), weightScale * 1.26] as [number, number, number],
      };
    }
    if (
      cfg.doughState === 'cooling' ||
      cfg.doughState === 'inspection' ||
      cfg.doughState === 'packaging' ||
      cfg.doughState === 'storage_pt' ||
      cfg.doughState === 'distribution'
    ) {
      return {
        color: targetBakedColor,
        roughness: 0.5,
        scale: [weightScale * 1.22, weightScale * (isOverFermented ? 0.8 : 1.18), weightScale * 1.22] as [number, number, number],
      };
    }
    return {
      color: RAW_DOUGH_COLOR,
      roughness: kneadFactor < 0.7 ? 0.92 : 0.62,
      scale: [weightScale, weightScale, weightScale] as [number, number, number],
    };
  };

  const pieceApp = getPieceAppearance();

  return (
    <group ref={groupRef} position={cfg.doughPos}>
      {/* STATES 1-2: Separated ingredients & Weighing */}
      {(cfg.doughState === 'ingredients' || cfg.doughState === 'weighing') && (
        <group>
          {/* Flour mound */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <coneGeometry args={[0.24, 0.18, 24]} />
            <meshStandardMaterial color="#FEF9C3" roughness={0.95} />
          </mesh>
          {/* Water bowl */}
          <mesh position={[0.38, 0.06, 0.05]} castShadow>
            <cylinderGeometry args={[0.12, 0.09, 0.1, 18]} />
            <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.75} roughness={0.1} />
          </mesh>
          {/* Yeast, sugar, salt, fat cups */}
          <mesh position={[-0.32, 0.05, 0.14]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.08, 12]} />
            <meshStandardMaterial color="#D97706" roughness={0.8} />
          </mesh>
          <mesh position={[-0.18, 0.05, 0.24]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.08, 12]} />
            <meshStandardMaterial color="#FACC15" roughness={0.5} />
          </mesh>
        </group>
      )}

      {/* STATES 3-5: Mixing, Kneading & First Fermentation (Bulk Dough) */}
      {(cfg.doughState === 'mixing' || cfg.doughState === 'kneading' || cfg.doughState === 'ferm1') && (
        <mesh ref={bulkRef} position={[0, 0.12, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.28, 28, 22]} />
          <meshStandardMaterial
            color={cfg.doughState === 'mixing' ? '#F3E3AD' : '#F6E7B9'}
            roughness={cfg.doughState === 'mixing' || kneadFactor < 0.7 ? 0.92 : 0.55}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* STATES 6-12: Divided, Rounded, Resting, Shaped, Proofing, Baked, Cooled, Packaged */}
      {(cfg.doughState === 'dividing' ||
        cfg.doughState === 'rounding' ||
        cfg.doughState === 'resting' ||
        cfg.doughState === 'shaping' ||
        cfg.doughState === 'proofing' ||
        cfg.doughState === 'scoring' ||
        cfg.doughState === 'baking' ||
        cfg.doughState === 'cooling' ||
        cfg.doughState === 'inspection' ||
        cfg.doughState === 'packaging' ||
        cfg.doughState === 'storage_pt' ||
        cfg.doughState === 'distribution') && (
        <group>
          {/* Metal baking tray under pieces */}
          <mesh position={[0, -0.02, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.05, 0.03, 0.72]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Translucent resting cover in Phase 9 */}
          {cfg.doughState === 'resting' && (
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[1.0, 0.24, 0.68]} />
              <meshPhysicalMaterial color="#BAE6FD" transparent opacity={0.3} roughness={0.15} />
            </mesh>
          )}

          {/* Individual 3D dough/bread pieces */}
          {pieceOffsets.map((pos, idx) => {
            const isRound = cfg.doughState === 'dividing' || cfg.doughState === 'rounding' || cfg.doughState === 'resting';
            return (
              <group key={idx} position={[pos[0], 0.07, pos[2]]} scale={pieceApp.scale}>
                {isRound ? (
                  <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.095, 20, 16]} />
                    <meshStandardMaterial color={pieceApp.color} roughness={pieceApp.roughness} />
                  </mesh>
                ) : (
                  /* Characteristic Pan de Sal Tipo Rollo (oval/cylindrical capsule) */
                  <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.068, 0.11, 10, 20]} />
                    <meshStandardMaterial color={pieceApp.color} roughness={pieceApp.roughness} metalness={0.03} />
                  </mesh>
                )}
              </group>
            );
          })}

          {/* Translucent packaging bag + red seal + lot label in Phases 16-18 */}
          {(cfg.doughState === 'packaging' || cfg.doughState === 'storage_pt' || cfg.doughState === 'distribution') && (
            <group position={[0, 0.12, 0]}>
              <mesh>
                <boxGeometry args={[1.02, 0.24, 0.68]} />
                <meshPhysicalMaterial color="#E0F2FE" transparent opacity={0.32} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.125, 0]}>
                <boxGeometry args={[0.32, 0.015, 0.18]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.48, 0.06, 0]}>
                <boxGeometry args={[0.03, 0.08, 0.65]} />
                <meshStandardMaterial color="#DC2626" />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
};
