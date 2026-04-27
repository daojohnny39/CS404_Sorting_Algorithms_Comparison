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
  operation?: string;
  description?: string;
  pseudocode_line?: number;
  range?: number[];
  left_range?: number[];
  right_range?: number[];
  depth?: number;
  segments?: number[][];        // each inner array: [left, right, depth]
  merge_range?: number[];
  pivot_index?: number;
  partition_index?: number;
  scan_index?: number;
}

export interface SortResponse {
  algorithm: string;
  initial_array: number[];
  steps: SortStep[];
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'done' | 'error';
