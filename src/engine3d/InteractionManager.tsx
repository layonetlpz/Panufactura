import React from 'react';
import { useThree } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { HotspotInfo, MACHINES_INFO } from './simulationConfig';

interface Props {
  activeMachineId: string;
  selectedMachineId: string | null;
  showHotspots: boolean;
  activeHotspotId: string | null;
  onSelectHotspot: (hs: HotspotInfo | null) => void;
}

export const InteractionManager: React.FC<Props> = ({
  activeMachineId,
  selectedMachineId,
  showHotspots,
  activeHotspotId,
  onSelectHotspot,
}) => {
  const { size } = useThree();
  if (!showHotspots) return null;

  const machineIdToShow = selectedMachineId || activeMachineId;
  const machine = MACHINES_INFO[machineIdToShow];
  if (!machine) return null;

  // On compact mobile screens (< 560px canvas width), render compact numbered pins or short labels so they never overlap or block the machine
  const isCompactMobile = size.width < 560;

  return (
    <group>
      {machine.hotspots.map((hs, idx) => {
        const isOpen = activeHotspotId === hs.id;
        const displayLabel = isCompactMobile
          ? `${idx + 1}`
          : `${idx + 1}. ${hs.label}`;
        const badgeWidth = isCompactMobile
          ? 0.22
          : Math.max(0.64, hs.label.length * 0.042 + 0.22);
        const badgeHeight = isCompactMobile ? 0.18 : 0.155;

        return (
          <Billboard
            key={hs.id}
            position={[hs.position[0], hs.position[1] + 0.11, hs.position[2]]}
            follow={true}
          >
            <group
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(isOpen ? null : hs);
              }}
            >
              {/* Connecting pin stem */}
              <mesh position={[0, -0.085, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.13, 8]} />
                <meshBasicMaterial color={isOpen ? '#F4D06F' : '#C87D20'} />
              </mesh>
              <mesh position={[0, -0.15, 0]}>
                <sphereGeometry args={[0.022, 12, 12]} />
                <meshBasicMaterial color={isOpen ? '#F4D06F' : '#C87D20'} />
              </mesh>

              {/* Pill background */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[badgeWidth, badgeHeight]} />
                <meshBasicMaterial
                  color={isOpen ? '#C87D20' : '#14181F'}
                  transparent
                  opacity={0.92}
                />
              </mesh>
              {/* Pill border */}
              <mesh position={[0, 0, -0.002]}>
                <planeGeometry args={[badgeWidth + 0.022, badgeHeight + 0.022]} />
                <meshBasicMaterial color={isOpen ? '#F4D06F' : '#C87D20'} />
              </mesh>

              {/* Hotspot Label Text */}
              <Text
                position={[0, 0, 0.01]}
                fontSize={isCompactMobile ? 0.075 : 0.06}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
              >
                {displayLabel}
              </Text>
            </group>
          </Billboard>
        );
      })}
    </group>
  );
};
