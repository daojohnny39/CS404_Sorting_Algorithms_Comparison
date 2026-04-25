import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { postSort } from '../api';
import type { CaseType } from '../caseArrays';

interface ComparisonGraphProps {
  arraysPerAlgorithm: Record<string, number[]>;
  casesPerAlgorithm: Record<string, CaseType>;
  onBack: () => void;
}

export default function ComparisonGraph({ arraysPerAlgorithm, casesPerAlgorithm, onBack }: ComparisonGraphProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const caseLabel = (ct: CaseType) => ct === 'average' ? 'Avg' : ct === 'best' ? 'Best' : 'Worst';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const algs = ['bubble', 'merge', 'quick'];
        const results = await Promise.all(
          algs.map(async (id) => {
            const res = await postSort(id, arraysPerAlgorithm[id]);
            const lastStep = res.steps[res.steps.length - 1];
            return {
              name: id === 'bubble' ? 'Bubble Sort' : id === 'merge' ? 'Merge Sort' : 'Quick Sort',
              comparisons: lastStep.comparisons,
              swaps: lastStep.swaps,
              accesses: lastStep.array_accesses,
            };
          })
        );
        setData(results);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch comparison data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [arraysPerAlgorithm]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white text-black">
      <p className="text-lg font-medium">Calculating runtimes…</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black gap-4">
      <p className="font-bold">ERROR: {error}</p>
      <button onClick={onBack} className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold cursor-pointer">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Runtime Comparison</h2>
            <p className="text-[#555555] mt-2">
              Bubble ({caseLabel(casesPerAlgorithm.bubble ?? 'average')}) ·{' '}
              Merge ({caseLabel(casesPerAlgorithm.merge ?? 'average')}) ·{' '}
              Quick ({caseLabel(casesPerAlgorithm.quick ?? 'average')}) — {Object.values(arraysPerAlgorithm)[0]?.length ?? 10} elements
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors duration-100 font-bold cursor-pointer"
          >
            ← Back to Playground
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { key: 'comparisons', label: 'Total Comparisons', color: '#000000' },
            { key: 'swaps',       label: 'Total Swaps/Writes', color: '#555555' },
            { key: 'accesses',   label: 'Array Accesses',     color: '#AAAAAA' },
          ].map((metric) => (
            <div key={metric.key} className="border-2 border-black p-6 bg-white">
              <h3 className="text-lg font-bold mb-6 text-center">{metric.label}</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DDDDDD" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', fontSize: 12 }}
                    />
                    <Bar dataKey={metric.key} fill={metric.color} radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-black pt-6">
          <h3 className="text-xl font-bold mb-4">Summary Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-2 border-black">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-3 border border-black">Algorithm</th>
                  <th className="p-3 border border-black">Comparisons</th>
                  <th className="p-3 border border-black">Swaps / Writes</th>
                  <th className="p-3 border border-black">Array Accesses</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.name} className="hover:bg-[#F5F5F5]">
                    <td className="p-3 border border-black font-bold">{row.name}</td>
                    <td className="p-3 border border-black">{row.comparisons}</td>
                    <td className="p-3 border border-black">{row.swaps}</td>
                    <td className="p-3 border border-black">{row.accesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
