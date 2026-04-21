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
      <span className="text-xs text-[#94A3B8] uppercase tracking-wide">{label}</span>
      <span className="text-xl font-mono font-medium text-[#F8FAFC] tabular-nums">{value}</span>
    </div>
  );
}

function Badge({
  label,
  value,
  variant = 'default',
}: {
  label: string;
  value: string;
  variant?: 'default' | 'purple' | 'green';
}) {
  const colors =
    variant === 'purple'
      ? 'bg-[#8B5CF6]/10 text-[#C4B5FD] border-[#8B5CF6]/20'
      : variant === 'green'
        ? 'bg-[#22C55E]/10 text-[#86EFAC] border-[#22C55E]/20'
        : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]';
  return (
    <span className={`px-2 py-0.5 rounded text-xs border font-mono ${colors}`}>
      {label}: {value}
    </span>
  );
}

export default function StatsPanel({ step, totalSteps, currentStep, algorithm }: Props) {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-[#475569] p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Comparisons" value={step?.comparisons ?? 0} />
        <Stat label="Swaps" value={step?.swaps ?? 0} />
        <Stat label="Array Accesses" value={step?.array_accesses ?? 0} />
        <Stat
          label="Step"
          value={totalSteps > 0 ? `${currentStep + 1} / ${totalSteps}` : '—'}
        />
      </div>

      {algorithm && (
        <div className="mt-4 pt-4 border-t border-[#334155] flex flex-wrap gap-2 items-center">
          <Badge label="Best" value={algorithm.time_complexity.best} />
          <Badge label="Avg" value={algorithm.time_complexity.average} />
          <Badge label="Worst" value={algorithm.time_complexity.worst} />
          <Badge label="Space" value={algorithm.space_complexity} variant="purple" />
          {algorithm.stable ? (
            <Badge label="Stable" value="yes" variant="green" />
          ) : (
            <Badge label="Stable" value="no" />
          )}
        </div>
      )}
    </div>
  );
}
