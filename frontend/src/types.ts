export interface AlgorithmMeta {
  id: string;
  name: string;
  time_complexity: { best: string; average: string; worst: string };
  space_complexity: string;
  description: string;
  stable: boolean;
}

export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  overwriting: number[];
  sorted: number[];
  comparisons: number;
  swaps: number;
  array_accesses: number;
}

export interface SortResponse {
  algorithm: string;
  initial_array: number[];
  steps: SortStep[];
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error';
