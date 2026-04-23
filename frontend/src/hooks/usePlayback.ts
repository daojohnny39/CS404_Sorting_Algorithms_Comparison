import { useState, useEffect, useCallback } from 'react';

export function usePlayback(totalSteps: number) {
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused' | 'done'>('idle');
  const [playStepIndex, setPlayStepIndex] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  const isPlaying = playbackState === 'playing';

  useEffect(() => {
    if (totalSteps > 0) {
      setPlayStepIndex((prev) => Math.min(prev, totalSteps - 1));
    }
  }, [totalSteps]);

  useEffect(() => {
    if (!isPlaying) return;

    const id = setInterval(() => {
      setPlayStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setPlaybackState('done');
          return prev;
        }
        return prev + 1;
      });
    }, 400 / speed);

    return () => clearInterval(id);
  }, [isPlaying, speed, totalSteps]);

  const play = useCallback((fromIndex = 0) => {
    if (totalSteps <= 0) return;
    const clampedIndex = Math.max(0, Math.min(fromIndex, totalSteps - 1));
    setPlayStepIndex(clampedIndex);
    setPlaybackState('playing');
  }, [totalSteps]);

  const pause = useCallback(() => {
    setPlaybackState('paused');
  }, []);

  const resume = useCallback(() => {
    setPlaybackState('playing');
  }, []);

  const reset = useCallback(() => {
    setPlaybackState('idle');
    setPlayStepIndex(0);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  }, []);

  return { playStepIndex, playbackState, isPlaying, speed, play, pause, resume, reset, cycleSpeed };
}
