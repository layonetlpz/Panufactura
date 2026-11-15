import React from 'react';
import { QualityLevel } from './simulationConfig';

interface Props {
  quality: QualityLevel;
  ovenActive: boolean;
}

export const BakeryLighting: React.FC<Props> = ({ quality, ovenActive }) => {
  const shadowSize = quality === 'high' ? 2048 : 1024;
  const castShadows = quality !== 'low';

  return (
    <>
      <ambientLight intensity={0.55} color="#FFF8EE" />
      <hemisphereLight args={['#FFFDF7', '#CBD5E1', 0.65]} />

      {/* Main skylight / industrial directional light */}
      <directionalLight
        position={[10, 16, 10]}
        intensity={1.35}
        color="#FFFDF5"
        castShadow={castShadows}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.0005}
      />

      {/* Soft fill light from front-left */}
      <directionalLight position={[-10, 8, 8]} intensity={0.45} color="#E0F2FE" />

      {/* Warm interior oven glow when baking */}
      <pointLight
        position={[9.5, 1.4, -2.0]}
        intensity={ovenActive ? 4.5 : 0.6}
        distance={6}
        color="#FF7B00"
      />
    </>
  );
};
