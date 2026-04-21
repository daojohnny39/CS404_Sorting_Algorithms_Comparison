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
  { lineNum: 0,  text: 'function mergeSort(arr, left, right):' },
  { lineNum: 1,  text: '  if left ≥ right: return' },
  { lineNum: 2,  text: '  mid = (left + right) // 2' },
  { lineNum: 3,  text: '  mergeSort(arr, left, mid)' },
  { lineNum: 4,  text: '  mergeSort(arr, mid + 1, right)' },
  { lineNum: 5,  text: '  merge(arr, left, mid, right)' },
  { lineNum: -2, text: '' },
  { lineNum: 7,  text: 'function merge(arr, left, mid, right):' },
  { lineNum: 8,  text: '  copy arr[left..right] → temp' },
  { lineNum: 9,  text: '  i, j = 0, mid − left + 1' },
  { lineNum: 10, text: '  while i < left_len and j < len(temp):' },
  { lineNum: 11, text: '    arr[k] = min(temp[i], temp[j]); k++' },
  { lineNum: 12, text: '  copy remaining left elements' },
  { lineNum: 13, text: '  copy remaining right elements' },
];

const FUNCTION_HEADERS = new Set([0, 7]);

const LEGEND = [
  { label: 'Comparing',      color: '#EAB308' },
  { label: 'Writing',        color: '#8B5CF6' },
  { label: 'Left subarray',  color: '#3B82F6' },
  { label: 'Right subarray', color: '#60A5FA' },
  { label: 'Locally sorted', color: '#14B8A6' },
  { label: 'Complete',       color: '#22C55E' },
];

export default function PseudocodePanel({ activeLine, step }: Props) {
  return (
    <div className="bg-[#1E293B] rounded-xl border border-[#475569] p-4 flex flex-col gap-3">
      <div className="font-mono">
        {PSEUDOCODE.map((line, idx) => {
          if (line.lineNum === -2) {
            return <div key={`blank-${idx}`} className="h-3" />;
          }
          const isActive = line.lineNum === activeLine;
          const isHeader = FUNCTION_HEADERS.has(line.lineNum);

          return (
            <div
              key={line.lineNum}
              style={{
                backgroundColor: isActive ? 'rgba(234,179,8,0.15)' : 'transparent',
                borderLeft: isActive ? '2px solid #EAB308' : '2px solid transparent',
                color: isActive ? '#EAB308' : isHeader ? '#F8FAFC' : '#94A3B8',
                transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
              }}
              className="text-xs px-2 py-0.5 whitespace-pre leading-relaxed"
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {step?.description && (
        <p className="text-xs text-[#94A3B8] leading-snug">{step.description}</p>
      )}

      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="rounded-sm flex-shrink-0"
              style={{ width: 10, height: 10, backgroundColor: item.color }}
            />
            <span className="text-[10px] text-[#64748B]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
