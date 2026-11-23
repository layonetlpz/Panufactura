import React from 'react';
import { ContactShadows } from '@react-three/drei';
import { QualityLevel } from './simulationConfig';

interface Props {
  quality: QualityLevel;
  ovenActive: boolean;
  prooferActive?: boolean;
}

export const BakeryLighting: React.FC<Props> = ({
  quality,
  ovenActive,
  prooferActive = false,
}) => {
  const shadowSize = quality === 'ultra' || quality === 'high' ? 2048 : 1024;
  const castShadows = quality !== 'low';

  return (
    <>
      <ambientLight intensity={0.56} color="#FFF9F0" />
      <hemisphereLight args={['#FFFDF9', '#C8C2B8', 0.66]} />

      {/* Main industrial skylight directional light */}
      <directionalLight
        position={[11, 17, 11]}
        intensity={1.45}
        color="#FFFDF6"
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={42}
        shadow-bias={-0.0004}
      />

      {/* Cool fill light from front-left */}
      <directionalLight position={[-12, 9, 10]} intensity={0.48} color="#E0F2FE" />

      {/* Warm bounce from back-right */}
      <directionalLight position={[8, 6, -8]} intensity={0.28} color="#FDE68A" />

      {/* Accent light over mixer & shaping line */}
      {quality === 'ultra' && (
        <pointLight position={[-3.5, 2.4, -1.8]} intensity={0.9} distance={5} color="#FFFBEB" />
      )}

      {/* Proofer warm humid glow */}
      <pointLight
        position={[0.5, 1.35, -2.1]}
        intensity={prooferActive ? 2.6 : 0.55}
        distance={4.5}
        color="#F59E0B"
      />

      {/* Warm interior oven glow when baking */}
      <pointLight
        position={[9.35, 1.38, -1.9]}
        intensity={ovenActive ? 5.2 : 0.85}
        distance={6.5}
        color="#FF6B00"
      />

      {/* Soft ground contact occlusion in Ultra & High modes (frames=1 avoids per-frame shadow re-render overhead) */}
      {(quality === 'ultra' || quality === 'high') && (
        <ContactShadows
          position={[0, 0.01, 0]}
          frames={1}
          opacity={0.32}
          scale={28}
          blur={1.8}
          far={3.5}
          resolution={quality === 'ultra' ? 512 : 256}
          color="#1E242E"
        />
      )}
    </>
  );
};
