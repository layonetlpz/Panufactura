import React from 'react';
import { Html } from '@react-three/drei';
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
      {machine.hotspots.map((hs) => {
        const isOpen = activeHotspotId === hs.id;
        return (
          <Html key={hs.id} position={hs.position} center distanceFactor={10} zIndexRange={[10, 0]}>
            <div className="relative flex flex-col items-center pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isOpen ? null : hs);
                }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md border transition cursor-pointer whitespace-nowrap ${
                  isOpen
                    ? 'bg-amber-600 text-white border-amber-300 scale-105'
                    : 'bg-[#1E293B]/90 text-amber-200 border-amber-400/50 hover:bg-amber-600 hover:text-white'
                }`}
              >
                • {hs.label}
              </button>
              {isOpen && (
                <div className="mt-1.5 w-52 rounded-lg bg-[#1E293B]/95 text-white p-2.5 text-[11px] shadow-xl border border-amber-400/40">
                  <div className="font-bold text-amber-300 mb-0.5">{hs.label}</div>
                  <p className="text-slate-200 leading-snug">{hs.description}</p>
                </div>
              )}
            </div>
          </Html>
        );
      })}
    </group>
  );
};
