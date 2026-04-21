import { useSorter } from './hooks/useSorter';
import Header from './components/Header';
import AlgorithmSelector from './components/AlgorithmSelector';
import BarVisualizer from './components/BarVisualizer';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import StatusMessage from './components/StatusMessage';
import ScrollSortVisualizer from './components/ScrollSortVisualizer';

export default function App() {
  const sorter = useSorter();

  const stepAvailable =
    sorter.steps.length > 0 && sorter.currentStep < sorter.steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Header />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8 text-center">
        <h1 className="text-4xl font-bold text-[#F8FAFC] mb-3 tracking-tight">
          Sorting Algorithm Visualizer
        </h1>
        <p className="text-[#94A3B8] text-lg max-w-xl mx-auto">
          Interactive step-by-step visualizations of classic sorting algorithms.
        </p>
        <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-[#475569] animate-pulse">
          <span>Scroll down to explore Merge Sort</span>
          <span>↓</span>
        </div>
      </div>

      {/* Merge Sort scroll demo */}
      <div className="border-t border-[#1E293B]">
        <ScrollSortVisualizer />
      </div>

      {/* Algorithm Playground */}
      <div className="border-t border-[#1E293B] mt-4">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          <div className="mb-2">
            <h2 className="text-xl font-bold text-[#F8FAFC]">Algorithm Playground</h2>
            <p className="text-sm text-[#94A3B8] mt-1">
              Select any algorithm and play or step through at your own pace.
            </p>
          </div>
          <AlgorithmSelector
            algorithms={sorter.algorithms}
            selected={sorter.selectedAlgorithm}
            onSelect={sorter.selectAlgorithm}
          />
          <BarVisualizer array={sorter.array} step={sorter.currentStepData} />
          <Controls
            status={sorter.status}
            speed={sorter.speed}
            arraySize={sorter.arraySize}
            stepAvailable={stepAvailable}
            onPlay={sorter.play}
            onPause={sorter.pause}
            onStep={sorter.stepForward}
            onReset={sorter.reset}
            onGenerate={sorter.generateArray}
            onSpeedChange={sorter.setSpeed}
            onArraySizeChange={sorter.setArraySize}
          />
          <StatsPanel
            step={sorter.currentStepData}
            totalSteps={sorter.steps.length}
            currentStep={sorter.currentStep}
            algorithm={sorter.selectedAlgorithmMeta}
          />
          <StatusMessage
            status={sorter.status}
            error={sorter.error}
            selectedAlgorithm={sorter.selectedAlgorithm}
          />
        </div>
      </div>
    </div>
  );
}
