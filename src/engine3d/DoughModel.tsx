import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PHASE_3D_CONFIGS, SimulationVariables } from './simulationConfig';
import {
  createBreadCrustTexture,
  createCrumbAlveoliTexture,
  createDoughBumpTexture,
} from './materials';
import {
  createColombianRollBreadGeometry,
  createOrganicBulkDoughGeometry,
  createOrganicPortionGeometry,
  createSlicedRollHalfGeometry,
} from './models/OrganicGeometries';

interface Props {
  activePhaseId: number;
  isPlaying: boolean;
  speed: number;
  simVars: SimulationVariables;
  phaseProgress?: number; // 0..1 continuous progress within the active phase
  showCrumbCut?: boolean; // Cross-section inspection toggle
  onPositionUpdate?: (worldPos: THREE.Vector3) => void;
}

const RAW_DOUGH_COLOR = new THREE.Color('#F5E6B8');
const HYDRATED_DOUGH_COLOR = new THREE.Color('#F7EBC4');
const MID_BAKE_COLOR = new THREE.Color('#F0CA82');
const UNDERBAKED_COLOR = new THREE.Color('#F3E1B4');
const GOLDEN_CRUST_COLOR = new THREE.Color('#F6CB82');
const OVERBAKED_COLOR = new THREE.Color('#652E0D');

export const DoughModel: React.FC<Props> = ({
  activePhaseId,
  isPlaying,
  speed,
  simVars,
  phaseProgress,
  showCrumbCut = false,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bulkRef = useRef<THREE.Mesh>(null);
  const internalProgressRef = useRef<number>(0);
  const prevPhaseRef = useRef<number>(activePhaseId);
  const auxVec = useMemo(() => new THREE.Vector3(), []);

  const cfg =
    PHASE_3D_CONFIGS.find((p) => p.phaseId === activePhaseId) || PHASE_3D_CONFIGS[0];

  if (prevPhaseRef.current !== activePhaseId) {
    prevPhaseRef.current = activePhaseId;
    internalProgressRef.current = 0;
  }

  // Shared high-resolution organic geometries & PBR textures (cached and disposed cleanly)
  const bulkGeom = useMemo(() => createOrganicBulkDoughGeometry(0.28), []);
  const cutPortionGeom = useMemo(() => createOrganicPortionGeometry(0.092, 0.15), []);
  const roundedBallGeom = useMemo(() => createOrganicPortionGeometry(0.095, 1.0), []);
  const rollBreadGeom = useMemo(() => createColombianRollBreadGeometry(), []);
  const slicedRollGeoms = useMemo(() => createSlicedRollHalfGeometry(), []);

  const doughBumpTex = useMemo(() => createDoughBumpTexture(), []);
  const crustTex = useMemo(() => createBreadCrustTexture(), []);
  const crumbAlveoliTex = useMemo(() => createCrumbAlveoliTexture(), []);

  useEffect(() => {
    return () => {
      bulkGeom.dispose();
      cutPortionGeom.dispose();
      roundedBallGeom.dispose();
      rollBreadGeom.dispose();
      slicedRollGeoms.crustGeom.dispose();
      slicedRollGeoms.crumbCapGeom.dispose();
      doughBumpTex.dispose();
      crustTex.dispose();
      crumbAlveoliTex.dispose();
    };
  }, [
    bulkGeom,
    cutPortionGeom,
    roundedBallGeom,
    rollBreadGeom,
    slicedRollGeoms,
    doughBumpTex,
    crustTex,
    crumbAlveoliTex,
  ]);

  // Didactic visual factors derived from SimulationVariables
  const weightScale = THREE.MathUtils.clamp(simVars.portionWeight / 80, 0.72, 1.38);
  const kneadFactor = THREE.MathUtils.clamp(simVars.kneadTime / 10, 0.4, 1.35);
  const isOverFermented = simVars.fermTime > 70 || simVars.fermTemp > 35;
  const isUnderFermented = simVars.fermTime < 35 || simVars.fermTemp < 24;

  const bakeIntensity = (simVars.bakeTemp / 190) * (simVars.bakeTime / 15);
  const finalBakedColor =
    bakeIntensity < 0.78
      ? UNDERBAKED_COLOR
      : bakeIntensity > 1.25
      ? OVERBAKED_COLOR
      : GOLDEN_CRUST_COLOR;

  const effectiveProgress =
    phaseProgress !== undefined
      ? THREE.MathUtils.clamp(phaseProgress, 0, 1)
      : internalProgressRef.current;

  // Progressive baking color interpolation during Phase 13 (0.18..0.82 is active baking inside oven)
  const dynamicBakedColor = useMemo(() => {
    const c = new THREE.Color();
    if (cfg.doughState === 'baking') {
      const bakeWindow = THREE.MathUtils.clamp((effectiveProgress - 0.18) / 0.64, 0, 1);
      if (bakeWindow < 0.45) {
        c.lerpColors(RAW_DOUGH_COLOR, MID_BAKE_COLOR, bakeWindow / 0.45);
      } else {
        c.lerpColors(MID_BAKE_COLOR, finalBakedColor, (bakeWindow - 0.45) / 0.55);
      }
      return c;
    }
    return finalBakedColor;
  }, [cfg.doughState, effectiveProgress, finalBakedColor]);

  // Compute continuous trajectory position along CatmullRom spline for phases with transfers
  const getTargetWorldPosition = (p: number): THREE.Vector3 => {
    const base = new THREE.Vector3(...cfg.doughPos);

    if (cfg.doughState === 'baking') {
      // 0.00-0.18: Tray slides into oven from z = -1.25 to -2.05
      // 0.18-0.82: Inside oven chamber at z = -2.05
      // 0.82-1.00: Tray slides out of oven from z = -2.05 to -1.3
      if (p < 0.18) {
        const t = p / 0.18;
        base.z = THREE.MathUtils.lerp(-1.25, -2.05, t);
      } else if (p > 0.82) {
        const t = (p - 0.82) / 0.18;
        base.z = THREE.MathUtils.lerp(-2.05, -1.3, t);
      }
      return base;
    }

    if (cfg.doughState === 'cooling') {
      // 0.00-0.25: Tray slides into cooling rack slot from z = 3.25 to 2.6
      if (p < 0.25) {
        base.z = THREE.MathUtils.lerp(3.25, 2.6, p / 0.25);
      }
      return base;
    }

    if (cfg.doughState === 'dividing') {
      // Stay inside the divider chamber while pressing/cutting (0..0.52), then slide out to table
      if (p < 0.52) return base;
      if (cfg.doughEndPos) {
        const end = new THREE.Vector3(...cfg.doughEndPos);
        return base.lerp(end, (p - 0.52) / 0.48);
      }
      return base;
    }

    if (cfg.doughEndPos) {
      const end = new THREE.Vector3(...cfg.doughEndPos);
      return base.lerp(end, p);
    }

    return base;
  };

  useFrame((state, delta) => {
    const dt = isPlaying ? delta * speed : 0;
    if (phaseProgress === undefined && isPlaying) {
      internalProgressRef.current = Math.min(1, internalProgressRef.current + dt * 0.24);
    }

    const p = phaseProgress !== undefined ? phaseProgress : internalProgressRef.current;
    const targetPos = getTargetWorldPosition(p);

    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 0.22);
      if (onPositionUpdate) {
        onPositionUpdate(auxVec.copy(groupRef.current.position));
      }
    }

    if (bulkRef.current) {
      const t = state.clock.elapsedTime;
      if (cfg.doughState === 'mixing') {
        if (isPlaying && p > 0.15) {
          bulkRef.current.rotation.y += dt * 2.2;
        }
        const formProgress = THREE.MathUtils.clamp((p - 0.15) / 0.85, 0, 1);
        const mixScale = THREE.MathUtils.lerp(0.68, 1.0, formProgress);
        bulkRef.current.scale.set(mixScale, 0.82 * mixScale, mixScale);
      } else if (cfg.doughState === 'kneading') {
        // Coordinated viscoelastic stretching, folding and compression driven by the spiral hook
        const activeKnead = p > 0.1 && p < 0.92;
        if (isPlaying && activeKnead) {
          const cycle = t * 4.8 * speed;
          const stretchX = 1 + Math.sin(cycle) * 0.18;
          const stretchZ = 1 - Math.sin(cycle) * 0.14;
          const foldY = (1 / Math.sqrt(Math.max(0.5, stretchX * stretchZ))) * (kneadFactor < 0.7 ? 0.84 : 1.02);
          bulkRef.current.rotation.y += dt * 4.2;
          bulkRef.current.rotation.z = Math.sin(cycle * 0.5) * 0.12;
          bulkRef.current.scale.set(stretchX, foldY, stretchZ);
        } else {
          const cycle = p * Math.PI * 6;
          const stretchX = 1 + Math.sin(cycle) * 0.14;
          const stretchZ = 1 - Math.sin(cycle) * 0.11;
          bulkRef.current.rotation.z = Math.sin(cycle * 0.5) * 0.08;
          bulkRef.current.scale.set(stretchX, 0.96, stretchZ);
        }
      } else if (cfg.doughState === 'ferm1') {
        // Organic non-uniform fermentation dome expansion (crown rises more than constrained walls)
        const riseTarget = isUnderFermented ? 1.07 : isOverFermented ? 1.46 : 1.32;
        const radialScale = THREE.MathUtils.lerp(1.0, Math.min(1.26, riseTarget * 0.95), p);
        const crownHeight = THREE.MathUtils.lerp(
          0.95,
          isOverFermented ? riseTarget * 0.78 : riseTarget * 1.15,
          p
        );
        bulkRef.current.rotation.z = 0;
        bulkRef.current.scale.set(radialScale, crownHeight, radialScale);
      } else {
        bulkRef.current.rotation.z = 0;
        bulkRef.current.scale.set(1, 1, 1);
      }
    }
  });

  // 6 representative 80g pieces on a 60x40cm industrial perforated tray
  const pieceOffsets: [number, number, number][] = [
    [-0.31, 0, -0.17],
    [0, 0, -0.17],
    [0.31, 0, -0.17],
    [-0.31, 0, 0.17],
    [0, 0, 0.17],
    [0.31, 0, 0.17],
  ];

  const getPieceAppearance = () => {
    const p = effectiveProgress;

    if (cfg.doughState === 'proofing') {
      const targetExpand = isUnderFermented ? 1.05 : isOverFermented ? 1.44 : 1.28;
      const expand = THREE.MathUtils.lerp(1.0, targetExpand, p);
      const heightMult = THREE.MathUtils.lerp(1.0, isOverFermented ? 0.76 : 1.22, p);
      return {
        color: HYDRATED_DOUGH_COLOR,
        useCrustMap: false,
        roughness: simVars.fermHumidity < 65 ? 0.88 : 0.56,
        scale: [
          weightScale * expand,
          weightScale * heightMult,
          weightScale * expand,
        ] as [number, number, number],
      };
    }
    if (cfg.doughState === 'scoring') {
      const expand = isUnderFermented ? 1.05 : isOverFermented ? 1.44 : 1.28;
      const heightMult = isOverFermented ? 0.76 : 1.22;
      return {
        color: HYDRATED_DOUGH_COLOR,
        useCrustMap: false,
        roughness: THREE.MathUtils.lerp(0.56, 0.42, p),
        scale: [
          weightScale * expand,
          weightScale * heightMult,
          weightScale * expand,
        ] as [number, number, number],
      };
    }
    if (cfg.doughState === 'baking') {
      const bakeWindow = THREE.MathUtils.clamp((p - 0.18) / 0.64, 0, 1);
      const springProgress = Math.min(1, bakeWindow / 0.45);
      const baseExpand = isUnderFermented ? 1.05 : isOverFermented ? 1.44 : 1.28;
      const ovenSpring = THREE.MathUtils.lerp(baseExpand, baseExpand * 1.14, springProgress);
      const heightMult = isOverFermented
        ? 0.74
        : THREE.MathUtils.lerp(1.2, 1.34, springProgress);
      return {
        color: dynamicBakedColor,
        useCrustMap: bakeWindow > 0.35,
        roughness: THREE.MathUtils.lerp(0.58, bakeIntensity > 1.25 ? 0.86 : 0.46, bakeWindow),
        scale: [
          weightScale * ovenSpring,
          weightScale * heightMult,
          weightScale * ovenSpring,
        ] as [number, number, number],
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
        color: finalBakedColor,
        useCrustMap: true,
        roughness: 0.48,
        scale: [
          weightScale * 1.28,
          weightScale * (isOverFermented ? 0.76 : 1.26),
          weightScale * 1.28,
        ] as [number, number, number],
      };
    }
    return {
      color: HYDRATED_DOUGH_COLOR,
      useCrustMap: false,
      roughness: kneadFactor < 0.7 ? 0.88 : 0.54,
      scale: [weightScale, weightScale, weightScale] as [number, number, number],
    };
  };

  const pieceApp = getPieceAppearance();
  const shouldShowSlicedCrumb =
    showCrumbCut || (cfg.doughState === 'inspection' && effectiveProgress > 0.55);

  return (
    <group ref={groupRef} position={cfg.doughPos}>
      {/* ==================== PHASE 1: RECEPTION INSPECTION ON FLOOR SCALE ==================== */}
      {cfg.doughState === 'ingredients' && (
        <group>
          {/* Infrared temperature laser scan cone above sample tray during 0.20..0.85 */}
          {effectiveProgress > 0.2 && effectiveProgress < 0.85 && (
            <mesh
              position={[Math.sin(effectiveProgress * Math.PI * 4) * 0.1, 1.06, 0]}
              rotation={[Math.PI, 0, 0]}
            >
              <coneGeometry args={[0.09, 0.22, 16, 1, true]} />
              <meshBasicMaterial color="#10B981" transparent opacity={0.28} side={THREE.DoubleSide} />
            </mesh>
          )}
          {/* Sample verification tray */}
          <mesh position={[0, 0.86, 0]} castShadow>
            <boxGeometry args={[0.42, 0.03, 0.32]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[-0.08, 0.91, 0]} castShadow>
            <coneGeometry args={[0.11, 0.09, 20]} />
            <meshStandardMaterial color="#FEF9C3" roughness={0.95} />
          </mesh>
          <mesh position={[0.11, 0.89, 0.02]}>
            <boxGeometry args={[0.14, 0.015, 0.18]} />
            <meshStandardMaterial color="#1B4332" />
          </mesh>
        </group>
      )}

      {/* ==================== PHASE 2: FIFO / PEPS STORAGE BIN PLACEMENT ==================== */}
      {cfg.doughState === 'storage_mp' && (
        <group
          position={[
            0,
            0,
            THREE.MathUtils.lerp(0.38, 0, Math.min(1, effectiveProgress / 0.65)),
          ]}
        >
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry args={[0.46, 0.26, 0.52]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.26, 0]} castShadow>
            <boxGeometry args={[0.48, 0.03, 0.54]} />
            <meshStandardMaterial color="#1B4332" roughness={0.35} />
          </mesh>
        </group>
      )}

      {/* ==================== PHASE 3: PROGRESSIVE DOSING & WEIGHING ==================== */}
      {cfg.doughState === 'weighing' && (
        <group>
          {/* Main stainless bowl on platform scale */}
          <mesh position={[-0.15, 0.14, -0.02]} receiveShadow castShadow>
            <cylinderGeometry args={[0.23, 0.17, 0.09, 28]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.88} roughness={0.18} />
          </mesh>
          {/* Organic flour mound growing as flour is dosed (0.10..0.55) */}
          <mesh
            position={[-0.15, 0.21, -0.02]}
            scale={[
              THREE.MathUtils.lerp(0.25, 1.0, Math.min(1, effectiveProgress / 0.55)),
              THREE.MathUtils.lerp(0.15, 1.0, Math.min(1, effectiveProgress / 0.55)),
              THREE.MathUtils.lerp(0.25, 1.0, Math.min(1, effectiveProgress / 0.55)),
            ]}
            castShadow
          >
            <coneGeometry args={[0.2, 0.17, 28]} />
            <meshStandardMaterial color="#FEF9C3" bumpMap={doughBumpTex} bumpScale={0.008} roughness={0.95} />
          </mesh>

          {/* Falling flour stream from sifter during 0.10..0.52 */}
          {effectiveProgress > 0.08 && effectiveProgress < 0.54 && (
            <mesh position={[-0.15, 0.36, -0.02]}>
              <cylinderGeometry args={[0.025, 0.055, 0.24, 14]} />
              <meshBasicMaterial color="#FEF9C3" transparent opacity={0.65} />
            </mesh>
          )}

          {/* Water vessel (580 g / 58%) filling up during 0.50..0.80 */}
          <group position={[0.25, 0.09, 0.06]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.115, 0.095, 0.16, 22, 1, true]} />
              <meshPhysicalMaterial
                color="#E0F2FE"
                transparent
                opacity={0.35}
                roughness={0.08}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh
              position={[
                0,
                THREE.MathUtils.lerp(
                  -0.05,
                  0.0,
                  THREE.MathUtils.clamp((effectiveProgress - 0.45) / 0.35, 0.2, 1)
                ),
                0,
              ]}
            >
              <cylinderGeometry
                args={[
                  0.105,
                  0.088,
                  THREE.MathUtils.lerp(
                    0.03,
                    0.13,
                    THREE.MathUtils.clamp((effectiveProgress - 0.45) / 0.35, 0.2, 1)
                  ),
                  20,
                ]}
              />
              <meshPhysicalMaterial color="#38BDF8" transparent opacity={0.78} roughness={0.1} />
            </mesh>
          </group>

          {/* Separated minor ingredients: Yeast (10g), Salt (18g), Sugar (40g), Fat/Butter (40g) */}
          <mesh position={[0.52, 0.06, -0.14]} castShadow>
            <cylinderGeometry args={[0.058, 0.046, 0.075, 16]} />
            <meshStandardMaterial color="#B45309" roughness={0.85} />
          </mesh>
          <mesh position={[0.68, 0.06, -0.14]} castShadow>
            <cylinderGeometry args={[0.058, 0.046, 0.075, 16]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
          </mesh>
          <mesh position={[0.52, 0.06, 0.12]} castShadow>
            <cylinderGeometry args={[0.065, 0.052, 0.08, 16]} />
            <meshStandardMaterial color="#FEF08A" roughness={0.5} />
          </mesh>
          {/* Block of vegetable shortening / margarine */}
          <mesh position={[0.68, 0.06, 0.12]} castShadow>
            <boxGeometry args={[0.09, 0.065, 0.09]} />
            <meshStandardMaterial color="#FACC15" roughness={0.38} />
          </mesh>
        </group>
      )}

      {/* ==================== PHASES 4, 5, 6: MIXING, KNEADING & FIRST FERMENTATION ==================== */}
      {(cfg.doughState === 'mixing' ||
        cfg.doughState === 'kneading' ||
        cfg.doughState === 'ferm1') && (
        <group>
          {/* In Phase 4 (Mixing) during 0.0..0.45, show unmixed flour ring & water swirling into the dough */}
          {cfg.doughState === 'mixing' && effectiveProgress < 0.55 && (
            <group position={[0, 0.06, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, effectiveProgress * Math.PI * 4]}>
                <ringGeometry args={[0.16, 0.36 * (1 - effectiveProgress * 0.7), 24]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  transparent
                  opacity={0.55 * (1 - effectiveProgress * 1.4)}
                  roughness={0.15}
                />
              </mesh>
            </group>
          )}

          {/* Translucent graduated bulk fermentation tub in Phase 6 */}
          {cfg.doughState === 'ferm1' && (
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.43, 0.37, 0.3, 32]} />
              <meshPhysicalMaterial
                color="#E0F2FE"
                transparent
                opacity={0.22}
                roughness={0.12}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* High-resolution Organic Viscoelastic Bulk Dough Mesh */}
          <mesh
            ref={bulkRef}
            geometry={bulkGeom}
            position={[0, 0.14, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={cfg.doughState === 'mixing' ? '#F2E1A8' : '#F6E8BC'}
              bumpMap={doughBumpTex}
              bumpScale={
                cfg.doughState === 'mixing'
                  ? 0.016
                  : cfg.doughState === 'kneading'
                  ? THREE.MathUtils.lerp(0.015, kneadFactor < 0.7 ? 0.014 : 0.004, effectiveProgress)
                  : 0.005
              }
              roughness={
                cfg.doughState === 'mixing'
                  ? 0.88
                  : cfg.doughState === 'kneading'
                  ? THREE.MathUtils.lerp(
                      0.85,
                      kneadFactor < 0.7 ? 0.82 : 0.44,
                      effectiveProgress
                    )
                  : 0.48
              }
              metalness={0.02}
            />
          </mesh>
        </group>
      )}

      {/* ==================== PHASES 7 TO 18: MULTI-PIECE OPERATIONS & COLOMBIAN BREAD ROLL ==================== */}
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
          {/* Perforated Aluminum/Steel 60x40cm Baking Tray under pieces */}
          <group position={[0, -0.02, 0]}>
            <mesh receiveShadow castShadow>
              <boxGeometry args={[1.08, 0.026, 0.74]} />
              <meshStandardMaterial color="#64748B" metalness={0.84} roughness={0.26} />
            </mesh>
            {/* Beveled tray rims */}
            <mesh position={[0, 0.015, -0.36]} rotation={[0.25, 0, 0]}>
              <boxGeometry args={[1.08, 0.028, 0.022]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.015, 0.36]} rotation={[-0.25, 0, 0]}>
              <boxGeometry args={[1.08, 0.028, 0.022]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
            </mesh>
            <mesh position={[-0.53, 0.015, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[0.022, 0.028, 0.74]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
            </mesh>
            <mesh position={[0.53, 0.015, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[0.022, 0.028, 0.74]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
            </mesh>
          </group>

          {/* In Phase 7 (Dividing 0.0..0.45), show the unified block flattening and splitting into the 6 portions */}
          {cfg.doughState === 'dividing' && effectiveProgress < 0.55 && (
            <mesh
              geometry={bulkGeom}
              position={[0, 0.08, 0]}
              scale={[
                THREE.MathUtils.lerp(1.1, 1.35, effectiveProgress / 0.55),
                THREE.MathUtils.lerp(0.65, 0.22, effectiveProgress / 0.55),
                THREE.MathUtils.lerp(0.95, 1.1, effectiveProgress / 0.55),
              ]}
              castShadow
            >
              <meshStandardMaterial
                color={HYDRATED_DOUGH_COLOR}
                bumpMap={doughBumpTex}
                bumpScale={0.006}
                roughness={0.54}
              />
            </mesh>
          )}

          {/* Translucent protective resting dome in Phase 9 (lowers at 0..0.2, lifts at 0.85..1.0) */}
          {cfg.doughState === 'resting' && (
            <mesh
              position={[
                0,
                effectiveProgress < 0.2
                  ? THREE.MathUtils.lerp(0.42, 0.14, effectiveProgress / 0.2)
                  : effectiveProgress > 0.85
                  ? THREE.MathUtils.lerp(0.14, 0.42, (effectiveProgress - 0.85) / 0.15)
                  : 0.14,
                0,
              ]}
            >
              <boxGeometry args={[1.04, 0.24, 0.7]} />
              <meshPhysicalMaterial
                color="#BAE6FD"
                transparent
                opacity={0.25}
                roughness={0.1}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Articulated conditioning mist/brush pass in Phase 12 */}
          {cfg.doughState === 'scoring' && (
            <group
              position={[
                THREE.MathUtils.lerp(-0.48, 0.48, effectiveProgress),
                0.24,
                0,
              ]}
            >
              <mesh>
                <boxGeometry args={[0.05, 0.04, 0.68]} />
                <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
              </mesh>
              <mesh position={[0, -0.06, 0]}>
                <boxGeometry args={[0.03, 0.08, 0.62]} />
                <meshBasicMaterial color="#38BDF8" transparent opacity={0.28} />
              </mesh>
            </group>
          )}

          {/* Core probe thermometer during Phase 15 Inspection */}
          {cfg.doughState === 'inspection' && (
            <group
              position={[
                0,
                THREE.MathUtils.lerp(
                  0.34,
                  0.19,
                  Math.sin(Math.min(1, effectiveProgress / 0.75) * Math.PI)
                ),
                -0.17,
              ]}
              rotation={[0, 0, -0.2]}
            >
              <mesh position={[0, -0.06, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 0.16, 8]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.1, 0.065, 0.025]} />
                <meshStandardMaterial color="#1B4332" />
              </mesh>
            </group>
          )}

          {/* 6 Individual 3D Dough / Bread Roll Units */}
          {pieceOffsets.map((pos, idx) => {
            // Smooth radial separation in Phase 7 (Dividing)
            const spread =
              cfg.doughState === 'dividing'
                ? THREE.MathUtils.lerp(
                    0.18,
                    1.0,
                    THREE.MathUtils.clamp((effectiveProgress - 0.25) / 0.75, 0, 1)
                  )
                : 1.0;

            // Helical orbital motion in Phase 8 (Rounding)
            const orbitAngle = effectiveProgress * Math.PI * 4 + idx;
            const orbitR =
              cfg.doughState === 'rounding'
                ? Math.sin(effectiveProgress * Math.PI) * 0.032
                : 0;

            const isCutChunk = cfg.doughState === 'dividing' && effectiveProgress < 0.75;
            const isRoundBall =
              (cfg.doughState === 'dividing' && effectiveProgress >= 0.75) ||
              cfg.doughState === 'rounding' ||
              cfg.doughState === 'resting';

            // In Phase 10 (Shaping), smoothly morph scale from spherical ball to elongated coiled Colombian roll
            const shapingT =
              cfg.doughState === 'shaping'
                ? THREE.MathUtils.clamp((effectiveProgress - idx * 0.06) / 0.7, 0, 1)
                : 1.0;

            const dynamicScale: [number, number, number] =
              cfg.doughState === 'shaping'
                ? [
                    pieceApp.scale[0] * THREE.MathUtils.lerp(0.55, 1.0, shapingT),
                    pieceApp.scale[1] * THREE.MathUtils.lerp(1.15, 1.0, shapingT),
                    pieceApp.scale[2] * THREE.MathUtils.lerp(1.18, 1.0, shapingT),
                  ]
                : pieceApp.scale;

            // Slight natural variation in angle per roll so they look artisanally placed
            const naturalYaw = ((idx % 3) - 1) * 0.035;

            // Front-center roll (idx === 4) shows the Cross-Sectional Crumb Cut when shouldShowSlicedCrumb is active!
            const isSlicedSpecimen =
              idx === 4 &&
              shouldShowSlicedCrumb &&
              (cfg.doughState === 'baking' ||
                cfg.doughState === 'cooling' ||
                cfg.doughState === 'inspection' ||
                cfg.doughState === 'packaging');

            return (
              <group
                key={idx}
                position={[
                  pos[0] * spread + Math.cos(orbitAngle) * orbitR,
                  0.065,
                  pos[2] * spread + Math.sin(orbitAngle) * orbitR,
                ]}
                rotation={[0, naturalYaw, 0]}
                scale={dynamicScale}
              >
                {isCutChunk ? (
                  <mesh geometry={cutPortionGeom} castShadow receiveShadow>
                    <meshStandardMaterial
                      color={pieceApp.color}
                      bumpMap={doughBumpTex}
                      bumpScale={0.01}
                      roughness={pieceApp.roughness}
                    />
                  </mesh>
                ) : isRoundBall ? (
                  <mesh geometry={roundedBallGeom} castShadow receiveShadow>
                    <meshStandardMaterial
                      color={pieceApp.color}
                      bumpMap={doughBumpTex}
                      bumpScale={0.005}
                      roughness={pieceApp.roughness}
                    />
                  </mesh>
                ) : isSlicedSpecimen ? (
                  /* SLICED COLOMBIAN BREAD ROLL SPECIMEN WITH INTERNAL ALVEOLAR CRUMB STRUCTURE */
                  <group>
                    {/* Left half with exposed alveolar crumb face */}
                    <group position={[-0.018, 0, 0]}>
                      <mesh geometry={slicedRollGeoms.crustGeom} castShadow receiveShadow>
                        <meshStandardMaterial
                          key={pieceApp.useCrustMap ? 'baked-s1' : 'raw-s1'}
                          color={pieceApp.color}
                          map={pieceApp.useCrustMap ? crustTex : undefined}
                          bumpMap={doughBumpTex}
                          bumpScale={0.004}
                          roughness={pieceApp.roughness}
                        />
                      </mesh>
                      <mesh
                        geometry={slicedRollGeoms.crumbCapGeom}
                        position={[0.001, 0, 0]}
                      >
                        <meshStandardMaterial
                          map={crumbAlveoliTex}
                          bumpMap={doughBumpTex}
                          bumpScale={0.008}
                          roughness={0.85}
                        />
                      </mesh>
                    </group>
                    {/* Right half rotated slightly open so camera clearly sees the alveolar crumb */}
                    <group position={[0.025, 0, 0.02]} rotation={[0, 0.55, 0]}>
                      <mesh
                        geometry={slicedRollGeoms.crustGeom}
                        rotation={[0, Math.PI, 0]}
                        castShadow
                        receiveShadow
                      >
                        <meshStandardMaterial
                          key={pieceApp.useCrustMap ? 'baked-s2' : 'raw-s2'}
                          color={pieceApp.color}
                          map={pieceApp.useCrustMap ? crustTex : undefined}
                          bumpMap={doughBumpTex}
                          bumpScale={0.004}
                          roughness={pieceApp.roughness}
                        />
                      </mesh>
                      <mesh
                        geometry={slicedRollGeoms.crumbCapGeom}
                        rotation={[0, Math.PI, 0]}
                        position={[-0.001, 0, 0]}
                      >
                        <meshStandardMaterial
                          map={crumbAlveoliTex}
                          bumpMap={doughBumpTex}
                          bumpScale={0.008}
                          roughness={0.85}
                        />
                      </mesh>
                    </group>
                  </group>
                ) : (
                  /* AUTHENTIC COLOMBIAN PAN DE SAL TIPO ROLLO (CUSTOM ORGANIC GEOMETRY) */
                  <mesh geometry={rollBreadGeom} castShadow receiveShadow>
                    <meshStandardMaterial
                      key={pieceApp.useCrustMap ? 'baked-roll' : 'raw-roll'}
                      color={pieceApp.color}
                      map={pieceApp.useCrustMap ? crustTex : undefined}
                      bumpMap={doughBumpTex}
                      bumpScale={pieceApp.useCrustMap ? 0.0045 : 0.006}
                      roughness={pieceApp.roughness}
                      metalness={0.01}
                    />
                  </mesh>
                )}
              </group>
            );
          })}

          {/* Translucent packaging bag + red heat seal + lot/allergen label in Phases 16-18 */}
          {(cfg.doughState === 'packaging' ||
            cfg.doughState === 'storage_pt' ||
            cfg.doughState === 'distribution') && (
            <group position={[0, 0.11, 0]}>
              <mesh
                scale={[
                  cfg.doughState === 'packaging'
                    ? THREE.MathUtils.lerp(0.4, 1.0, Math.min(1, effectiveProgress / 0.55))
                    : 1.0,
                  1,
                  1,
                ]}
              >
                <boxGeometry args={[1.02, 0.24, 0.68]} />
                <meshPhysicalMaterial
                  color="#E0F2FE"
                  transparent
                  opacity={
                    cfg.doughState === 'packaging'
                      ? THREE.MathUtils.lerp(0.12, 0.28, effectiveProgress)
                      : 0.28
                  }
                  roughness={0.08}
                  depthWrite={false}
                />
              </mesh>
              {/* Traceability & Allergen Label ("CONTIENE GLUTEN · LOTE PILOTO") stamped at p >= 0.65 */}
              {(cfg.doughState !== 'packaging' || effectiveProgress >= 0.65) && (
                <group position={[0, 0.124, 0]}>
                  <mesh>
                    <boxGeometry args={[0.34, 0.012, 0.2]} />
                    <meshStandardMaterial color="#FFFFFF" />
                  </mesh>
                  <mesh position={[0, 0.007, 0.04]}>
                    <boxGeometry args={[0.28, 0.004, 0.04]} />
                    <meshStandardMaterial color="#1B4332" />
                  </mesh>
                </group>
              )}
              {/* Hermetic Red Heat-Seal Strip formed at p >= 0.45 */}
              {(cfg.doughState !== 'packaging' || effectiveProgress >= 0.45) && (
                <mesh position={[0.48, 0.05, 0]}>
                  <boxGeometry args={[0.03, 0.08, 0.65]} />
                  <meshStandardMaterial color="#DC2626" />
                </mesh>
              )}
            </group>
          )}
        </group>
      )}
    </group>
  );
};
