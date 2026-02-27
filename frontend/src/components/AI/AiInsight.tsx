
import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface AiInsightProps {
  insight: string | null;
  onClose: () => void;
}

export const AiInsight: React.FC<AiInsightProps> = ({ insight, onClose }) => {
  if (!insight) return null;

  return (
    <div className="mb-8 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex gap-4 animate-in fade-in slide-in-from-top-4">
      <div className="bg-indigo-600 text-white p-2 rounded-lg h-fit">
        <BrainCircuit size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-indigo-900 mb-1">Análise da IA</h3>
        <p className="text-indigo-800 text-sm leading-relaxed">{insight}</p>
        <button onClick={onClose} className="text-xs text-indigo-400 mt-2 hover:underline font-semibold">
          Fechar análise
        </button>
      </div>
    </div>
  );
};
