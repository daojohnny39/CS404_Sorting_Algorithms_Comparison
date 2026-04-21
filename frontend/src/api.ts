import type { AlgorithmMeta, SortResponse } from './types';

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';

export async function getAlgorithms(): Promise<AlgorithmMeta[]> {
  const res = await fetch(`${BASE}/algorithms`);
  if (!res.ok) throw new Error('Failed to load algorithms from backend');
  return res.json() as Promise<AlgorithmMeta[]>;
}

export async function postSort(algorithm: string, array: number[]): Promise<SortResponse> {
  const res = await fetch(`${BASE}/sort`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ algorithm, array }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string };
    throw new Error(err.detail ?? `Sort request failed (${res.status})`);
  }
  return res.json() as Promise<SortResponse>;
}
