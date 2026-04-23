import type { SortStep } from '../types';

interface Props {
  activeLine: number;
  step: SortStep | null;
}

interface CodeLine {
  lineNum: number;
  text: string;
}

const PSEUDOCODE: CodeLine[] = [
  { lineNum: 0,  text: 'function bubbleSort(arr):' },
  { lineNum: 1,  text: '  for i = 0 to n − 1:' },
  { lineNum: 2,  text: '    swapped = false' },
  { lineNum: 3,  text: '    for j = 0 to n − i − 2:' },
  { lineNum: 4,  text: '      if arr[j] > arr[j+1]: swap(arr, j, j+1)' },
  { lineNum: 5,  text: '      swapped = true' },
  { lineNum: 6,  text: '    if not swapped: break' },
];

const FUNCTION_HEADERS = new Set([0]);

const LEGEND = [
  { label: 'Comparing',     color: '#000000' },
  { label: 'Swapping',      color: '#555555' },
  { label: 'Locally sorted', color: '#A6A6A6' },
  { label: 'Complete',      color: '#D9D9D9' },
];

export default function BubblePseudocodePanel({ activeLine, step }: Props) {
  return (
    <div className="bg-[#F5F5F5] border-2 border-black p-4 flex flex-col gap-3">
      <div className="font-mono">
        {PSEUDOCODE.map((line, idx) => {
          const isActive = line.lineNum === activeLine;
          const isHeader = FUNCTION_HEADERS.has(line.lineNum);

          return (
            <div
              key={line.lineNum ?? `blank-${idx}`}
              style={{
                backgroundColor: isActive ? '#E0E0E0' : 'transparent',
                borderLeft: isActive ? '4px solid #000000' : '4px solid transparent',
                color: isActive ? '#000000' : isHeader ? '#000000' : '#555555',
                transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
              }}
              className="text-xs px-2 py-0.5 whitespace-pre-wrap leading-relaxed"
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {step?.description && (
        <p className="text-xs text-[#555555] leading-snug">{step.description}</p>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="flex-shrink-0"
              style={{
                width: 10,
                height: 10,
                backgroundColor: item.color,
                border: '1px solid #000000',
              }}
            />
            <span className="text-[10px] text-[#555555]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
