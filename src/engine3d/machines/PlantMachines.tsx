import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  createBrushedMetalTexture,
  createDigitalDisplayTexture,
  createSackTexture,
  createWoodGrainTexture,
} from '../materials';
import {
  createDeformedSackGeometry,
  createHelicalRounderTrackGeometry,
  createTrueSpiralHookGeometry,
} from '../models/OrganicGeometries';
import { SimulationVariables } from '../simulationConfig';

interface Props {
  activeMachineId: string;
  activePhaseId: number;
  selectedMachineId: string | null;
  onSelectMachine: (id: string) => void;
  isPlaying: boolean;
  speed: number;
  simVars: SimulationVariables;
  phaseProgress?: number;
}

const HighlightRing: React.FC<{
  position: [number, number, number];
  radius: number;
  active: boolean;
  selected: boolean;
}> = ({ position, radius, active, selected }) => {
  if (!active && !selected) return null;
  return (
    <group position={[position[0], 0.014, position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.11, 64]} />
        <meshBasicMaterial color={selected ? '#1B4332' : '#C87D20'} transparent opacity={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <circleGeometry args={[radius, 48]} />
        <meshBasicMaterial color={selected ? '#1B4332' : '#C87D20'} transparent opacity={0.07} />
      </mesh>
    </group>
  );
};

export const PlantMachines: React.FC<Props> = ({
  activeMachineId,
  activePhaseId,
  selectedMachineId,
  onSelectMachine,
  isPlaying,
  speed,
  simVars,
  phaseProgress = 0.5,
}) => {
  // Articulated kinematic refs
  const sifterCrankRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Group>(null);
  const bowlRef = useRef<THREE.Mesh>(null);
  const mixerGuardRef = useRef<THREE.Group>(null);
  const prooferDoorRef = useRef<THREE.Group>(null);
  const dividerHeadRef = useRef<THREE.Group>(null);
  const dividerLeverRef = useRef<THREE.Group>(null);
  const rounderConeRef = useRef<THREE.Mesh>(null);
  const molderRoller1Ref = useRef<THREE.Mesh>(null);
  const molderRoller2Ref = useRef<THREE.Mesh>(null);
  const ovenDoorRef = useRef<THREE.Group>(null);
  const ovenHandleRef = useRef<THREE.Mesh>(null);
  const ovenFan1Ref = useRef<THREE.Group>(null);
  const ovenFan2Ref = useRef<THREE.Group>(null);
  const fanBladesRef = useRef<THREE.Group>(null);
  const sealerArmRef = useRef<THREE.Group>(null);
  const labelerHeadRef = useRef<THREE.Mesh>(null);
  const vanDoorLRef = useRef<THREE.Group>(null);
  const vanDoorRRef = useRef<THREE.Group>(null);

  // Shared custom geometries
  const sackGeoms = useMemo(
    () => [
      createDeformedSackGeometry(0.68, 0.24, 0.48, 0.5),
      createDeformedSackGeometry(0.66, 0.25, 0.47, 1.8),
      createDeformedSackGeometry(0.69, 0.24, 0.49, 3.1),
    ],
    []
  );
  const spiralHookGeom = useMemo(() => createTrueSpiralHookGeometry(), []);
  const rounderTrackGeom = useMemo(() => createHelicalRounderTrackGeometry(), []);

  // Shared PBR procedural textures
  const sackTex = useMemo(() => createSackTexture('HARINA'), []);
  const metalTex = useMemo(() => createBrushedMetalTexture(), []);
  const woodTex = useMemo(() => createWoodGrainTexture(), []);

  // Dynamic Scale LCD Display during Phase 3 (quantized to 5 steps so it shows real formulation progress!)
  const dosingStage =
    activePhaseId !== 3
      ? 2
      : phaseProgress < 0.15
      ? 0
      : phaseProgress < 0.35
      ? 1
      : phaseProgress < 0.55
      ? 2
      : phaseProgress < 0.82
      ? 3
      : 4;

  const scaleDisplayTex = useMemo(() => {
    const stages = [
      { top: '0.0 g', bot: 'TARE · LISTO', col: '#38BDF8' },
      { top: '540.0 g', bot: 'HARINA (54%)', col: '#FBBF24' },
      { top: '1000.0 g', bot: 'HARINA 100%', col: '#34D399' },
      { top: '1580.0 g', bot: '+AGUA 580 g', col: '#38BDF8' },
      { top: '1693.0 g', bot: 'LOTE 169.3%', col: '#34D399' },
    ];
    const s = stages[dosingStage] || stages[2];
    return createDigitalDisplayTexture(s.top, s.bot, s.col, 'BÁSCULA GRAVIMÉTRICA');
  }, [dosingStage]);

  const receptionScaleTex = useMemo(
    () => createDigitalDisplayTexture('250.0 kg', '5 SACOS · OK', '#34D399', 'BÁSCULA RECEPCIÓN'),
    []
  );

  const hygrometerTex = useMemo(
    () => createDigitalDisplayTexture('21.4°C', '58% HR · PEPS', '#34D399', 'TERMOHIGRÓMETRO'),
    []
  );

  const prooferDisplayTex = useMemo(
    () =>
      createDigitalDisplayTexture(
        `${simVars.fermTemp}°C`,
        `${simVars.fermHumidity}% HR`,
        '#38BDF8',
        'CLIMATIZACIÓN PID'
      ),
    [simVars.fermTemp, simVars.fermHumidity]
  );

  const ovenDisplayTex = useMemo(
    () =>
      createDigitalDisplayTexture(
        `${simVars.bakeTemp}°C`,
        `${simVars.bakeTime} MIN`,
        '#FB923C',
        'CONVECCIÓN FORZADA'
      ),
    [simVars.bakeTemp, simVars.bakeTime]
  );

  useEffect(() => {
    return () => {
      sackGeoms.forEach((g) => g.dispose());
      spiralHookGeom.dispose();
      rounderTrackGeom.dispose();
      sackTex.dispose();
      metalTex.dispose();
      woodTex.dispose();
      receptionScaleTex.dispose();
      hygrometerTex.dispose();
    };
  }, [
    sackGeoms,
    spiralHookGeom,
    rounderTrackGeom,
    sackTex,
    metalTex,
    woodTex,
    receptionScaleTex,
    hygrometerTex,
  ]);

  useEffect(() => () => scaleDisplayTex.dispose(), [scaleDisplayTex]);
  useEffect(() => () => prooferDisplayTex.dispose(), [prooferDisplayTex]);
  useEffect(() => () => ovenDisplayTex.dispose(), [ovenDisplayTex]);

  useFrame((_, delta) => {
    const dt = isPlaying ? delta * speed : 0;
    const p = phaseProgress;

    // 1. Flour Sifter crank rotation in Phase 3 (0.0..0.55)
    if (sifterCrankRef.current && activePhaseId === 3 && isPlaying && p < 0.55) {
      sifterCrankRef.current.rotation.y += dt * 6.0;
    }

    // 2. Spiral Mixer safety guard & coordinated hook/bowl rotation in Phases 4 & 5
    if (mixerGuardRef.current) {
      const guardOpen =
        (activePhaseId === 4 && p < 0.15) || (activePhaseId === 5 && p > 0.9);
      const targetGuardRot = guardOpen ? -0.68 : 0;
      mixerGuardRef.current.rotation.x = THREE.MathUtils.lerp(
        mixerGuardRef.current.rotation.x,
        targetGuardRot,
        0.14
      );
    }

    const mixerActive =
      (activePhaseId === 4 && p >= 0.15) || (activePhaseId === 5 && p <= 0.9);
    if (mixerActive && isPlaying && hookRef.current && bowlRef.current) {
      const kneadSpeedMult = THREE.MathUtils.clamp(simVars.kneadTime / 10, 0.6, 1.5);
      const rate = activePhaseId === 5 ? 6.2 * kneadSpeedMult : 2.5;
      hookRef.current.rotation.y += dt * rate;
      bowlRef.current.rotation.y -= dt * (rate * 0.36);
    }

    // 3. Proofer glass door articulation in Phases 6 & 11 (opens at start 0..0.15 and end 0.86..1.0)
    if (prooferDoorRef.current) {
      const prooferOpen =
        (activePhaseId === 6 || activePhaseId === 11) && (p < 0.15 || p > 0.86);
      const targetDoorRot = prooferOpen ? -0.62 : 0;
      prooferDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        prooferDoorRef.current.rotation.y,
        targetDoorRot,
        0.12
      );
    }

    // 4. Hydraulic Dough Divider compression head, knife grid & manual lever in Phase 7
    if (dividerHeadRef.current && dividerLeverRef.current) {
      const isPressing = activePhaseId === 7 && p >= 0.18 && p <= 0.62;
      const pressDepth = isPressing
        ? Math.sin(((p - 0.18) / 0.44) * Math.PI)
        : 0;
      const targetHeadY = 1.54 - pressDepth * 0.22;
      const targetLeverRot = 0.25 + pressDepth * 0.75;
      dividerHeadRef.current.position.y = THREE.MathUtils.lerp(
        dividerHeadRef.current.position.y,
        targetHeadY,
        0.18
      );
      dividerLeverRef.current.rotation.x = THREE.MathUtils.lerp(
        dividerLeverRef.current.rotation.x,
        targetLeverRot,
        0.18
      );
    }

    // 5. Conical Rounder rotation in Phase 8
    if (rounderConeRef.current && activePhaseId === 8 && isPlaying) {
      rounderConeRef.current.rotation.y += dt * 4.5;
    }

    // 6. Two-Roller Molder counter-rotation in Phase 10
    if (
      molderRoller1Ref.current &&
      molderRoller2Ref.current &&
      activePhaseId === 10 &&
      isPlaying
    ) {
      molderRoller1Ref.current.rotation.x += dt * 8.0;
      molderRoller2Ref.current.rotation.x -= dt * 8.0;
    }

    // 7. Convection Oven 12-Step Door, Latch Handle & Dual Rear Convection Turbines
    if (ovenDoorRef.current && ovenHandleRef.current) {
      const ovenOpen =
        (activePhaseId === 13 && (p < 0.18 || p > 0.82)) ||
        activePhaseId === 12 ||
        activePhaseId === 14;
      const targetOvenDoor = ovenOpen ? -0.68 : 0;
      const targetLatch = ovenOpen ? 0.45 : 0;
      ovenDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        ovenDoorRef.current.rotation.y,
        targetOvenDoor,
        0.12
      );
      ovenHandleRef.current.rotation.z = THREE.MathUtils.lerp(
        ovenHandleRef.current.rotation.z,
        targetLatch,
        0.15
      );
    }

    if (ovenFan1Ref.current && ovenFan2Ref.current) {
      const fansRunning = activePhaseId === 13 && p >= 0.18 && p <= 0.85;
      if (fansRunning && isPlaying) {
        ovenFan1Ref.current.rotation.z += dt * 14.0;
        ovenFan2Ref.current.rotation.z -= dt * 14.0;
      }
    }

    // 8. Cooling Rack Fan Turbine in Phase 14
    if (fanBladesRef.current && activePhaseId === 14 && isPlaying) {
      fanBladesRef.current.rotation.z += dt * 9.0;
    }

    // 9. Packaging Impulse Sealer Jaw (0.35..0.70) & Automatic Label Applicator (0.70..0.92) in Phase 16
    if (sealerArmRef.current) {
      const sealing = activePhaseId === 16 && p >= 0.35 && p <= 0.7;
      const targetSealRot = sealing ? 0.02 : 0.28;
      sealerArmRef.current.rotation.x = THREE.MathUtils.lerp(
        sealerArmRef.current.rotation.x,
        targetSealRot,
        0.18
      );
    }
    if (labelerHeadRef.current) {
      const stamping = activePhaseId === 16 && p >= 0.7 && p <= 0.92;
      const targetLabelY = stamping ? 0.18 : 0.32;
      labelerHeadRef.current.position.y = THREE.MathUtils.lerp(
        labelerHeadRef.current.position.y,
        targetLabelY,
        0.2
      );
    }

    // 10. Delivery Van Rear Cargo Doors in Phase 18
    if (vanDoorLRef.current && vanDoorRRef.current) {
      const vanOpen = activePhaseId === 18 && p < 0.82;
      const targetL = vanOpen ? 1.35 : 0;
      const targetR = vanOpen ? -1.35 : 0;
      vanDoorLRef.current.rotation.y = THREE.MathUtils.lerp(
        vanDoorLRef.current.rotation.y,
        targetL,
        0.12
      );
      vanDoorRRef.current.rotation.y = THREE.MathUtils.lerp(
        vanDoorRRef.current.rotation.y,
        targetR,
        0.12
      );
    }
  });

  const handlePick = (id: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelectMachine(id);
  };

  return (
    <group>
      {/* ==================== 1. RECEPTION, FLOOR SCALE & PEPS STORAGE (-10.5, -2.5) ==================== */}
      <group onClick={handlePick('reception')}>
        <HighlightRing
          position={[-10.5, 0, -2.5]}
          radius={2.15}
          active={activeMachineId === 'reception'}
          selected={selectedMachineId === 'reception'}
        />

        {/* Slatted Hardwood Pallet with Corner Blocks */}
        <group position={[-11.25, 0, -2.15]}>
          {[-0.62, 0, 0.62].map((sz, i) => (
            <mesh key={`str-${i}`} position={[0, 0.06, sz]} castShadow receiveShadow>
              <boxGeometry args={[1.95, 0.12, 0.14]} />
              <meshStandardMaterial map={woodTex} roughness={0.85} />
            </mesh>
          ))}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((sx, i) => (
            <mesh key={`slat-${i}`} position={[sx, 0.14, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.038, 1.56]} />
              <meshStandardMaterial map={woodTex} roughness={0.78} />
            </mesh>
          ))}
        </group>

        {/* Deformed Organic Textile Flour Sacks (Never rigid boxes!) */}
        {[
          { pos: [-11.62, 0.27, -2.42], rot: 0.04, g: 0 },
          { pos: [-10.88, 0.27, -2.42], rot: -0.05, g: 1 },
          { pos: [-11.62, 0.27, -1.88], rot: -0.03, g: 2 },
          { pos: [-10.88, 0.27, -1.88], rot: 0.06, g: 0 },
          { pos: [-11.62, 0.49, -2.42], rot: -0.06, g: 1 },
          { pos: [-10.88, 0.49, -2.42], rot: 0.05, g: 2 },
          { pos: [-11.25, 0.49, -1.92], rot: 0.08, g: 0 },
          { pos: [-11.25, 0.71, -2.38], rot: -0.04, g: 1 },
        ].map((s, i) => (
          <mesh
            key={`sack-${i}`}
            geometry={sackGeoms[s.g]}
            position={s.pos as [number, number, number]}
            rotation={[0, s.rot, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial map={sackTex} roughness={0.9} />
          </mesh>
        ))}

        {/* Industrial Floor Platform Scale & Inspection Podium (-10.05, 0, -1.45) */}
        <group position={[-10.05, 0, -1.45]}>
          {/* Floor Weighing Deck */}
          <mesh position={[0, 0.04, 0.35]} castShadow receiveShadow>
            <boxGeometry args={[0.72, 0.07, 0.72]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Checkered stainless top plate */}
          <mesh position={[0, 0.08, 0.35]} receiveShadow>
            <boxGeometry args={[0.66, 0.015, 0.66]} />
            <meshStandardMaterial color="#CBD5E1" bumpMap={metalTex} bumpScale={0.005} metalness={0.85} roughness={0.22} />
          </mesh>
          {/* Scale Pedestal Column & Digital Readout */}
          <mesh position={[0, 0.54, -0.05]} castShadow>
            <cylinderGeometry args={[0.035, 0.045, 1.08, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0.84, 0]}>
            <boxGeometry args={[0.48, 0.035, 0.38]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.82} roughness={0.22} />
          </mesh>
          <mesh position={[0, 1.12, -0.05]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.34, 0.18, 0.06]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 1.12, -0.018]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.3, 0.14]} />
            <meshBasicMaterial map={receptionScaleTex} />
          </mesh>
        </group>

        {/* 4-Post Bolted PEPS Shelving Unit with Diagonal Cross-Bracing & Wall Hygrometer */}
        <group position={[-9.45, 0, -3.25]}>
          {[
            [-0.78, -0.38],
            [0.78, -0.38],
            [-0.78, 0.38],
            [0.78, 0.38],
          ].map(([px, pz], i) => (
            <group key={`post-${i}`} position={[px, 0, pz]}>
              <mesh position={[0, 1.1, 0]} castShadow>
                <boxGeometry args={[0.06, 2.2, 0.06]} />
                <meshStandardMaterial color="#1E293B" metalness={0.75} roughness={0.32} />
              </mesh>
              {/* Adjustable leveling foot */}
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.06, 0.04, 12]} />
                <meshStandardMaterial color="#0F172A" metalness={0.5} />
              </mesh>
            </group>
          ))}
          {/* Side diagonal structural cross-bracing */}
          {[-0.78, 0.78].map((px, i) => (
            <mesh key={`brace-${i}`} position={[px, 1.1, 0]} rotation={[0.68, 0, 0]}>
              <boxGeometry args={[0.02, 1.1, 0.03]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>
          ))}
          {[0.28, 0.95, 1.62, 2.15].map((sy, i) => (
            <mesh key={`shelf-${i}`} position={[0, sy, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.64, 0.05, 0.84]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.28} />
            </mesh>
          ))}
          {/* Sealed food-grade ingredient totes with colored lids & locking clasps */}
          {[
            { pos: [-0.48, 0.48, 0], body: '#F8FAFC', lid: '#0284C7' },
            { pos: [0.02, 0.48, 0], body: '#F8FAFC', lid: '#D97706' },
            { pos: [0.52, 0.48, 0], body: '#F8FAFC', lid: '#16A34A' },
            { pos: [-0.42, 1.15, 0], body: '#FEF3C7', lid: '#CA8A04' },
            { pos: [0.38, 1.15, 0], body: '#F1F5F9', lid: '#475569' },
          ].map((bin, i) => (
            <group key={`bin-${i}`} position={bin.pos as [number, number, number]}>
              <RoundedBox args={[0.42, 0.32, 0.56]} radius={0.03} smoothness={2} castShadow>
                <meshStandardMaterial color={bin.body} roughness={0.28} />
              </RoundedBox>
              <mesh position={[0, 0.17, 0]} castShadow>
                <boxGeometry args={[0.44, 0.03, 0.58]} />
                <meshStandardMaterial color={bin.lid} roughness={0.32} />
              </mesh>
              {/* Side locking clasps */}
              <mesh position={[0.22, 0.13, 0]}>
                <boxGeometry args={[0.02, 0.06, 0.14]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
            </group>
          ))}

          {/* Wall-Mounted Digital Thermohygrometer */}
          <group position={[1.15, 1.75, -1.65]}>
            <mesh>
              <boxGeometry args={[0.48, 0.28, 0.05]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <planeGeometry args={[0.44, 0.23]} />
              <meshBasicMaterial map={hygrometerTex} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== 2. DOSING, DIGITAL SCALE & SIFTER TABLE (-7.0, -2.5) ==================== */}
      <group onClick={handlePick('scale_table')}>
        <HighlightRing
          position={[-7.0, 0, -2.5]}
          radius={1.48}
          active={activeMachineId === 'scale_table'}
          selected={selectedMachineId === 'scale_table'}
        />
        {/* Brushed Stainless Prep Table with Rear Sanitary Backsplash & Adjustable Feet */}
        <mesh position={[-7.0, 0.9, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[2.16, 0.07, 1.18]} />
          <meshStandardMaterial
            color="#CBD5E1"
            bumpMap={metalTex}
            bumpScale={0.003}
            metalness={0.86}
            roughness={0.2}
          />
        </mesh>
        {/* Rear sanitary backsplash upstand */}
        <mesh position={[-7.0, 0.99, -3.06]} castShadow>
          <boxGeometry args={[2.16, 0.12, 0.04]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.86} roughness={0.2} />
        </mesh>
        <mesh position={[-7.0, 0.28, -2.5]} receiveShadow>
          <boxGeometry args={[2.0, 0.04, 1.04]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.78} roughness={0.26} />
        </mesh>
        {[
          [-7.98, -2.98],
          [-6.02, -2.98],
          [-7.98, -2.02],
          [-6.02, -2.02],
        ].map(([lx, lz], i) => (
          <group key={i} position={[lx, 0, lz]}>
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.038, 0.038, 0.9, 12]} />
              <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.05, 0.055, 0.04, 12]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        ))}

        {/* Platform Digital Scale with Pushbuttons & Live Dynamic Weight LCD */}
        <group position={[-7.15, 0.94, -2.42]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <boxGeometry args={[0.58, 0.08, 0.54]} />
            <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0.095, 0]}>
            <boxGeometry args={[0.5, 0.025, 0.44]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.16} />
          </mesh>
          {/* 4 Front Membrane Pushbuttons (ON, TARE, ZERO, UNIT) */}
          {[-0.15, -0.05, 0.05, 0.15].map((bx, bi) => (
            <mesh key={bi} position={[bx, 0.06, 0.275]}>
              <boxGeometry args={[0.055, 0.025, 0.015]} />
              <meshStandardMaterial
                color={bi === 0 ? '#10B981' : bi === 1 ? '#F59E0B' : '#38BDF8'}
                emissive={bi === 1 ? '#F59E0B' : '#000000'}
                emissiveIntensity={0.4}
              />
            </mesh>
          ))}
          {/* Vertical scale column & digital LCD head */}
          <mesh position={[0, 0.34, -0.25]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.52, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.88} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0.58, -0.22]}>
            <boxGeometry args={[0.36, 0.2, 0.06]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 0.58, -0.188]}>
            <planeGeometry args={[0.32, 0.16]} />
            <meshBasicMaterial map={scaleDisplayTex} />
          </mesh>
        </group>

        {/* Articulated Rotary Stainless Flour Sifter (Tamiz) */}
        <group position={[-7.74, 1.02, -2.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.13, 28, 1, true]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.88}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Fine sieve wire mesh inside */}
          <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.165, 24]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Rotating Sifter Agitator & Crank */}
          <group ref={sifterCrankRef}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.3, 0.015, 0.02]} />
              <meshStandardMaterial color="#475569" metalness={0.85} />
            </mesh>
            <mesh position={[0.18, 0.04, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.09, 8]} />
              <meshStandardMaterial color="#B45309" />
            </mesh>
          </group>
        </group>

        {/* Precision Micro-Balance for Salt (18g) & Yeast (10g) */}
        <group position={[-6.35, 0.96, -2.62]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.05, 0.3]} />
            <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.032, -0.02]}>
            <cylinderGeometry args={[0.09, 0.09, 0.015, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.026, 0.12]} rotation={[-0.4, 0, 0]}>
            <planeGeometry args={[0.18, 0.045]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      </group>

      {/* ==================== 3. INDUSTRIAL SPIRAL MIXER & KNEADER (-3.5, -2.5) ==================== */}
      <group onClick={handlePick('mixer')}>
        <HighlightRing
          position={[-3.5, 0, -2.5]}
          radius={1.58}
          active={activeMachineId === 'mixer'}
          selected={selectedMachineId === 'mixer'}
        />
        {/* 4 Vibration-Damping Leveling Feet */}
        {[
          [-4.12, -3.25],
          [-2.88, -3.25],
          [-4.12, -1.75],
          [-2.88, -1.75],
        ].map(([fx, fz], i) => (
          <mesh key={`mfoot-${i}`} position={[fx, 0.03, fz]}>
            <cylinderGeometry args={[0.065, 0.08, 0.06, 14]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
        ))}

        {/* Heavy Cast Base with Turntable Support */}
        <RoundedBox
          args={[1.48, 0.36, 1.82]}
          radius={0.06}
          smoothness={4}
          position={[-3.5, 0.21, -2.5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#E2E8F0" metalness={0.48} roughness={0.3} />
        </RoundedBox>

        {/* Rear Motor Column with Cooling Louver Vents & Bolted Access Plate */}
        <RoundedBox
          args={[0.96, 1.38, 0.72]}
          radius={0.05}
          smoothness={3}
          position={[-3.5, 0.98, -3.06]}
          castShadow
        >
          <meshStandardMaterial color="#CBD5E1" metalness={0.52} roughness={0.3} />
        </RoundedBox>
        {/* Motor Cooling Louver Fins */}
        {[0.65, 0.78, 0.91, 1.04, 1.17].map((vy, i) => (
          <mesh key={`vent-${i}`} position={[-3.5, vy, -3.43]}>
            <boxGeometry args={[0.62, 0.03, 0.02]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
        ))}

        {/* Overhanging Transmission Head with Belt Pulley Cover */}
        <RoundedBox
          args={[0.92, 0.42, 1.48]}
          radius={0.07}
          smoothness={4}
          position={[-3.5, 1.58, -2.5]}
          castShadow
        >
          <meshStandardMaterial color="#F8FAFC" metalness={0.4} roughness={0.26} />
        </RoundedBox>
        {/* Visible Hex Bolts along Transmission Side */}
        {[-2.95, -2.65, -2.35, -2.05].map((bz, i) => (
          <mesh key={`bolt-${i}`} position={[-3.03, 1.58, bz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.02, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Electronic Control Console with 2-Speed Selector, Timer & E-Stop */}
        <group position={[-2.92, 1.54, -2.32]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.38, 0.54]} />
            <meshStandardMaterial color="#14181F" roughness={0.32} />
          </mesh>
          {/* Digital Cycle Timer Readout */}
          <mesh position={[0.115, 0.11, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[0.32, 0.08]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>
          {/* Green Vel 1 / Run Indicator */}
          <mesh position={[0.115, 0.02, 0.14]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={activePhaseId === 4 || activePhaseId === 5 ? 1.8 : 0.2}
            />
          </mesh>
          {/* Amber Vel 2 High-Speed Knead Indicator */}
          <mesh position={[0.115, 0.02, 0.02]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={activePhaseId === 5 ? 1.8 : 0.15}
            />
          </mesh>
          {/* Red Emergency Stop Mushroom Button with Yellow Collar */}
          <mesh position={[0.115, -0.09, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.015, 16]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>
          <mesh position={[0.13, -0.09, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.042, 0.028, 0.04, 16]} />
            <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={0.35} />
          </mesh>
        </group>

        {/* Rotating Deep-Drawn Stainless Steel Bowl + Lateral Friction Drive Rollers */}
        <group position={[-3.5, 0.78, -2.35]}>
          <mesh ref={bowlRef} castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.48, 0.74, 40, 1, true]} />
            <meshStandardMaterial
              color="#CBD5E1"
              bumpMap={metalTex}
              bumpScale={0.003}
              metalness={0.9}
              roughness={0.16}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.6, 0.026, 12, 40]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.14} />
          </mesh>
          <mesh position={[0, -0.35, 0]} receiveShadow>
            <cylinderGeometry args={[0.48, 0.48, 0.04, 40]} />
            <meshStandardMaterial color="#64748B" metalness={0.86} roughness={0.22} />
          </mesh>
          {/* Lateral rubber drive rollers supporting the bowl */}
          {[-0.44, 0.44].map((rx, i) => (
            <mesh key={`roller-${i}`} position={[rx, -0.34, -0.28]}>
              <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
              <meshStandardMaterial color="#1E293B" roughness={0.7} />
            </mesh>
          ))}
        </group>

        {/* Articulated Stainless Wire Safety Guard Cage with Hinge Pivot */}
        <group ref={mixerGuardRef} position={[-3.5, 1.24, -2.75]}>
          <group position={[0, 0, 0.4]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.59, 0.018, 10, 36]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.46, 0.015, 10, 36]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
            </mesh>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((barIdx) => {
              const angle = (barIdx / 7) * Math.PI * 1.15 - Math.PI * 0.575;
              return (
                <mesh
                  key={barIdx}
                  position={[Math.sin(angle) * 0.53, 0.08, Math.cos(angle) * 0.53]}
                  rotation={[-Math.cos(angle) * 0.35, 0, Math.sin(angle) * 0.35]}
                >
                  <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.88} roughness={0.18} />
                </mesh>
              );
            })}
          </group>
        </group>

        {/* Fixed Central L-Shaped Breaker Bar + Rotating 3D Helical Spiral Hook */}
        <group position={[-3.5, 1.15, -2.52]}>
          <mesh rotation={[0.12, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.58, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.92} roughness={0.16} />
          </mesh>
          <mesh position={[0, -0.28, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.92} roughness={0.16} />
          </mesh>
        </group>
        <group ref={hookRef} position={[-3.5, 1.38, -2.35]}>
          <mesh geometry={spiralHookGeom} castShadow>
            <meshStandardMaterial color="#E2E8F0" metalness={0.94} roughness={0.12} />
          </mesh>
        </group>
      </group>

      {/* ==================== 4. FERMENTATION CHAMBER WITH ARTICULATED GLASS DOOR (0.5, -2.6) ==================== */}
      <group onClick={handlePick('proofer')}>
        <HighlightRing
          position={[0.5, 0, -2.6]}
          radius={1.55}
          active={activeMachineId === 'proofer'}
          selected={selectedMachineId === 'proofer'}
        />
        {/* Back wall */}
        <mesh position={[0.5, 1.28, -3.22]} castShadow receiveShadow>
          <boxGeometry args={[1.72, 2.56, 0.12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.78} roughness={0.26} />
        </mesh>
        {/* Warm Illuminated Interior Back Panel */}
        <mesh position={[0.5, 1.22, -3.14]}>
          <planeGeometry args={[1.48, 1.96]} />
          <meshStandardMaterial
            color="#FEF3C7"
            emissive="#F59E0B"
            emissiveIntensity={activePhaseId === 6 || activePhaseId === 11 ? 0.6 : 0.18}
            roughness={0.4}
          />
        </mesh>
        {/* Top Interior Circulation Fan Diffuser */}
        <mesh position={[0.5, 2.15, -2.55]}>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 20]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Left & Right Insulated Walls */}
        <mesh position={[-0.3, 1.28, -2.55]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.56, 1.38]} />
          <meshStandardMaterial color="#CBD5E1" bumpMap={metalTex} bumpScale={0.002} metalness={0.8} roughness={0.24} />
        </mesh>
        <mesh position={[1.3, 1.28, -2.55]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 2.56, 1.38]} />
          <meshStandardMaterial color="#CBD5E1" bumpMap={metalTex} bumpScale={0.002} metalness={0.8} roughness={0.24} />
        </mesh>
        {/* Bottom base & Top Header */}
        <mesh position={[0.5, 0.14, -2.55]} receiveShadow>
          <boxGeometry args={[1.72, 0.28, 1.38]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh position={[0.5, 2.38, -2.55]} castShadow>
          <boxGeometry args={[1.72, 0.36, 1.42]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.78} roughness={0.26} />
        </mesh>

        {/* Internal Stainless Rack Cart uprights & Tray Slides */}
        {[
          [-0.18, -2.85],
          [1.18, -2.85],
          [-0.18, -2.02],
          [1.18, -2.02],
        ].map(([rx, rz], i) => (
          <mesh key={`prack-${i}`} position={[rx, 1.24, rz]}>
            <boxGeometry args={[0.03, 1.85, 0.03]} />
            <meshStandardMaterial color="#64748B" metalness={0.85} />
          </mesh>
        ))}
        {[0.6, 0.92, 1.62, 1.92].map((ty, i) => (
          <mesh key={i} position={[0.5, ty, -2.4]}>
            <boxGeometry args={[1.36, 0.022, 0.9]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.82} roughness={0.22} />
          </mesh>
        ))}

        {/* Base Steam Humidifier Water Pan & Glowing Heating Coils */}
        <mesh position={[0.5, 0.3, -2.4]}>
          <boxGeometry args={[1.25, 0.06, 0.75]} />
          <meshStandardMaterial color="#0284C7" emissive="#38BDF8" emissiveIntensity={0.5} roughness={0.18} />
        </mesh>
        {[-0.25, 0, 0.25].map((hx, i) => (
          <mesh key={`hcoil-${i}`} position={[0.5 + hx, 0.34, -2.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.65, 10]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
          </mesh>
        ))}

        {/* Articulated Glass Viewing Door with Hinges, Gasket & Lever Handle */}
        <group ref={prooferDoorRef} position={[-0.24, 1.24, -1.86]}>
          {/* 3 External Barrel Hinges */}
          {[-0.7, 0, 0.7].map((hy, i) => (
            <mesh key={`phinge-${i}`} position={[0, hy, 0.02]}>
              <cylinderGeometry args={[0.025, 0.025, 0.1, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.85} />
            </mesh>
          ))}
          <mesh position={[0.74, 0, 0]}>
            <boxGeometry args={[1.48, 1.92, 0.03]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transparent
              opacity={0.16}
              roughness={0.05}
              metalness={0.05}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[1.4, 0, 0.05]}>
            <cylinderGeometry args={[0.024, 0.024, 0.78, 12]} />
            <meshStandardMaterial color="#14181F" metalness={0.75} roughness={0.25} />
          </mesh>
        </group>

        {/* Digital PID T/HR Controller */}
        <mesh position={[0.5, 2.38, -1.83]}>
          <planeGeometry args={[0.84, 0.32]} />
          <meshBasicMaterial map={prooferDisplayTex} />
        </mesh>
      </group>

      {/* ==================== 5. DIVIDER, CONICAL ROUNDER & ROLLER MOLDER LINE (4.8, -2.3) ==================== */}
      <group onClick={handlePick('shaping_table')}>
        <HighlightRing
          position={[4.8, 0, -2.3]}
          radius={2.38}
          active={activeMachineId === 'shaping_table'}
          selected={selectedMachineId === 'shaping_table'}
        />

        {/* 5A. Hydraulic Volumetric Dough Divider (Phase 7) */}
        <group position={[3.15, 0, -2.45]}>
          <RoundedBox
            args={[0.88, 1.05, 0.88]}
            radius={0.04}
            smoothness={3}
            position={[0, 0.525, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#E2E8F0" metalness={0.55} roughness={0.3} />
          </RoundedBox>
          {/* Open stainless dividing chamber bowl */}
          <mesh position={[0, 1.12, 0]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.16, 28, 1, true]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.88} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Articulated Hydraulic Compression Head & Stainless Dividing Knife Grid */}
          <group ref={dividerHeadRef} position={[0, 1.54, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.39, 0.35, 0.28, 28]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
            </mesh>
            {/* Central hydraulic piston rod */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.3, 14]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Stainless dividing blades grid beneath head */}
            <mesh position={[0, -0.16, 0]}>
              <boxGeometry args={[0.62, 0.06, 0.015]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[-0.14, -0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.58, 0.06, 0.015]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.14, -0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.58, 0.06, 0.015]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
          {/* Articulated Manual Hydraulic Lever on Left Side */}
          <group ref={dividerLeverRef} position={[-0.48, 1.05, 0]}>
            <mesh position={[0, 0.32, 0]} rotation={[0, 0, 0.15]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.68, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.22} />
            </mesh>
            <mesh position={[-0.05, 0.66, 0]}>
              <sphereGeometry args={[0.045, 14, 14]} />
              <meshStandardMaterial color="#DC2626" roughness={0.35} />
            </mesh>
          </group>
        </group>

        {/* 5B. Conical Dough Rounder / Boleadora Cónica with True 3D Helical Track (Phase 8) */}
        <group position={[4.15, 0, -2.85]}>
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.42, 0.76, 24]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.28} />
          </mesh>
          {/* Rotating Teflon-Coated Inverted Cone Drum */}
          <mesh ref={rounderConeRef} position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.46, 0.22, 0.62, 32]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.22} metalness={0.18} />
          </mesh>
          {/* True 3D Helical Spiral Track wrapping around the cone */}
          <mesh geometry={rounderTrackGeom} castShadow>
            <meshStandardMaterial color="#0284C7" roughness={0.28} metalness={0.25} />
          </mesh>
          {/* Top Stainless Flour Duster Box */}
          <mesh position={[0, 1.44, -0.25]} castShadow>
            <boxGeometry args={[0.28, 0.16, 0.2]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* 5C. Long Stainless & Maple Shaping Table + Two-Roller Molder (Phases 8-10, 12) */}
        <mesh position={[5.6, 0.9, -2.25]} castShadow receiveShadow>
          <boxGeometry args={[2.95, 0.07, 1.26]} />
          <meshStandardMaterial
            color="#CBD5E1"
            bumpMap={metalTex}
            bumpScale={0.003}
            metalness={0.84}
            roughness={0.2}
          />
        </mesh>
        {/* Hardwood Maple Shaping Surface */}
        <mesh position={[6.1, 0.945, -2.25]} receiveShadow>
          <boxGeometry args={[1.4, 0.026, 0.98]} />
          <meshStandardMaterial map={woodTex} roughness={0.62} />
        </mesh>
        {/* Industrial Two-Roller Dough Molder / Formadora de Rodillos at x = 5.32 */}
        <group position={[5.32, 1.08, -2.25]}>
          {/* Side Housing Plates */}
          {[-0.38, 0.38].map((sz, i) => (
            <mesh key={`mplate-${i}`} position={[0, 0.06, sz]} castShadow>
              <boxGeometry args={[0.38, 0.28, 0.04]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.28} />
            </mesh>
          ))}
          {/* Upper & Lower Counter-Rotating Sheeting Rollers */}
          <mesh ref={molderRoller1Ref} position={[-0.06, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.048, 0.048, 0.72, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.14} />
          </mesh>
          <mesh ref={molderRoller2Ref} position={[0.06, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.048, 0.048, 0.72, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.14} />
          </mesh>
        </group>

        <mesh position={[5.6, 0.28, -2.25]} receiveShadow>
          <boxGeometry args={[2.78, 0.04, 1.12]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.75} roughness={0.28} />
        </mesh>
        {[
          [4.28, -2.8],
          [6.92, -2.8],
          [4.28, -1.7],
          [6.92, -1.7],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.45, lz]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.9, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.78} roughness={0.26} />
          </mesh>
        ))}
      </group>

      {/* ==================== 6. INDUSTRIAL CONVECTION OVEN WITH TURBINES & ARTICULATED DOOR (9.5, -2.4) ==================== */}
      <group onClick={handlePick('oven')}>
        <HighlightRing
          position={[9.5, 0, -2.4]}
          radius={1.78}
          active={activeMachineId === 'oven'}
          selected={selectedMachineId === 'oven'}
        />
        {/* Back wall */}
        <mesh position={[9.5, 1.36, -3.15]} castShadow receiveShadow>
          <boxGeometry args={[2.28, 2.72, 0.16]} />
          <meshStandardMaterial color="#475569" metalness={0.84} roughness={0.26} />
        </mesh>
        {/* Glowing Thermal Convection Rear Wall */}
        <mesh position={[9.35, 1.36, -3.04]}>
          <planeGeometry args={[1.56, 1.54]} />
          <meshStandardMaterial
            color="#7C2D12"
            emissive="#EA580C"
            emissiveIntensity={activePhaseId === 13 ? 1.55 : 0.45}
            roughness={0.4}
          />
        </mesh>

        {/* Dual Rotating Rear Convection Fan Turbines & Heating Coils inside Chamber */}
        {[1.12, 1.62].map((fy, idx) => (
          <group
            key={`ofan-${idx}`}
            ref={idx === 0 ? ovenFan1Ref : ovenFan2Ref}
            position={[9.35, fy, -3.01]}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.21, 0.015, 8, 24]} />
              <meshStandardMaterial
                color="#F97316"
                emissive="#EA580C"
                emissiveIntensity={activePhaseId === 13 ? 1.2 : 0.3}
              />
            </mesh>
            {[0, 1, 2, 3].map((b) => (
              <mesh key={b} rotation={[0, 0, (b * Math.PI) / 4]}>
                <boxGeometry args={[0.36, 0.045, 0.01]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Left Insulated Wall & Right Control Column */}
        <mesh position={[8.46, 1.36, -2.35]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 2.72, 1.65]} />
          <meshStandardMaterial color="#64748B" bumpMap={metalTex} bumpScale={0.003} metalness={0.84} roughness={0.26} />
        </mesh>
        <mesh position={[10.32, 1.36, -2.35]} castShadow receiveShadow>
          <boxGeometry args={[0.64, 2.72, 1.65]} />
          <meshStandardMaterial color="#475569" bumpMap={metalTex} bumpScale={0.003} metalness={0.84} roughness={0.26} />
        </mesh>
        {/* Bottom oven base & Top oven crown */}
        <mesh position={[9.35, 0.32, -2.35]} receiveShadow>
          <boxGeometry args={[1.65, 0.64, 1.65]} />
          <meshStandardMaterial color="#64748B" metalness={0.84} roughness={0.26} />
        </mesh>
        <mesh position={[9.35, 2.42, -2.35]} castShadow>
          <boxGeometry args={[1.65, 0.6, 1.65]} />
          <meshStandardMaterial color="#64748B" metalness={0.84} roughness={0.26} />
        </mesh>

        {/* Overhanging Exhaust Hood with Baffle Filters & Chimney Duct */}
        <mesh position={[9.5, 2.95, -2.3]} castShadow>
          <boxGeometry args={[2.44, 0.46, 2.0]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.2} />
        </mesh>
        <mesh position={[9.5, 4.1, -2.5]}>
          <cylinderGeometry args={[0.24, 0.24, 1.9, 20]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.86} roughness={0.22} />
        </mesh>

        {/* Internal Baking Racks & Side Tray Rails */}
        {[0.92, 1.78].map((ry, i) => (
          <mesh key={i} position={[9.35, ry, -2.15]}>
            <boxGeometry args={[1.45, 0.025, 0.95]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.86} roughness={0.2} />
          </mesh>
        ))}

        {/* Articulated Double-Glass Oven Door with 3 Hinges & Rotating Latch Handle */}
        <group ref={ovenDoorRef} position={[8.56, 1.36, -1.52]}>
          {[-0.55, 0, 0.55].map((hy, i) => (
            <mesh key={`ohinge-${i}`} position={[0, hy, 0.02]}>
              <cylinderGeometry args={[0.028, 0.028, 0.11, 12]} />
              <meshStandardMaterial color="#1E293B" metalness={0.85} />
            </mesh>
          ))}
          <mesh position={[0.78, 0, 0]}>
            <boxGeometry args={[1.54, 1.48, 0.03]} />
            <meshPhysicalMaterial
              color="#FDE68A"
              transparent
              opacity={0.15}
              roughness={0.05}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={ovenHandleRef} position={[1.48, 0, 0.06]}>
            <cylinderGeometry args={[0.028, 0.028, 0.92, 12]} />
            <meshStandardMaterial color="#14181F" metalness={0.78} roughness={0.24} />
          </mesh>
        </group>

        {/* Digital PID Temp & Timer Display + Rotary Knobs + Status Stack Light */}
        <mesh position={[10.32, 2.15, -1.51]}>
          <planeGeometry args={[0.58, 0.32]} />
          <meshBasicMaterial map={ovenDisplayTex} />
        </mesh>
        {[1.72, 1.56].map((ky, i) => (
          <mesh key={`knob-${i}`} position={[10.32, ky, -1.51]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 16]} />
            <meshStandardMaterial color="#14181F" metalness={0.6} />
          </mesh>
        ))}
        <mesh position={[10.45, 3.3, -1.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.24, 14]} />
          <meshStandardMaterial
            color={activePhaseId === 13 ? '#F97316' : '#10B981'}
            emissive={activePhaseId === 13 ? '#F97316' : '#10B981'}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* ==================== 7. COOLING RACK / ESCABILADERO (6.0, 2.6) ==================== */}
      <group onClick={handlePick('cooling_rack')}>
        <HighlightRing
          position={[6.0, 0, 2.6]}
          radius={1.4}
          active={activeMachineId === 'cooling_rack'}
          selected={selectedMachineId === 'cooling_rack'}
        />
        {[
          [5.32, 2.12],
          [6.68, 2.12],
          [5.32, 3.08],
          [6.68, 3.08],
        ].map(([wx, wz], i) => (
          <group key={`wheel-${i}`}>
            <mesh position={[wx, 0.07, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 14]} />
              <meshStandardMaterial color="#1E293B" roughness={0.7} />
            </mesh>
            {/* Red wheel brake pedal */}
            <mesh position={[wx + 0.04, 0.09, wz]}>
              <boxGeometry args={[0.06, 0.02, 0.04]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
            <mesh position={[wx, 1.12, wz]} castShadow>
              <boxGeometry args={[0.045, 2.05, 0.045]} />
              <meshStandardMaterial color="#64748B" metalness={0.86} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {[0.38, 0.68, 0.98, 1.28, 1.58, 1.88].map((ry, i) => (
          <mesh key={i} position={[6.0, ry, 2.6]} castShadow receiveShadow>
            <boxGeometry args={[1.34, 0.032, 0.94]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.84} roughness={0.22} />
          </mesh>
        ))}

        {/* Auxiliary Air Cooling Fan Column */}
        <group position={[7.25, 0, 2.6]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.06, 1.5, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.28} />
          </mesh>
          <mesh position={[0, 1.55, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.14, 24]} />
            <meshStandardMaterial color="#475569" metalness={0.82} roughness={0.24} />
          </mesh>
          <group ref={fanBladesRef} position={[-0.08, 1.55, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.44, 0.075, 0.02]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.92} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.44, 0.075, 0.02]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.92} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ==================== 8. INSPECTION, PACKAGING, CRATES & DISPATCH VAN (-1.0 to -8.5, 2.6) ==================== */}
      <group onClick={handlePick('packaging')}>
        <HighlightRing
          position={[-1.0, 0, 2.6]}
          radius={2.38}
          active={activeMachineId === 'packaging'}
          selected={selectedMachineId === 'packaging'}
        />
        <mesh position={[0.2, 0.9, 2.6]} castShadow receiveShadow>
          <boxGeometry args={[3.95, 0.07, 1.28]} />
          <meshStandardMaterial
            color="#CBD5E1"
            bumpMap={metalTex}
            bumpScale={0.003}
            metalness={0.84}
            roughness={0.2}
          />
        </mesh>
        {[
          [-1.6, 2.02],
          [2.0, 2.02],
          [-1.6, 3.18],
          [2.0, 3.18],
        ].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.45, lz]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.78} roughness={0.26} />
          </mesh>
        ))}

        {/* Overhead Quality Inspection Light Frame & Check-Weigher Scale (Phase 15) */}
        <group position={[1.35, 0.94, 2.6]}>
          <mesh position={[-0.45, 0.45, -0.45]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0.45, 0.45, -0.45]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, -0.25]}>
            <boxGeometry args={[0.96, 0.05, 0.45]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0, 0.87, -0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.86, 0.35]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#E0F2FE" emissiveIntensity={1.25} />
          </mesh>
        </group>

        {/* Articulated Impulse Heat Sealer, Film Roll & Automatic Label Applicator (Phase 16) */}
        <group position={[-0.95, 0.94, 2.16]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.68, 0.1, 0.34]} />
            <meshStandardMaterial color="#14181F" roughness={0.32} />
          </mesh>
          {/* Articulating Thermal Sealing Jaw */}
          <group ref={sealerArmRef} position={[0, 0.16, -0.12]} rotation={[0.25, 0, 0]}>
            <mesh position={[0, 0.06, 0.18]} castShadow>
              <boxGeometry args={[0.6, 0.04, 0.34]} />
              <meshStandardMaterial color="#334155" metalness={0.75} roughness={0.28} />
            </mesh>
          </group>
          <mesh position={[0, 0.105, 0.15]}>
            <boxGeometry args={[0.56, 0.02, 0.05]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#DC2626"
              emissiveIntensity={activePhaseId === 16 ? 1.6 : 0.25}
            />
          </mesh>
          {/* Automatic Label Applicator Column & Descending Stamp Head */}
          <mesh position={[0, 0.28, -0.14]} castShadow>
            <boxGeometry args={[0.14, 0.44, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh ref={labelerHeadRef} position={[0, 0.36, 0.04]} castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.14, 16]} />
            <meshStandardMaterial color="#1B4332" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Tubular Film Roll Dispenser */}
          <mesh position={[-0.52, 0.18, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.38, 20]} />
            <meshPhysicalMaterial color="#E0F2FE" transparent opacity={0.65} roughness={0.12} />
          </mesh>
        </group>

        {/* PEPS Ventilated Plastic Bread Crates (-4.5, 2.6) */}
        <group position={[-4.5, 0, 2.6]}>
          <mesh position={[0, 0.06, 0]} receiveShadow>
            <boxGeometry args={[1.65, 0.12, 1.2]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {[0.28, 0.64, 1.0].map((cy, i) => (
            <RoundedBox
              key={i}
              args={[1.42, 0.33, 1.02]}
              radius={0.03}
              smoothness={2}
              position={[0, cy, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={i === 2 ? '#1D4ED8' : '#2563EB'} roughness={0.38} />
            </RoundedBox>
          ))}
        </group>

        {/* Clean Delivery Van with Articulating Rear Cargo Doors (-8.5, 2.6) */}
        <group position={[-8.5, 0, 2.6]}>
          {/* Cargo Box */}
          <RoundedBox
            args={[2.35, 1.55, 1.56]}
            radius={0.05}
            smoothness={3}
            position={[0.42, 1.08, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#F8FAFC" roughness={0.28} />
          </RoundedBox>
          {/* Articulating Left & Right Rear Cargo Doors */}
          <group ref={vanDoorLRef} position={[1.6, 1.08, -0.74]}>
            <mesh position={[0, 0, 0.36]} castShadow>
              <boxGeometry args={[0.04, 1.42, 0.72]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.3} roughness={0.3} />
            </mesh>
          </group>
          <group ref={vanDoorRRef} position={[1.6, 1.08, 0.74]}>
            <mesh position={[0, 0, -0.36]} castShadow>
              <boxGeometry args={[0.04, 1.42, 0.72]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.3} roughness={0.3} />
            </mesh>
          </group>

          {/* Brand Stripe on Van */}
          <mesh position={[0.42, 1.12, 0.79]}>
            <planeGeometry args={[2.1, 0.28]} />
            <meshStandardMaterial color="#1B4332" roughness={0.4} />
          </mesh>
          {/* Driver Cab */}
          <RoundedBox
            args={[0.95, 1.16, 1.46]}
            radius={0.06}
            smoothness={3}
            position={[-1.18, 0.88, 0]}
            castShadow
          >
            <meshStandardMaterial color="#C87D20" roughness={0.3} />
          </RoundedBox>
          <mesh position={[-1.66, 1.02, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.25, 0.52]} />
            <meshStandardMaterial color="#0F172A" metalness={0.82} roughness={0.14} />
          </mesh>
          {[-0.5, 0.5].map((hz, i) => (
            <mesh key={i} position={[-1.66, 0.55, hz]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.85} />
            </mesh>
          ))}
          {[
            [-1.1, -0.74],
            [-1.1, 0.74],
            [1.0, -0.74],
            [1.0, 0.74],
          ].map(([wx, wz], i) => (
            <group key={i} position={[wx, 0.29, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.29, 0.29, 0.18, 22]} />
                <meshStandardMaterial color="#14181F" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.19, 16]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.82} roughness={0.22} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};
