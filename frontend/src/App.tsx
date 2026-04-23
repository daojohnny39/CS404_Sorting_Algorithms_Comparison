import { useState } from 'react';
import { useSorter } from './hooks/useSorter';
import ComparisonGraph from './components/ComparisonGraph';
import AlgorithmSelector from './components/AlgorithmSelector';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import StatusMessage from './components/StatusMessage';
import BubbleSortTileGrid from './components/BubbleSortTileGrid';
import SortTileGrid from './components/SortTileGrid';
import QuickSortTileGrid from './components/QuickSortTileGrid';
import BubblePseudocodePanel from './components/BubblePseudocodePanel';
import PseudocodePanel from './components/PseudocodePanel';
import QuickPseudocodePanel from './components/QuickPseudocodePanel';

const OPERATION_LABELS: Record<string, string> = {
  // Shared
  start:          'Initializing',
  complete:       'Complete',
  compare:        'Comparing',
  swap:           'Swapping',
  swapped:        'Swapped',
  // Bubble Sort
  pass_start:     'Pass Start',
  element_sorted: 'Sorted',
  early_exit:     'Early Exit',
  // Quick Sort
  quick_call:     'Sorting Range',
  pivot_select:   'Pivot',
  pivot_place:    'Placing Pivot',
  partition_done: 'Partitioned',
  base_case:      'Base Case',
  // Merge Sort
  split:          'Splitting',
  merge_init:     'Merging',
  write:          'Writing',
  copy_remaining: 'Copying',
  merged:         'Merged',
};

export default function App() {
  const [view, setView] = useState<'main' | 'comparison'>('main');
  const sorter = useSorter();

  if (view === 'comparison') {
    return (
      <ComparisonGraph
        initialArray={sorter.array}
        onBack={() => setView('main')}
      />
    );
  }

  const stepAvailable =
    sorter.steps.length > 0 && sorter.currentStep < sorter.steps.length - 1;

  const opLabel = sorter.currentStepData?.operation
    ? (OPERATION_LABELS[sorter.currentStepData.operation] ?? sorter.currentStepData.operation)
    : null;

  const stepLabel =
    sorter.currentStep >= 0 && sorter.steps.length > 0
      ? `${sorter.currentStep + 1} / ${sorter.steps.length}`
      : '—';

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Algorithm Playground */}
      <div className="border-t-2 border-black mt-4">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-black">Algorithm Playground</h2>
            <p className="text-sm text-[#555555] mt-1">
              Select any algorithm and play or step through at your own pace.
            </p>
          </div>

          <AlgorithmSelector
            algorithms={sorter.algorithms}
            selected={sorter.selectedAlgorithm}
            onSelect={sorter.selectAlgorithm}
          />

          <Controls
            status={sorter.status}
            speed={sorter.speed}
            stepAvailable={stepAvailable}
            onPlay={sorter.play}
            onPause={sorter.pause}
            onStep={sorter.stepForward}
            onReset={sorter.reset}
            onGenerate={sorter.generateArray}
            onSpeedChange={sorter.setSpeed}
          />

          {/* Two-column: tile grid left, pseudocode right */}
          <div className="flex gap-6">

            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Step counter + operation chip */}
              <div className="flex items-center justify-between">
                <span className="text-xs tabular-nums text-[#777777]">{stepLabel}</span>
                {opLabel && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-white border border-black text-black">
                    {opLabel}
                  </span>
                )}
              </div>

              {/* Tile grid — min-height accommodates the tallest grid (Quick Sort ~416px) */}
              <div style={{ minHeight: 420 }}>
                {sorter.selectedAlgorithm === 'bubble' && (
                  <BubbleSortTileGrid array={sorter.array} step={sorter.currentStepData} />
                )}
                {sorter.selectedAlgorithm === 'merge' && (
                  <SortTileGrid array={sorter.array} step={sorter.currentStepData} />
                )}
                {sorter.selectedAlgorithm === 'quick' && (
                  <QuickSortTileGrid array={sorter.array} step={sorter.currentStepData} />
                )}
                {!sorter.selectedAlgorithm && (
                  <div className="h-28 flex items-center justify-center text-[#AAAAAA] text-sm border-2 border-dashed border-[#DDDDDD]">
                    Select an algorithm to begin
                  </div>
                )}
              </div>

              {/* Step description */}
              <div className="min-h-[3rem]">
                {sorter.currentStepData?.description ? (
                  <p className="text-[#555555] text-sm leading-relaxed">
                    {sorter.currentStepData.description}
                  </p>
                ) : (
                  <p className="text-[#AAAAAA] text-sm">
                    {sorter.status === 'loading'
                      ? 'Loading steps from server…'
                      : sorter.selectedAlgorithm
                        ? 'Press Play to begin.'
                        : ''}
                  </p>
                )}
              </div>

              {/* Stats + complexity */}
              <StatsPanel
                step={sorter.currentStepData}
                totalSteps={sorter.steps.length}
                currentStep={sorter.currentStep}
                algorithm={sorter.selectedAlgorithmMeta}
              />
            </div>

            {/* Right column — pseudocode panel */}
            <div className="w-[340px] flex-shrink-0">
              {sorter.selectedAlgorithm === 'bubble' && (
                <BubblePseudocodePanel
                  activeLine={sorter.currentStepData?.pseudocode_line ?? -1}
                  step={sorter.currentStepData}
                />
              )}
              {sorter.selectedAlgorithm === 'merge' && (
                <PseudocodePanel
                  activeLine={sorter.currentStepData?.pseudocode_line ?? -1}
                  step={sorter.currentStepData}
                />
              )}
              {sorter.selectedAlgorithm === 'quick' && (
                <QuickPseudocodePanel
                  activeLine={sorter.currentStepData?.pseudocode_line ?? -1}
                  step={sorter.currentStepData}
                />
              )}
            </div>
          </div>

          <StatusMessage
            status={sorter.status}
            error={sorter.error}
            selectedAlgorithm={sorter.selectedAlgorithm}
          />
        </div>
      </div>

      <button
        onClick={() => setView('comparison')}
        className="fixed bottom-6 right-6 px-4 py-2 border-2 border-black bg-white font-bold hover:bg-black hover:text-white transition-colors duration-100 cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
      >
        Comparison Graph
      </button>
    </div>
  );
}
