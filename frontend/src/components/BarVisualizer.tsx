import type { SortStep } from '../types';

interface Props {
  array: number[];
  step: SortStep | null;
  className?: string;
}

function barColor(index: number, step: SortStep | null): string {
  if (!step) return '#C0C0C0';
  if (step.operation === 'complete') return '#D9D9D9';
  if (step.comparing.includes(index)) return '#000000';
  if (step.overwriting.includes(index)) return '#333333';
  if (step.swapping.includes(index)) return '#666666';
  if (step.sorted.includes(index)) {
    return step.operation ? '#A6A6A6' : '#D9D9D9';
  }
  if (step.left_range && step.left_range.length === 2) {
    const [ll, lr] = step.left_range;
    if (index >= ll && index <= lr) return '#BDBDBD';
  }
  if (step.right_range && step.right_range.length === 2) {
    const [rl, rr] = step.right_range;
    if (index >= rl && index <= rr) return '#E0E0E0';
  }
  return '#C0C0C0';
}

export default function BarVisualizer({ array, step, className }: Props) {
  const max = Math.max(...array, 1);

  return (
    <div className={`relative bg-[#F5F5F5] border-2 border-black p-4 ${className ?? 'h-72'}`}>
      {array.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-[#777777] text-sm">
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
              className="flex-1 min-w-0"
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
