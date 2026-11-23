import React from 'react';
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
  if (!showHotspots) return null;

  const machineIdToShow = selectedMachineId || activeMachineId;
  const machine = MACHINES_INFO[machineIdToShow];
  if (!machine) return null;

  return (
    <group>
      {machine.hotspots.map((hs, idx) => {
        const isOpen = activeHotspotId === hs.id;
        const badgeWidth = Math.max(0.66, hs.label.length * 0.044 + 0.22);
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
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshBasicMaterial color={isOpen ? '#F4D06F' : '#C87D20'} />
              </mesh>

              {/* Pill background */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[badgeWidth, 0.155]} />
                <meshBasicMaterial
                  color={isOpen ? '#C87D20' : '#14181F'}
                  transparent
                  opacity={0.92}
                />
              </mesh>
              {/* Pill border */}
              <mesh position={[0, 0, -0.002]}>
                <planeGeometry args={[badgeWidth + 0.02, 0.175]} />
                <meshBasicMaterial color={isOpen ? '#F4D06F' : '#C87D20'} />
              </mesh>

              {/* Hotspot Label Text */}
              <Text
                position={[0, 0, 0.01]}
                fontSize={0.062}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
              >
                {`${idx + 1}. ${hs.label}`}
              </Text>
            </group>
          </Billboard>
        );
      })}
    </group>
  );
};
