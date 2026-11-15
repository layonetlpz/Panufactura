import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createDigitalDisplayTexture, createSackTexture } from '../materials';
import { SimulationVariables } from '../simulationConfig';

interface Props {
  activeMachineId: string;
  activePhaseId: number;
  selectedMachineId: string | null;
  onSelectMachine: (id: string) => void;
  isPlaying: boolean;
  speed: number;
  simVars: SimulationVariables;
}

const HighlightRing: React.FC<{ position: [number, number, number]; radius: number; active: boolean; selected: boolean }> = ({
  position,
  radius,
  active,
  selected,
}) => {
  if (!active && !selected) return null;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.015, position[2]]}>
      <ringGeometry args={[radius, radius + 0.14, 48]} />
      <meshBasicMaterial color={selected ? '#0EA5E9' : '#D97706'} transparent opacity={0.85} />
    </mesh>
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
}) => {
  const hookRef = useRef<THREE.Group>(null);
  const bowlRef = useRef<THREE.Mesh>(null);
  const ovenDoorRef = useRef<THREE.Group>(null);

  const sackTex = useMemo(() => createSackTexture('HARINA'), []);
  const prooferDisplayTex = useMemo(
    () => createDigitalDisplayTexture(`${simVars.fermTemp}°C`, `${simVars.fermHumidity}% HR`, '#38BDF8'),
    [simVars.fermTemp, simVars.fermHumidity]
  );
  const ovenDisplayTex = useMemo(
    () => createDigitalDisplayTexture(`${simVars.bakeTemp}°C`, `${simVars.bakeTime} MIN`, '#FB923C'),
    [simVars.bakeTemp, simVars.bakeTime]
  );

  useEffect(() => () => sackTex.dispose(), [sackTex]);
  useEffect(() => () => prooferDisplayTex.dispose(), [prooferDisplayTex]);
  useEffect(() => () => ovenDisplayTex.dispose(), [ovenDisplayTex]);

  useFrame((_, delta) => {
    const dt = delta * speed;
    // Animate spiral mixer in Phases 4 and 5
    const mixerRunning = activePhaseId === 4 || activePhaseId === 5;
    if (mixerRunning && hookRef.current && bowlRef.current) {
      const rate = activePhaseId === 5 ? 5.2 : 2.2;
      const mult = isPlaying ? 1 : 0.35; // gentle idle preview when paused on active phase
      hookRef.current.rotation.y += dt * rate * mult;
      bowlRef.current.rotation.y -= dt * (rate * 0.4) * mult;
    }

    // Subtle oven door slightly ajar in phase 12/14, closed in 13
    if (ovenDoorRef.current) {
      const targetAngle = activePhaseId === 13 ? 0 : activePhaseId === 14 ? -0.35 : 0;
      ovenDoorRef.current.rotation.y = THREE.MathUtils.lerp(ovenDoorRef.current.rotation.y, targetAngle, 0.08);
    }
  });

  const handlePick = (id: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelectMachine(id);
  };

  return (
    <group>
      {/* ==================== 1. RECEPTION & STORAGE (-10.5, -2.5) ==================== */}
      <group onClick={handlePick('reception')}>
        <HighlightRing position={[-10.5, 0, -2.5]} radius={1.9} active={activeMachineId === 'reception'} selected={selectedMachineId === 'reception'} />
        {/* Wooden pallet */}
        <mesh position={[-11.2, 0.08, -2.2]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.16, 1.5]} />
          <meshStandardMaterial color="#926239" roughness={0.85} />
        </mesh>
        {/* Flour sacks stacked */}
        {[
          [-11.55, 0.32, -2.4], [-10.85, 0.32, -2.4],
          [-11.55, 0.32, -1.95], [-10.85, 0.32, -1.95],
          [-11.2, 0.62, -2.2],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.28, 0.42]} />
            <meshStandardMaterial map={sackTex} roughness={0.9} />
          </mesh>
        ))}

        {/* PEPS Shelving Unit */}
        <group position={[-9.5, 0, -3.2]}>
          {[[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].map(([px, pz], i) => (
            <mesh key={i} position={[px, 1.0, pz]} castShadow>
              <boxGeometry args={[0.06, 2.0, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          {[0.3, 1.0, 1.7].map((sy, i) => (
            <mesh key={i} position={[0, sy, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.5, 0.05, 0.8]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
          {/* Sealed ingredient bins */}
          <mesh position={[-0.35, 0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 0.35, 0.5]} />
            <meshStandardMaterial color="#DBEAFE" roughness={0.3} />
          </mesh>
          <mesh position={[0.35, 0.5, 0]} castShadow>
            <boxGeometry args={[0.5, 0.35, 0.5]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.8, 0.35, 0.5]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ==================== 2. SCALE & DOSING TABLE (-7.0, -2.5) ==================== */}
      <group onClick={handlePick('scale_table')}>
        <HighlightRing position={[-7.0, 0, -2.5]} radius={1.35} active={activeMachineId === 'scale_table'} selected={selectedMachineId === 'scale_table'} />
        {/* Stainless table */}
        <mesh position={[-7.0, 0.9, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.08, 1.1]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.25} />
        </mesh>
        {[[-7.9, -2.95], [-6.1, -2.95], [-7.9, -2.05], [-6.1, -2.05]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.45, lz]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {/* Digital Scale */}
        <mesh position={[-7.0, 0.99, -2.4]} castShadow>
          <boxGeometry args={[0.55, 0.09, 0.5]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-7.0, 1.05, -2.4]}>
          <boxGeometry args={[0.45, 0.03, 0.4]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Small precision cups */}
        <mesh position={[-6.35, 1.02, -2.4]} castShadow>
          <cylinderGeometry args={[0.09, 0.07, 0.16, 16]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.35} />
        </mesh>
        <mesh position={[-6.12, 1.02, -2.4]} castShadow>
          <cylinderGeometry args={[0.09, 0.07, 0.16, 16]} />
          <meshStandardMaterial color="#BAE6FD" roughness={0.35} />
        </mesh>
      </group>

      {/* ==================== 3. SPIRAL MIXER & KNEADER (-3.5, -2.5) ==================== */}
      <group onClick={handlePick('mixer')}>
        <HighlightRing position={[-3.5, 0, -2.5]} radius={1.45} active={activeMachineId === 'mixer'} selected={selectedMachineId === 'mixer'} />
        {/* Heavy cast base */}
        <mesh position={[-3.5, 0.2, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.4, 1.7]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.4} roughness={0.35} />
        </mesh>
        {/* Rear column & top head */}
        <mesh position={[-3.5, 0.95, -3.05]} castShadow>
          <boxGeometry args={[0.9, 1.3, 0.65]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.45} roughness={0.35} />
        </mesh>
        <mesh position={[-3.5, 1.55, -2.5]} castShadow>
          <boxGeometry args={[0.85, 0.35, 1.35]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.35} roughness={0.3} />
        </mesh>
        {/* Control Panel with buttons */}
        <mesh position={[-2.95, 1.55, -2.4]}>
          <boxGeometry args={[0.18, 0.28, 0.45]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        <mesh position={[-2.85, 1.6, -2.3]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={activePhaseId === 4 || activePhaseId === 5 ? 1.5 : 0.2} />
        </mesh>
        <mesh position={[-2.85, 1.5, -2.3]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.4} />
        </mesh>
        {/* Rotating Stainless Bowl */}
        <mesh ref={bowlRef} position={[-3.5, 0.78, -2.35]} castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.46, 0.72, 32, 1, true]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-3.5, 0.44, -2.35]} receiveShadow>
          <cylinderGeometry args={[0.46, 0.46, 0.04, 32]} />
          <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Safety wire guard */}
        <mesh position={[-3.5, 1.16, -2.35]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.56, 0.02, 8, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Rotating Spiral Hook */}
        <group ref={hookRef} position={[-3.5, 1.35, -2.35]}>
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0.1, -0.5, 0]} rotation={[0, 0, 0.4]}>
            <torusGeometry args={[0.14, 0.035, 10, 20, Math.PI * 1.4]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ==================== 4. FERMENTATION CHAMBER (0.5, -2.6) ==================== */}
      <group onClick={handlePick('proofer')}>
        <HighlightRing position={[0.5, 0, -2.6]} radius={1.45} active={activeMachineId === 'proofer'} selected={selectedMachineId === 'proofer'} />
        {/* Cabinet body */}
        <mesh position={[0.5, 1.3, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 2.5, 1.4]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.28} />
        </mesh>
        {/* Interior warm cavity */}
        <mesh position={[0.5, 1.25, -2.45]}>
          <boxGeometry args={[1.38, 2.0, 1.18]} />
          <meshStandardMaterial color="#FEF3C7" emissive="#F59E0B" emissiveIntensity={activePhaseId === 6 || activePhaseId === 11 ? 0.25 : 0.05} roughness={0.5} />
        </mesh>
        {/* Glass door */}
        <mesh position={[0.5, 1.25, -1.88]}>
          <boxGeometry args={[1.35, 1.95, 0.05]} />
          <meshPhysicalMaterial color="#E0F2FE" transparent opacity={0.32} roughness={0.08} metalness={0.1} />
        </mesh>
        {/* Digital T/HR Display */}
        <mesh position={[0.5, 2.42, -1.89]}>
          <planeGeometry args={[0.8, 0.34]} />
          <meshBasicMaterial map={prooferDisplayTex} />
        </mesh>
      </group>

      {/* ==================== 5. DIVIDER & SHAPING TABLE (4.8, -2.3) ==================== */}
      <group onClick={handlePick('shaping_table')}>
        <HighlightRing position={[4.8, 0, -2.3]} radius={2.2} active={activeMachineId === 'shaping_table'} selected={selectedMachineId === 'shaping_table'} />
        {/* Dough Divider Unit */}
        <mesh position={[3.3, 0.75, -2.5]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 1.5, 0.9]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[3.3, 1.65, -2.5]} castShadow>
          <cylinderGeometry args={[0.38, 0.24, 0.35, 20]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Long Stainless Shaping Table */}
        <mesh position={[5.4, 0.9, -2.3]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.08, 1.25]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.78} roughness={0.22} />
        </mesh>
        {[[4.05, -2.85], [6.75, -2.85], [4.05, -1.75], [6.75, -1.75]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.45, lz]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.9, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {/* Wooden Rolling Pin & Scraper */}
        <mesh position={[5.9, 0.99, -2.0]} rotation={[0, 0.2, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
          <meshStandardMaterial color="#B45309" roughness={0.65} />
        </mesh>
      </group>

      {/* ==================== 6. INDUSTRIAL CONVECTION OVEN (9.5, -2.4) ==================== */}
      <group onClick={handlePick('oven')}>
        <HighlightRing position={[9.5, 0, -2.4]} radius={1.65} active={activeMachineId === 'oven'} selected={selectedMachineId === 'oven'} />
        {/* Main Stainless Housing */}
        <mesh position={[9.5, 1.35, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 2.7, 1.7]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Exhaust Hood */}
        <mesh position={[9.5, 2.95, -2.4]} castShadow>
          <boxGeometry args={[2.3, 0.5, 1.8]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Glowing Interior Chamber */}
        <mesh position={[9.5, 1.35, -2.15]}>
          <boxGeometry args={[1.5, 1.45, 1.1]} />
          <meshStandardMaterial
            color="#431407"
            emissive="#EA580C"
            emissiveIntensity={activePhaseId === 13 ? 1.1 : 0.2}
            roughness={0.6}
          />
        </mesh>
        {/* Oven Glass Door */}
        <group ref={ovenDoorRef} position={[8.75, 1.35, -1.53]}>
          <mesh position={[0.75, 0, 0]}>
            <boxGeometry args={[1.5, 1.45, 0.06]} />
            <meshPhysicalMaterial color="#FED7AA" transparent opacity={0.28} roughness={0.1} />
          </mesh>
          {/* Door handle */}
          <mesh position={[1.42, 0, 0.06]}>
            <cylinderGeometry args={[0.025, 0.025, 0.85, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
        {/* Digital Temp & Timer Display */}
        <mesh position={[10.2, 2.38, -1.53]}>
          <planeGeometry args={[0.7, 0.34]} />
          <meshBasicMaterial map={ovenDisplayTex} />
        </mesh>
      </group>

      {/* ==================== 7. COOLING RACK (6.0, 2.6) ==================== */}
      <group onClick={handlePick('cooling_rack')}>
        <HighlightRing position={[6.0, 0, 2.6]} radius={1.25} active={activeMachineId === 'cooling_rack'} selected={selectedMachineId === 'cooling_rack'} />
        {[[5.35, 2.15], [6.65, 2.15], [5.35, 3.05], [6.65, 3.05]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 1.05, lz]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 2.1, 10]} />
            <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        {[0.45, 0.9, 1.35, 1.8].map((ry, i) => (
          <mesh key={i} position={[6.0, ry, 2.6]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.04, 0.9]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* ==================== 8. INSPECTION, PACKAGING & DISPATCH (-1.0 to -8.5, 2.6) ==================== */}
      <group onClick={handlePick('packaging')}>
        <HighlightRing position={[-1.0, 0, 2.6]} radius={2.2} active={activeMachineId === 'packaging'} selected={selectedMachineId === 'packaging'} />
        {/* Inspection & Packaging Table */}
        <mesh position={[0.2, 0.9, 2.6]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.08, 1.25]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.75} roughness={0.25} />
        </mesh>
        {[[-1.55, 2.05], [1.95, 2.05], [-1.55, 3.15], [1.95, 3.15]].map(([lx, lz], i) => (
          <mesh key={i} position={[lx, 0.45, lz]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {/* Heat Sealer */}
        <mesh position={[-0.9, 0.99, 2.6]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.32]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        <mesh position={[-0.9, 1.06, 2.6]}>
          <boxGeometry args={[0.52, 0.03, 0.06]} />
          <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={activePhaseId === 16 ? 1.2 : 0.2} />
        </mesh>

        {/* PEPS Blue Plastic Crates (-4.5, 2.6) */}
        {[0.25, 0.65].map((cy, i) => (
          <mesh key={i} position={[-4.5, cy, 2.6]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.36, 1.0]} />
            <meshStandardMaterial color="#2563EB" roughness={0.45} />
          </mesh>
        ))}

        {/* Delivery Van / Dispatch Bay (-8.5, 2.6) */}
        <group position={[-8.5, 0, 2.6]}>
          <mesh position={[0.4, 1.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.3, 1.5, 1.5]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.35} />
          </mesh>
          <mesh position={[-1.15, 0.85, 0]} castShadow>
            <boxGeometry args={[0.9, 1.1, 1.4]} />
            <meshStandardMaterial color="#D97706" roughness={0.35} />
          </mesh>
          {[[-1.1, -0.72], [-1.1, 0.72], [1.0, -0.72], [1.0, 0.72]].map(([wx, wz], i) => (
            <mesh key={i} position={[wx, 0.28, wz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 0.16, 18]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
