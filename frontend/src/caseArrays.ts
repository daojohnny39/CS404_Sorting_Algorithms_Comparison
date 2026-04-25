export type CaseType = 'best' | 'average' | 'worst';

export const DEFAULT_CASES: Record<string, CaseType> = {
  bubble: 'average',
  merge: 'average',
  quick: 'average',
};

export const CASE_ARRAYS: Record<string, Record<CaseType, number[]>> = {
  bubble: {
    best:    [10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
    average: [50, 30, 80, 10, 90, 20, 70, 40, 60, 99],
    worst:   [99, 90, 80, 70, 60, 50, 40, 30, 20, 10],
  },
  merge: {
    best:    [10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
    average: [30, 10, 50, 99, 90, 70, 20, 80, 60, 40],
    worst:   [70, 10, 30, 50, 90, 80, 20, 40, 60, 99],
  },
  quick: {
    best:    [30, 10, 40, 20, 80, 60, 70, 90, 99, 50],
    average: [50, 30, 80, 10, 90, 20, 70, 40, 60, 99],
    worst:   [10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
  },
};
