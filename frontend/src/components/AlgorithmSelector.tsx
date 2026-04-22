import type { AlgorithmMeta } from '../types';

interface Props {
  algorithms: AlgorithmMeta[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function AlgorithmSelector({ algorithms, selected, onSelect }: Props) {
  return (
    <section>
      <h2 className="text-xs font-bold text-[#555555] uppercase tracking-widest mb-3">
        Algorithm
      </h2>
      <div className="flex gap-2 flex-wrap">
        {algorithms.length === 0 && (
          <p className="text-sm text-[#777777]">Loading algorithms…</p>
        )}
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            className={[
              'px-4 py-2 border text-sm font-bold transition-colors duration-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2',
              selected === algo.id
                ? 'border-black bg-black text-white'
                : 'border-black bg-white text-black hover:bg-[#E0E0E0]',
            ].join(' ')}
          >
            {algo.name}
            <span
              className={[
                'ml-2 text-xs font-mono',
                selected === algo.id ? 'text-[#AAAAAA]' : 'text-[#555555]',
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
