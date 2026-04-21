import type { SortStep } from '../types';

interface Props {
  array: number[];
  step: SortStep | null;
}

function barColor(index: number, step: SortStep | null): string {
  if (!step) return '#334155';
  if (step.swapping.includes(index)) return '#EF4444';
  if (step.comparing.includes(index)) return '#EAB308';
  if (step.overwriting.includes(index)) return '#8B5CF6';
  if (step.sorted.includes(index)) return '#22C55E';
  return '#334155';
}

export default function BarVisualizer({ array, step }: Props) {
  const max = Math.max(...array, 1);

  return (
    <div className="relative bg-[#1E293B] rounded-xl border border-[#475569] p-4 h-72">
      {array.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-[#64748B] text-sm">
          Generate an array to begin
        </div>
      ) : (
        <div
          className="flex items-end h-full w-full"
          style={{ gap: array.length > 60 ? '1px' : '2px' }}
        >
          {array.map((value, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 rounded-t-sm"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: barColor(i, step),
                transition: 'height 80ms ease-out, background-color 80ms ease-out',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
