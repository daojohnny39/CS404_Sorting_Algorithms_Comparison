import type { PlaybackStatus } from '../types';

interface Props {
  status: PlaybackStatus;
  speed: number;
  stepAvailable: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onGenerate: () => void;
  onSpeedChange: (s: number) => void;
}

const btn =
  'px-4 py-2 text-sm font-bold transition-colors duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2';

export default function Controls({
  status,
  speed,
  stepAvailable,
  onPlay,
  onPause,
  onStep,
  onReset,
  onGenerate,
  onSpeedChange,
}: Props) {
  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isBusy = isPlaying || isLoading;

  return (
    <div className="bg-[#F5F5F5] border-2 border-black p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Play / Pause */}
        {isPlaying ? (
          <button onClick={onPause} className={`${btn} bg-black text-white hover:bg-[#333333]`}>
            Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            disabled={isLoading}
            className={`${btn} bg-black text-white hover:bg-[#333333]`}
          >
            {isLoading ? 'Loading…' : status === 'paused' ? 'Resume' : 'Play'}
          </button>
        )}

        {/* Step */}
        <button
          onClick={onStep}
          disabled={!stepAvailable || isBusy}
          className={`${btn} bg-white border border-black text-black hover:bg-[#E0E0E0]`}
        >
          Step →
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={status === 'idle'}
          className={`${btn} bg-white border border-black text-black hover:bg-[#E0E0E0]`}
        >
          Reset
        </button>

        {/* Generate */}
        <button
          onClick={onGenerate}
          disabled={isBusy}
          className={`${btn} bg-white border-2 border-black text-black hover:bg-[#E0E0E0]`}
        >
          New Array
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-[#555555] whitespace-nowrap select-none">
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

      </div>
    </div>
  );
}
