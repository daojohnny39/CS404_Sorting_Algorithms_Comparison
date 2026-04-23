import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlgorithms, postSort } from '../api';
import type { AlgorithmMeta, PlaybackStatus, SortStep } from '../types';

function makeArray(size: number): number[] {
  const pool = Array.from({ length: 90 }, (_, i) => i + 10);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, size);
}

const speedToMs = (speed: number) => Math.round(1200 / speed);

export function useSorter() {
  const [algorithms, setAlgorithms] = useState<AlgorithmMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>('bubble');
  const [array, setArray] = useState<number[]>(() => makeArray(10));
  const [arraySize, setArraySizeState] = useState(10);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [speed, setSpeedState] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  const currentStepRef = useRef(currentStep);
  stepsRef.current = steps;
  currentStepRef.current = currentStep;

  useEffect(() => {
    getAlgorithms()
      .then(setAlgorithms)
      .catch(() =>
        setError('Could not connect to the backend. Make sure it is running on port 8000.')
      );
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (ms: number) => {
      clearTimer();
      intervalRef.current = setInterval(() => {
        const next = currentStepRef.current + 1;
        if (next >= stepsRef.current.length) {
          clearTimer();
          setStatus('done');
        } else {
          setCurrentStep(next);
        }
      }, ms);
    },
    [clearTimer]
  );

  const play = useCallback(async () => {
    if (!selectedId) return;

    if (status === 'paused' && steps.length > 0) {
      setStatus('playing');
      startTimer(speedToMs(speed));
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      const res = await postSort(selectedId, array);
      setSteps(res.steps);
      stepsRef.current = res.steps;
      setCurrentStep(0);
      currentStepRef.current = 0;
      setStatus('playing');
      startTimer(speedToMs(speed));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setStatus('error');
    }
  }, [selectedId, status, steps.length, array, speed, startTimer]);

  const pause = useCallback(() => {
    clearTimer();
    setStatus('paused');
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    if (steps.length === 0) return;
    clearTimer();
    const next = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(next);
    setStatus(next === steps.length - 1 ? 'done' : 'paused');
  }, [currentStep, steps.length, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setSteps([]);
    setCurrentStep(-1);
    setStatus('idle');
    setError(null);
  }, [clearTimer]);

  const generateNewArray = useCallback(() => {
    clearTimer();
    setSteps([]);
    setCurrentStep(-1);
    setStatus('idle');
    setError(null);
    setArray(makeArray(arraySize));
  }, [arraySize, clearTimer]);

  const selectAlgorithm = useCallback(
    (id: string) => {
      reset();
      setSelectedId(id);
    },
    [reset]
  );

  const setArraySize = useCallback(
    (size: number) => {
      setArraySizeState(size);
      clearTimer();
      setSteps([]);
      setCurrentStep(-1);
      setStatus('idle');
      setError(null);
      setArray(makeArray(size));
    },
    [clearTimer]
  );

  const setSpeed = useCallback(
    (s: number) => {
      setSpeedState(s);
      if (intervalRef.current !== null) {
        startTimer(speedToMs(s));
      }
    },
    [startTimer]
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  const currentStepData =
    currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

  return {
    algorithms,
    selectedAlgorithm: selectedId,
    selectedAlgorithmMeta: algorithms.find((a) => a.id === selectedId) ?? null,
    array: currentStepData ? currentStepData.array : array,
    arraySize,
    steps,
    currentStep,
    currentStepData,
    status,
    speed,
    error,
    play,
    pause,
    stepForward,
    reset,
    generateArray: generateNewArray,
    selectAlgorithm,
    setArraySize,
    setSpeed,
  };
}
