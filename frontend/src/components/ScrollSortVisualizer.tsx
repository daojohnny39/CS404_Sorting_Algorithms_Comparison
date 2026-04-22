import { useRef, useState, useMemo } from 'react';
import { useSortSteps } from '../hooks/useSortSteps';
import { useScrollStepper } from '../hooks/useScrollStepper';
import SortTileGrid from './SortTileGrid';
import PseudocodePanel from './PseudocodePanel';

function generateArray(): number[] {
  const values = Array.from({ length: 90 }, (_, i) => i + 10);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.slice(0, 10);
}

const OPERATION_LABELS: Record<string, string> = {
  start:          'Initializing',
  split:          'Splitting',
  merge_init:     'Merging',
  compare:        'Comparing',
  write:          'Writing',
  copy_remaining: 'Copying',
  merged:         'Merged',
  complete:       'Complete',
};

export default function ScrollSortVisualizer() {
  const [array, setArray] = useState<number[]>(() => generateArray());
  const containerRef = useRef<HTMLDivElement>(null);

  const { steps, loading, error } = useSortSteps('merge', array);
  const { stepIndex } = useScrollStepper(
    steps.length,
    containerRef as React.RefObject<HTMLElement | null>
  );

  const currentStep = steps.length > 0 ? steps[stepIndex] : null;
  const displayArray = currentStep ? currentStep.array : array;
  const progress = steps.length > 0 ? (stepIndex + 1) / steps.length : 0;

  const scrollHeight = useMemo(
    () => Math.max(5000, Math.min(18000, steps.length * 50)),
    [steps.length]
  );

  const handleNewArray = () => {
    if (containerRef.current) {
      const top = containerRef.current.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setArray(generateArray());
  };

  const opLabel = currentStep?.operation ? (OPERATION_LABELS[currentStep.operation] ?? currentStep.operation) : null;

  return (
    <section>
      {/* Section header — outside the scroll container */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#777777] uppercase tracking-widest mb-2">
              Scroll to explore
            </p>
            <h2 className="text-3xl font-bold text-black">Merge Sort</h2>
            <p className="text-[#555555] text-sm mt-2">
              10 elements ·{' '}
              {steps.length > 0 ? `${steps.length} steps` : loading ? 'loading…' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3 pb-1">
            <div className="flex gap-1.5">
              {['O(n log n)', 'stable', 'O(n) space'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-black border border-black"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={handleNewArray}
              disabled={loading}
              className="px-4 py-2 text-sm font-bold bg-white text-black border-2 border-black hover:bg-[#E0E0E0] transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              New Array
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {steps.length > 0 && (
          <div className="mt-6 h-3 bg-white border border-black overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <p className="text-sm text-black bg-white border-2 border-black px-4 py-3">
            ERROR: {error}
          </p>
        </div>
      )}

      {/* Tall scroll container */}
      <div ref={containerRef} style={{ height: `${scrollHeight}px`, position: 'relative' }}>
        {/* Sticky panel */}
        <div
          className="sticky max-w-7xl mx-auto px-6"
          style={{ top: 56, height: 'calc(100vh - 56px)', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
        >
          <div className="flex gap-6 h-full">

            {/* ── Left column: tiles + context ── */}
            <div className="flex flex-col flex-1 min-w-0 gap-4">

              {/* Top bar: step counter + operation chip */}
              <div className="flex items-center justify-between flex-shrink-0">
                <span className="text-xs tabular-nums text-[#777777]">
                  {steps.length > 0 ? `${stepIndex + 1} / ${steps.length}` : '—'}
                </span>
                {opLabel && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-white border border-black text-black">
                    {opLabel}
                  </span>
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* The tiles — hero element */}
              <div className="flex-shrink-0">
                <SortTileGrid array={displayArray} step={currentStep} />
              </div>

              {/* Step description */}
              <div className="flex-shrink-0 min-h-[3rem]">
                {currentStep?.description ? (
                  <p className="text-[#555555] text-sm leading-relaxed">
                    {currentStep.description}
                  </p>
                ) : (
                  <p className="text-[#AAAAAA] text-sm">
                    {loading ? 'Loading steps from server…' : 'Scroll down to begin.'}
                  </p>
                )}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Stats strip */}
              <div className="flex-shrink-0 flex items-center gap-6 border-t-2 border-black pt-4">
                {[
                  { label: 'Comparisons', value: currentStep?.comparisons ?? 0 },
                  { label: 'Writes',      value: currentStep?.swaps ?? 0 },
                  { label: 'Accesses',    value: currentStep?.array_accesses ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-[10px] uppercase tracking-widest text-[#777777] mb-0.5">{label}</div>
                    <div className="text-2xl font-bold font-mono tabular-nums leading-none text-black">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column: pseudocode ── */}
            <div className="w-[340px] flex-shrink-0 overflow-y-auto">
              <PseudocodePanel
                activeLine={currentStep?.pseudocode_line ?? -1}
                step={currentStep}
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
