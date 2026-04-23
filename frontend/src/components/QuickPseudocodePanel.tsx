import type { SortStep } from '../types';

interface Props { activeLine: number; step: SortStep | null; }
interface CodeLine { lineNum: number; text: string; }
interface LegendItem { label: string; color: string; }

const PSEUDOCODE: CodeLine[] = [
  { lineNum: 0,  text: 'function quickSort(arr, left, right):' },
  { lineNum: 1,  text: '  if left >= right: return' },
  { lineNum: 2,  text: '  p = partition(arr, left, right)' },
  { lineNum: 3,  text: '  quickSort(arr, left, p - 1)' },
  { lineNum: 4,  text: '  quickSort(arr, p + 1, right)' },
  { lineNum: -2, text: '' },
  { lineNum: 6,  text: 'function partition(arr, left, right):' },
  { lineNum: 7,  text: '  pivot = arr[right]' },
  { lineNum: 8,  text: '  i = left - 1' },
  { lineNum: 9,  text: '  for j = left to right - 1:' },
  { lineNum: 10, text: '    if arr[j] <= pivot:' },
  { lineNum: 11, text: '      i++; swap(arr[i], arr[j])' },
  { lineNum: 12, text: '  swap(arr[i + 1], arr[right])' },
  { lineNum: 13, text: '  return i + 1' },
];

const FUNCTION_HEADERS = new Set([0, 6]);

const LEGEND: LegendItem[] = [
  { label: 'Pivot',    color: '#1A1A1A' },
  { label: 'Scanning', color: '#000000' },
  { label: 'Swapping', color: '#555555' },
  { label: 'Sorted',   color: '#A6A6A6' },
  { label: 'Complete', color: '#D9D9D9' },
];

export default function QuickPseudocodePanel({ activeLine, step }: Props) {
  return (
    <div className="bg-[#F5F5F5] border-2 border-black p-4 flex flex-col gap-3">
      <div className="font-mono">
        {PSEUDOCODE.map((line, idx) => {
          if (line.lineNum === -2) return <div key={`blank-${idx}`} className="h-3" />;
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
      {step?.description && (
        <p className="text-xs text-[#555555] leading-snug">{step.description}</p>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="flex-shrink-0"
              style={{ width: 10, height: 10, backgroundColor: item.color, border: '1px solid #000000' }}
            />
            <span className="text-[10px] text-[#555555]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
