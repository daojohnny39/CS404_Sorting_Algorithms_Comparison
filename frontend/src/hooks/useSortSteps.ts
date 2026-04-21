import { useState, useEffect } from 'react';
import { postSort } from '../api';
import type { SortStep } from '../types';

export function useSortSteps(algorithm: string, array: number[]) {
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const arrayKey = array.join(',');

  useEffect(() => {
    if (!algorithm || array.length === 0) return;

    let cancelled = false;
    setSteps([]);
    setLoading(true);
    setError(null);

    postSort(algorithm, array)
      .then((response) => {
        if (!cancelled) setSteps(response.steps);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'An error occurred');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, arrayKey]);

  return { steps, loading, error };
}
