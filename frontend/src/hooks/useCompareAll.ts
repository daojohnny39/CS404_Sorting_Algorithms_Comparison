import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSortSteps } from './useSortSteps';
import type { PlaybackStatus, SortStep } from '../types';

export type ArrayType = 'best' | 'average' | 'worst';

const COMPARE_ARRAYS: Record<ArrayType, number[]> = {
  best:    [10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
  average: [50, 30, 80, 10, 90, 20, 70, 40, 60, 99],
  worst:   [99, 90, 80, 70, 60, 50, 40, 30, 20, 10],
};

const speedToMs = (speed: number) => Math.round(1200 / speed);

export function useCompareAll() {
  const [arrayType, setArrayType_] = useState<ArrayType>('average');
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [speed, setSpeedState] = useState(5);

  const sharedArray = COMPARE_ARRAYS[arrayType];

  const bubble = useSortSteps('bubble', sharedArray);
  const merge  = useSortSteps('merge',  sharedArray);
  const quick  = useSortSteps('quick',  sharedArray);

  // Per-algorithm step state
  const [bubbleCurrentStep, setBubbleCurrentStep] = useState(-1);
  const [mergeCurrentStep,  setMergeCurrentStep]  = useState(-1);
  const [quickCurrentStep,  setQuickCurrentStep]  = useState(-1);

  const bubbleStepRef = useRef(-1);
  const mergeStepRef  = useRef(-1);
  const quickStepRef  = useRef(-1);

  const bubbleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mergeTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const quickTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const bubbleDoneRef = useRef(false);
  const mergeDoneRef  = useRef(false);
  const quickDoneRef  = useRef(false);

  const allLoaded =
    !bubble.loading && !merge.loading && !quick.loading &&
    bubble.steps.length > 0 && merge.steps.length > 0 && quick.steps.length > 0;

  const intervals = useMemo(() => {
    if (!allLoaded) return null;
    const n = sharedArray.length;
    const baseMs = speedToMs(speed);
    const cBubble = n * n;
    const cMerge  = n * Math.log2(n);
    const cQuick  = 1.4 * n * Math.log2(n);
    const sB = bubble.steps.length;
    const sM = merge.steps.length;
    const sQ = quick.steps.length;
    return {
      bubble: baseMs,
      merge:  Math.max(16, Math.round(baseMs * (cMerge / cBubble) * (sB / sM))),
      quick:  Math.max(16, Math.round(baseMs * (cQuick / cBubble) * (sB / sQ))),
    };
  }, [allLoaded, speed, sharedArray.length, bubble.steps.length, merge.steps.length, quick.steps.length]);

  // startAlgoTimer is a plain inner function — closed over the three doneRefs and setStatus.
  // Recreated each render, which is intentional.
  function startAlgoTimer(
    timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
    stepRef: React.MutableRefObject<number>,
    setStep: (n: number) => void,
    doneRef: React.MutableRefObject<boolean>,
    totalSteps: number,
    ms: number,
  ) {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setInterval(() => {
      if (stepRef.current + 1 >= totalSteps) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        doneRef.current = true;
        if (bubbleDoneRef.current && mergeDoneRef.current && quickDoneRef.current) {
          setStatus('done');
        }
      } else {
        const next = stepRef.current + 1;
        stepRef.current = next;
        setStep(next);
      }
    }, ms);
  }

  const clearAll = useCallback(() => {
    if (bubbleTimerRef.current !== null) {
      clearInterval(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    if (mergeTimerRef.current !== null) {
      clearInterval(mergeTimerRef.current);
      mergeTimerRef.current = null;
    }
    if (quickTimerRef.current !== null) {
      clearInterval(quickTimerRef.current);
      quickTimerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (!allLoaded || !intervals) return;
    if (status === 'paused') {
      setStatus('playing');
      if (!bubbleDoneRef.current) {
        startAlgoTimer(bubbleTimerRef, bubbleStepRef, setBubbleCurrentStep, bubbleDoneRef, bubble.steps.length, intervals.bubble);
      }
      if (!mergeDoneRef.current) {
        startAlgoTimer(mergeTimerRef, mergeStepRef, setMergeCurrentStep, mergeDoneRef, merge.steps.length, intervals.merge);
      }
      if (!quickDoneRef.current) {
        startAlgoTimer(quickTimerRef, quickStepRef, setQuickCurrentStep, quickDoneRef, quick.steps.length, intervals.quick);
      }
      return;
    }
    // idle or done: reset and start fresh
    bubbleStepRef.current = 0;
    mergeStepRef.current  = 0;
    quickStepRef.current  = 0;
    setBubbleCurrentStep(0);
    setMergeCurrentStep(0);
    setQuickCurrentStep(0);
    bubbleDoneRef.current = false;
    mergeDoneRef.current  = false;
    quickDoneRef.current  = false;
    setStatus('playing');
    startAlgoTimer(bubbleTimerRef, bubbleStepRef, setBubbleCurrentStep, bubbleDoneRef, bubble.steps.length, intervals.bubble);
    startAlgoTimer(mergeTimerRef,  mergeStepRef,  setMergeCurrentStep,  mergeDoneRef,  merge.steps.length,  intervals.merge);
    startAlgoTimer(quickTimerRef,  quickStepRef,  setQuickCurrentStep,  quickDoneRef,  quick.steps.length,  intervals.quick);
  }, [allLoaded, intervals, status, bubble.steps.length, merge.steps.length, quick.steps.length]);

  const pause = useCallback(() => {
    clearAll();
    setStatus('paused');
  }, [clearAll]);

  const stepForward = useCallback(() => {
    if (!allLoaded) return;
    clearAll();
    let anyAdvanced = false;
    if (!bubbleDoneRef.current) {
      const next = Math.min(bubbleStepRef.current + 1, bubble.steps.length - 1);
      bubbleStepRef.current = next;
      setBubbleCurrentStep(next);
      if (next >= bubble.steps.length - 1) bubbleDoneRef.current = true;
      anyAdvanced = true;
    }
    if (!mergeDoneRef.current) {
      const next = Math.min(mergeStepRef.current + 1, merge.steps.length - 1);
      mergeStepRef.current = next;
      setMergeCurrentStep(next);
      if (next >= merge.steps.length - 1) mergeDoneRef.current = true;
      anyAdvanced = true;
    }
    if (!quickDoneRef.current) {
      const next = Math.min(quickStepRef.current + 1, quick.steps.length - 1);
      quickStepRef.current = next;
      setQuickCurrentStep(next);
      if (next >= quick.steps.length - 1) quickDoneRef.current = true;
      anyAdvanced = true;
    }
    if (!anyAdvanced || (bubbleDoneRef.current && mergeDoneRef.current && quickDoneRef.current)) {
      setStatus('done');
    } else {
      setStatus('paused');
    }
  }, [allLoaded, clearAll, bubble.steps.length, merge.steps.length, quick.steps.length]);

  const reset = useCallback(() => {
    clearAll();
    bubbleStepRef.current = -1;
    mergeStepRef.current  = -1;
    quickStepRef.current  = -1;
    setBubbleCurrentStep(-1);
    setMergeCurrentStep(-1);
    setQuickCurrentStep(-1);
    bubbleDoneRef.current = false;
    mergeDoneRef.current  = false;
    quickDoneRef.current  = false;
    setStatus('idle');
  }, [clearAll]);

  const setArrayType = useCallback((type: ArrayType) => {
    reset();
    setArrayType_(type);
  }, [reset]);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
    if (status === 'playing' && allLoaded) {
      const n = sharedArray.length;
      const baseMs = speedToMs(s);
      const cBubble = n * n;
      const cMerge  = n * Math.log2(n);
      const cQuick  = 1.4 * n * Math.log2(n);
      const sB = bubble.steps.length;
      const sM = merge.steps.length;
      const sQ = quick.steps.length;
      const newIntervals = {
        bubble: baseMs,
        merge:  Math.max(16, Math.round(baseMs * (cMerge / cBubble) * (sB / sM))),
        quick:  Math.max(16, Math.round(baseMs * (cQuick / cBubble) * (sB / sQ))),
      };
      if (!bubbleDoneRef.current) {
        startAlgoTimer(bubbleTimerRef, bubbleStepRef, setBubbleCurrentStep, bubbleDoneRef, sB, newIntervals.bubble);
      }
      if (!mergeDoneRef.current) {
        startAlgoTimer(mergeTimerRef, mergeStepRef, setMergeCurrentStep, mergeDoneRef, sM, newIntervals.merge);
      }
      if (!quickDoneRef.current) {
        startAlgoTimer(quickTimerRef, quickStepRef, setQuickCurrentStep, quickDoneRef, sQ, newIntervals.quick);
      }
    }
  }, [status, allLoaded, sharedArray.length, bubble.steps.length, merge.steps.length, quick.steps.length, speed]);

  useEffect(() => {
    if (bubble.loading || merge.loading || quick.loading) {
      clearAll();
      bubbleStepRef.current = -1;
      mergeStepRef.current  = -1;
      quickStepRef.current  = -1;
      setBubbleCurrentStep(-1);
      setMergeCurrentStep(-1);
      setQuickCurrentStep(-1);
      bubbleDoneRef.current = false;
      mergeDoneRef.current  = false;
      quickDoneRef.current  = false;
      setStatus('idle');
    }
  }, [bubble.loading, merge.loading, quick.loading, clearAll]);

  useEffect(() => () => clearAll(), [clearAll]);

  const getStepAt = useCallback((steps: SortStep[], i: number): SortStep | null => {
    if (i < 0 || steps.length === 0) return null;
    return steps[Math.min(i, steps.length - 1)];
  }, []);

  const winner = useMemo(() => {
    if (!allLoaded || !intervals || status !== 'done') return null;
    const durations = {
      bubble: bubble.steps.length * intervals.bubble,
      merge:  merge.steps.length  * intervals.merge,
      quick:  quick.steps.length  * intervals.quick,
    };
    const min = Math.min(durations.bubble, durations.merge, durations.quick);
    const winners = (Object.keys(durations) as Array<keyof typeof durations>).filter(
      (k) => durations[k] === min,
    );
    return winners.length === 1 ? winners[0] : null;
  }, [allLoaded, intervals, status, bubble.steps.length, merge.steps.length, quick.steps.length]);

  return {
    arrayType,
    sharedArray,
    bubble,
    merge,
    quick,
    bubbleCurrentStep,
    mergeCurrentStep,
    quickCurrentStep,
    status,
    speed,
    allLoaded,
    winner,
    play,
    pause,
    stepForward,
    reset,
    setArrayType,
    setSpeed,
    getStepAt,
  };
}
