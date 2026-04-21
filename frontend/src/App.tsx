import { useSorter } from './hooks/useSorter';
import Header from './components/Header';
import AlgorithmSelector from './components/AlgorithmSelector';
import BarVisualizer from './components/BarVisualizer';
import Controls from './components/Controls';
import StatsPanel from './components/StatsPanel';
import StatusMessage from './components/StatusMessage';

export default function App() {
  const sorter = useSorter();

  const stepAvailable =
    sorter.steps.length > 0 && sorter.currentStep < sorter.steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
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
      </main>
    </div>
  );
}
