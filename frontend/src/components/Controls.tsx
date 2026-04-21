import type { PlaybackStatus } from '../types';

interface Props {
  status: PlaybackStatus;
  speed: number;
  arraySize: number;
  stepAvailable: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onSpeedChange: (s: number) => void;
  onArraySizeChange: (s: number) => void;
}

const btn =
  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

export default function Controls({
  status,
  speed,
  arraySize,
  stepAvailable,
  onPlay,
  onPause,
  onStep,
  onReset,
  onGenerate,
  onSpeedChange,
  onArraySizeChange,
}: Props) {
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isBusy = isPlaying || isLoading;

  return (
    <div className="bg-[#1E293B] rounded-xl border border-[#475569] p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Play / Pause */}
        {isPlaying ? (
          <button onClick={onPause} className={`${btn} bg-[#EAB308] text-black hover:bg-yellow-400`}>
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={isLoading}
            className={`${btn} bg-[#22C55E] text-black hover:bg-green-400`}
          >
            {isLoading ? 'Loading…' : status === 'paused' ? 'Resume' : 'Play'}
          </button>
        )}

        {/* Step */}
        <button
          onClick={onStep}
          disabled={!stepAvailable || isBusy}
          className={`${btn} bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]`}
        >
          Step →
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={status === 'idle'}
          className={`${btn} bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]`}
        >
          Reset
        </button>

        {/* Generate */}
        <button
          onClick={onGenerate}
          disabled={isBusy}
          className={`${btn} border border-[#475569] text-[#F8FAFC] hover:border-[#64748B] hover:bg-[#273548]`}
        >
          New Array
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-[#94A3B8] whitespace-nowrap select-none">
            Speed: {speed}x
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-24"
          />
        </div>

        {/* Array size */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#94A3B8] whitespace-nowrap select-none">
            Size: {arraySize}
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={arraySize}
            disabled={isBusy}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
