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


export default function PseudocodePanel({ activeLine, step }: Props) {
  return (
    <div className="bg-[#F5F5F5] border-2 border-black p-4 flex flex-col gap-3">
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
                backgroundColor: isActive ? '#E0E0E0' : 'transparent',
                borderLeft: isActive ? '4px solid #000000' : '4px solid transparent',
                color: isActive ? '#000000' : isHeader ? '#000000' : '#555555',
                transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
              }}
              className="text-xs px-2 py-0.5 whitespace-pre leading-relaxed"
            >
              {line.text}
            </div>
          );
        })}
      </div>


</div>
  );
}
