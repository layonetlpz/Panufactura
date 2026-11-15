import React, { useEffect, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { createFloorTexture } from './materials';

export const BakeryEnvironment: React.FC = () => {
  const floorTex = useMemo(() => createFloorTexture(), []);

  useEffect(() => {
    return () => {
      floorTex.dispose();
    };
  }, [floorTex]);

  return (
    <group>
      {/* Industrial floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 16]} />
        <meshStandardMaterial map={floorTex} roughness={0.78} metalness={0.05} />
      </mesh>

      {/* Safety zone floor stripes (Yellow industrial demarcation) */}
      {/* Back production line zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -2.5]}>
        <planeGeometry args={[24.5, 4.2]} />
        <meshStandardMaterial color="#D6D3CD" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, -0.4]}>
        <planeGeometry args={[24.5, 0.08]} />
        <meshStandardMaterial color="#EAB308" roughness={0.6} />
      </mesh>

      {/* Front cooling/packaging/dispatch zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.004, 2.6]}>
        <planeGeometry args={[22.0, 4.0]} />
        <meshStandardMaterial color="#E0E7EF" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.0, 0.006, 0.6]}>
        <planeGeometry args={[22.0, 0.08]} />
        <meshStandardMaterial color="#0EA5E9" roughness={0.6} />
      </mesh>

      {/* Back hygienic tiled wall */}
      <mesh position={[0, 2.7, -5.2]} receiveShadow>
        <boxGeometry args={[28, 5.4, 0.25]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Lower stainless/ceramic wainscoting */}
      <mesh position={[0, 0.85, -5.05]} receiveShadow>
        <boxGeometry args={[28, 1.7, 0.05]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.35} metalness={0.25} />
      </mesh>

      {/* Left & right side walls (low profile so camera stays unobstructed) */}
      <mesh position={[-13.9, 2.7, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5.4, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.65} />
      </mesh>
      <mesh position={[13.9, 2.7, 0]} receiveShadow>
        <boxGeometry args={[0.2, 5.4, 16]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.65} />
      </mesh>

      {/* Industrial windows on back wall */}
      {[-8, -2, 4, 10].map((wx, i) => (
        <group key={i} position={[wx, 3.4, -5.04]}>
          <mesh>
            <boxGeometry args={[3.2, 1.5, 0.08]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[2.95, 1.25]} />
            <meshStandardMaterial color="#BAE6FD" emissive="#E0F2FE" emissiveIntensity={0.35} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Overhead steel beam & industrial lamps */}
      <mesh position={[0, 4.9, -2.5]}>
        <boxGeometry args={[26, 0.18, 0.22]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-9, -3, 3, 9].map((lx, i) => (
        <group key={i} position={[lx, 4.75, -2.5]}>
          <mesh>
            <boxGeometry args={[1.6, 0.1, 0.35]} />
            <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <planeGeometry args={[1.45, 0.25]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFBEB" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* Zone Signage on back wall */}
      <Text position={[-9.0, 2.25, -4.98]} fontSize={0.26} color="#1E293B" anchorX="center" fontWeight="bold">
        ZONA SUCIA: RECEPCIÓN Y ALMACÉN
      </Text>
      <Text position={[-1.5, 2.25, -4.98]} fontSize={0.26} color="#B45309" anchorX="center" fontWeight="bold">
        ZONA DE PROCESO: MASAS Y FERMENTACIÓN
      </Text>
      <Text position={[8.0, 2.25, -4.98]} fontSize={0.26} color="#991B1B" anchorX="center" fontWeight="bold">
        ZONA TÉRMICA: FORMADO Y HORNEADO
      </Text>
      <Text position={[0.0, 0.02, 5.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.28} color="#0369A1" anchorX="center" fontWeight="bold">
        ZONA LIMPIA: ENFRIAMIENTO · INSPECCIÓN · EMPAQUE · DESPACHO
      </Text>
    </group>
  );
};
