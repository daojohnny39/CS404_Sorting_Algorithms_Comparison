import type { AlgorithmMeta } from '../types';

interface Props {
  algorithms: AlgorithmMeta[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function AlgorithmSelector({ algorithms, selected, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest mb-3">
        Algorithm
      </h2>
      <div className="flex gap-2 flex-wrap">
        {algorithms.length === 0 && (
          <p className="text-sm text-[#64748B]">Loading algorithms…</p>
        )}
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            className={[
              'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 cursor-pointer',
              selected === algo.id
                ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
                : 'border-[#475569] bg-[#1E293B] text-[#F8FAFC] hover:border-[#64748B] hover:bg-[#273548]',
            ].join(' ')}
          >
            {algo.name}
            <span
              className={[
                'ml-2 text-xs font-mono',
                selected === algo.id ? 'text-[#22C55E]/70' : 'text-[#64748B]',
              ].join(' ')}
            >
              {algo.time_complexity.worst}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
