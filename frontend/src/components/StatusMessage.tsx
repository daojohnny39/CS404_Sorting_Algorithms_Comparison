import type { PlaybackStatus } from '../types';

interface Props {
  status: PlaybackStatus;
  error: string | null;
  selectedAlgorithm: string | null;
}

export default function StatusMessage({ status, error, selectedAlgorithm }: Props) {
  if (status === 'error' && error) {
    return (
      <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
        {error}
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
        Sorting complete — press Reset to start over or generate a new array.
      </div>
    );
  }

  if (!selectedAlgorithm && status === 'idle') {
    return (
      <div className="rounded-lg border border-[#334155] bg-[#1E293B] px-4 py-3 text-sm text-[#64748B]">
        Select an algorithm above, then press Play to visualize it.
      </div>
    );
  }

  return null;
}
