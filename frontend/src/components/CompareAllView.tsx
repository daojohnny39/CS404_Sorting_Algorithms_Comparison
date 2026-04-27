import { useCompareAll, type ArrayType } from '../hooks/useCompareAll';
import BubbleSortTileGrid from './BubbleSortTileGrid';
import SortTileGrid from './SortTileGrid';
import QuickSortTileGrid from './QuickSortTileGrid';
import Controls from './Controls';

const columns = [
  { id: 'bubble', label: 'Bubble Sort', complexity: 'O(n²)' },
  { id: 'merge',  label: 'Merge Sort',  complexity: 'O(n log n)' },
  { id: 'quick',  label: 'Quick Sort',  complexity: 'O(n log n)' },
] as const;

const arrayTypeOptions: { value: ArrayType; label: string }[] = [
  { value: 'best',    label: 'Best Case'    },
  { value: 'average', label: 'Average Case' },
  { value: 'worst',   label: 'Worst Case'   },
];

export default function CompareAllView({ onBack }: { onBack: () => void }) {
  const c = useCompareAll();

  const bubbleStep = c.getStepAt(c.bubble.steps, c.bubbleCurrentStep);
  const mergeStep  = c.getStepAt(c.merge.steps,  c.mergeCurrentStep);
  const quickStep  = c.getStepAt(c.quick.steps,  c.quickCurrentStep);

  const bubbleArray = bubbleStep ? bubbleStep.array : c.sharedArray;
  const mergeArray  = mergeStep  ? mergeStep.array  : c.sharedArray;
  const quickArray  = quickStep  ? quickStep.array  : c.sharedArray;

  const stepAvailable =
    c.allLoaded &&
    c.status !== 'playing' &&
    c.status !== 'idle' &&
    c.status !== 'done';

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="border-t-2 border-black mt-4">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">

          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border-2 border-black bg-white text-black font-bold hover:bg-black hover:text-white transition-colors duration-100 cursor-pointer text-sm"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-black">Algorithm Race</h2>
          </div>

          <div>
            <h2 className="text-xs font-bold text-[#555555] uppercase tracking-widest mb-3">Array Type</h2>
            <div className="flex gap-2 flex-wrap">
              {arrayTypeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => c.setArrayType(opt.value)}
                  disabled={c.status === 'playing'}
                  className={
                    'px-4 py-2 border text-sm font-bold transition-colors duration-100 cursor-pointer ' +
                    (c.arrayType === opt.value
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-[#E0E0E0]') +
                    (c.status === 'playing' ? ' opacity-40 cursor-not-allowed' : '')
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <Controls
            status={c.status}
            speed={c.speed}
            stepAvailable={stepAvailable}
            onPlay={c.play}
            onPause={c.pause}
            onStep={c.stepForward}
            onReset={c.reset}
            onSpeedChange={c.setSpeed}
          />

          <div className="grid grid-cols-3 gap-3">
            {columns.map(col => {
              const data =
                col.id === 'bubble' ? c.bubble :
                col.id === 'merge'  ? c.merge  :
                c.quick;

              const currentStep =
                col.id === 'bubble' ? bubbleStep :
                col.id === 'merge'  ? mergeStep  :
                quickStep;

              const currentArray =
                col.id === 'bubble' ? bubbleArray :
                col.id === 'merge'  ? mergeArray  :
                quickArray;

              return (
                <div key={col.id} className="flex flex-col gap-3 border-2 border-black p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{col.label}</div>
                      <div className="text-xs text-[#555555] font-mono">{col.complexity}</div>
                    </div>
                    {c.winner === col.id && (
                      <span className="text-xs font-bold px-2 py-1 bg-black text-white">WINNER</span>
                    )}
                  </div>

                  <div>
                    {data.loading ? (
                      <div className="flex items-center justify-center h-32 text-sm text-[#777777]">Loading…</div>
                    ) : data.error ? (
                      <div className="flex items-center justify-center h-32 text-sm text-red-500">{data.error}</div>
                    ) : (
                      <>
                        {col.id === 'bubble' && <BubbleSortTileGrid array={currentArray} step={currentStep} compact />}
                        {col.id === 'merge'  && <SortTileGrid array={currentArray} step={currentStep} compact />}
                        {col.id === 'quick'  && <QuickSortTileGrid array={currentArray} step={currentStep} compact />}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
