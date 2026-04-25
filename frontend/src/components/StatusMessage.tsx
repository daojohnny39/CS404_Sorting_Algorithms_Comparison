import type { PlaybackStatus } from '../types';

interface Props {
  status: PlaybackStatus;
  error: string | null;
  selectedAlgorithm: string | null;
}

export default function StatusMessage({ status, error, selectedAlgorithm }: Props) {
  if (status === 'error' && error) {
    return (
      <div className="border-2 border-black bg-white px-4 py-3 text-sm text-black">
        ERROR: {error}
      </div>
    );
  }

  if (!selectedAlgorithm && status === 'idle') {
    return (
      <div className="border border-[#777777] bg-[#F5F5F5] px-4 py-3 text-sm text-[#555555]">
        Select an algorithm above, then press Play to visualize it.
      </div>
    );
  }

  return null;
}
