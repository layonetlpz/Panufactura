import React, { useEffect, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { createFloorTexture, createWallTileTexture } from './materials';

export const BakeryEnvironment: React.FC = () => {
  const floorTex = useMemo(() => createFloorTexture(), []);
  const tileTex = useMemo(() => createWallTileTexture(), []);

  useEffect(() => {
    return () => {
      floorTex.dispose();
      tileTex.dispose();
    };
  }, [floorTex, tileTex]);

  return (
    <group>
      {/* Main industrial epoxy floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 17]} />
        <meshStandardMaterial map={floorTex} roughness={0.72} metalness={0.06} />
      </mesh>

      {/* Perimeter floor curbing (media caña sanitaria) */}
      <mesh position={[0, 0.08, -5.06]} receiveShadow>
        <boxGeometry args={[28, 0.16, 0.12]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Back production line zone mat (Phases 1 to 13) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -2.5]} receiveShadow>
        <planeGeometry args={[25.2, 4.3]} />
        <meshStandardMaterial color="#D9D3C7" roughness={0.82} />
      </mesh>
      {/* Safety yellow hazard border line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, -0.35]}>
        <planeGeometry args={[25.2, 0.09]} />
        <meshStandardMaterial color="#D97706" roughness={0.5} />
      </mesh>

      {/* Stainless floor drainage grate in front of wet/thermal equipment */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.0, 0.006, -0.85]}>
        <planeGeometry args={[14.0, 0.22]} />
        <meshStandardMaterial color="#64748B" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Front clean zone: Cooling, Inspection, Packaging, Dispatch (Phases 14 to 18) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.004, 2.6]} receiveShadow>
        <planeGeometry args={[22.5, 4.1]} />
        <meshStandardMaterial color="#DCE5EC" roughness={0.76} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.007, 0.55]}>
        <planeGeometry args={[22.5, 0.09]} />
        <meshStandardMaterial color="#1B4332" roughness={0.5} />
      </mesh>

      {/* U-Shaped Process Flow Arrows on the central corridor */}
      {[-9.0, -5.0, -1.0, 3.0, 7.0].map((ax, idx) => (
        <group key={`arrow-back-${idx}`} position={[ax, 0.008, -0.1]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 0.12]} />
            <meshBasicMaterial color="#C87D20" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
      {[-6.5, -2.5, 1.5, 5.0].map((ax, idx) => (
        <group key={`arrow-front-${idx}`} position={[ax, 0.008, 0.3]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 0.12]} />
            <meshBasicMaterial color="#1B4332" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}

      {/* Back main wall */}
      <mesh position={[0, 2.8, -5.2]} receiveShadow>
        <boxGeometry args={[30, 5.6, 0.25]} />
        <meshStandardMaterial color="#F4F1EA" roughness={0.55} metalness={0.04} />
      </mesh>

      {/* Hygienic ceramic tile wainscoting on lower back wall */}
      <mesh position={[0, 1.05, -5.05]} receiveShadow>
        <boxGeometry args={[29.6, 2.1, 0.05]} />
        <meshStandardMaterial map={tileTex} roughness={0.28} metalness={0.12} />
      </mesh>
      {/* Stainless steel wainscot trim rail */}
      <mesh position={[0, 2.12, -5.03]}>
        <boxGeometry args={[29.6, 0.07, 0.07]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Structural steel I-beam columns along back wall */}
      {[-13.5, -6.5, 1.8, 7.8, 13.5].map((cx, i) => (
        <group key={`col-${i}`} position={[cx, 2.8, -4.98]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.24, 5.6, 0.26]} />
            <meshStandardMaterial color="#1E242E" metalness={0.65} roughness={0.38} />
          </mesh>
          {/* Yellow/black safety base bumper */}
          <mesh position={[0, -2.3, 0.02]}>
            <boxGeometry args={[0.28, 0.9, 0.3]} />
            <meshStandardMaterial color="#D97706" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Left & right side walls */}
      <mesh position={[-14.9, 2.8, 0]} receiveShadow>
        <boxGeometry args={[0.22, 5.6, 17]} />
        <meshStandardMaterial color="#EAE5DC" roughness={0.65} />
      </mesh>
      <mesh position={[14.9, 2.8, 0]} receiveShadow>
        <boxGeometry args={[0.22, 5.6, 17]} />
        <meshStandardMaterial color="#EAE5DC" roughness={0.65} />
      </mesh>

      {/* Industrial clerestory windows on back wall with mullions */}
      {[-10.0, -2.5, 4.8, 10.6].map((wx, i) => (
        <group key={`win-${i}`} position={[wx, 3.7, -5.04]}>
          <mesh>
            <boxGeometry args={[3.6, 1.45, 0.08]} />
            <meshStandardMaterial color="#1E242E" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[3.36, 1.22]} />
            <meshStandardMaterial color="#E0F2FE" emissive="#BAE6FD" emissiveIntensity={0.42} roughness={0.08} />
          </mesh>
          {/* Window vertical mullions */}
          {[-1.1, 0, 1.1].map((mx, mi) => (
            <mesh key={mi} position={[mx, 0, 0.04]}>
              <boxGeometry args={[0.05, 1.25, 0.04]} />
              <meshStandardMaterial color="#1E242E" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Overhead stainless HVAC ventilation ducting */}
      <group position={[0, 5.05, -3.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 25, 20]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.25} />
        </mesh>
        {[-8, -3, 2, 7].map((dx, i) => (
          <mesh key={i} position={[dx, -0.26, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.35]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Overhead steel lighting truss & LED high-bay luminaires */}
      <mesh position={[0, 5.1, -2.2]}>
        <boxGeometry args={[27, 0.16, 0.2]} />
        <meshStandardMaterial color="#1E242E" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-9.5, -3.5, 2.5, 8.5].map((lx, i) => (
        <group key={`lamp-${i}`} position={[lx, 4.92, -2.2]}>
          <mesh>
            <boxGeometry args={[1.8, 0.12, 0.42]} />
            <meshStandardMaterial color="#14181F" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.65, 0.32]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFBEB" emissiveIntensity={1.35} />
          </mesh>
        </group>
      ))}

      {/* Wall Safety & BPM Hygiene Station between Reception and Prep (-5.2, -5.0) */}
      <group position={[-5.2, 1.3, -4.98]}>
        {/* BPM Notice Board */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.95, 0.65, 0.04]} />
          <meshStandardMaterial color="#1B4332" roughness={0.4} />
        </mesh>
        {/* Red Fire Extinguisher */}
        <mesh position={[0.72, -0.1, 0.08]}>
          <cylinderGeometry args={[0.08, 0.08, 0.42, 14]} />
          <meshStandardMaterial color="#DC2626" metalness={0.4} roughness={0.3} />
        </mesh>
      </group>

      {/* Architectural Zone Header Plaques on Back Wall */}
      <group position={[-10.0, 2.52, -5.0]}>
        <mesh>
          <boxGeometry args={[5.4, 0.42, 0.04]} />
          <meshStandardMaterial color="#14181F" roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.19} color="#F3EFE6" anchorX="center" anchorY="middle" fontWeight="bold">
          01 · RECEPCIÓN Y ALMACÉN MP (PEPS)
        </Text>
      </group>

      <group position={[-2.2, 2.52, -5.0]}>
        <mesh>
          <boxGeometry args={[6.4, 0.42, 0.04]} />
          <meshStandardMaterial color="#14181F" roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.19} color="#E5A93C" anchorX="center" anchorY="middle" fontWeight="bold">
          02 · PESAJE, MEZCLADO, AMASADO Y FERMENTACIÓN
        </Text>
      </group>

      <group position={[7.4, 2.52, -5.0]}>
        <mesh>
          <boxGeometry args={[7.2, 0.42, 0.04]} />
          <meshStandardMaterial color="#14181F" roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.19} color="#FB923C" anchorX="center" anchorY="middle" fontWeight="bold">
          03 · DIVISIÓN, FORMADO Y HORNEADO (180–200 °C)
        </Text>
      </group>

      <Text
        position={[-1.0, 0.02, 5.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.25}
        color="#1B4332"
        anchorX="center"
        fontWeight="bold"
      >
        04 · ZONA LIMPIA: ENFRIAMIENTO (&lt;35 °C) · INSPECCIÓN · EMPAQUE · DISTRIBUCIÓN
      </Text>
    </group>
  );
};
