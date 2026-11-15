import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PhaseIllustration } from '../components/PhaseIllustration';

interface Props {
  visualKey: string;
  phaseId: number;
  caption: string;
}

export const GraphicsFallback: React.FC<Props> = ({ visualKey, phaseId, caption }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 bg-[#FAF6F0] rounded-xl border border-[#E7DFD3] space-y-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>Modo 3D WebGL no disponible en este dispositivo; mostrando vista técnica 2D alternativa.</span>
      </div>
      <div className="w-full max-w-md">
        <PhaseIllustration visualKey={visualKey} phaseId={phaseId} />
      </div>
      <p className="text-xs text-[#6B5E53] text-center max-w-md">{caption}</p>
    </div>
  );
};
