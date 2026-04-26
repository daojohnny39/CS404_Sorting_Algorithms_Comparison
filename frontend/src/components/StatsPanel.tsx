import type { AlgorithmMeta, SortStep } from '../types';

interface Props {
  step: SortStep | null;
  totalSteps: number;
  currentStep: number;
  algorithm: AlgorithmMeta | null;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#555555] uppercase tracking-wide">{label}</span>
      <span className="text-xl font-mono font-bold text-black tabular-nums">{value}</span>
    </div>
  );
}


export default function StatsPanel({ step, totalSteps, currentStep, algorithm }: Props) {
  return (
    <div className="bg-[#F5F5F5] border-2 border-black p-4 space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Comparisons" value={step?.comparisons ?? 0} />
        <Stat label="Swaps" value={step?.swaps ?? 0} />
        <Stat label="Space" value={algorithm?.space_complexity ?? '—'} />
        <Stat
          label="Step"
          value={totalSteps > 0 ? `${currentStep + 1} / ${totalSteps}` : '—'}
        />
      </div>
    </div>
  );
}
