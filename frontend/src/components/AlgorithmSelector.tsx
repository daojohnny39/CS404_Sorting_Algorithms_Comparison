import type { AlgorithmMeta } from '../types';
import type { CaseType } from '../caseArrays';

interface Props {
  algorithms: AlgorithmMeta[];
  selected: string | null;
  onSelect: (id: string) => void;
  casePerAlgorithm: Record<string, CaseType>;
  onSetCase: (ct: CaseType) => void;
  disabled: boolean;
}

export default function AlgorithmSelector({
  algorithms,
  selected,
  onSelect,
  casePerAlgorithm,
  onSetCase,
  disabled,
}: Props) {
  const cases: { value: CaseType; label: string }[] = [
    { value: 'best', label: 'Best' },
    { value: 'average', label: 'Avg' },
    { value: 'worst', label: 'Worst' },
  ];

  return (
    <section>
      <h2 className="text-xs font-bold text-[#555555] uppercase tracking-widest mb-3">
        Algorithm
      </h2>
      <div className="flex gap-4 flex-wrap items-start">
        {algorithms.length === 0 && (
          <p className="text-sm text-[#777777]">Loading algorithms…</p>
        )}
        {algorithms.map((algo) => (
          <div key={algo.id} className="flex flex-col gap-1">
            <button
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
            <div className="flex gap-1">
              {cases.map((ct) => {
                const isActive = selected === algo.id && casePerAlgorithm[algo.id] === ct.value;
                const isDisabled = algo.id !== selected || disabled;
                return (
                  <button
                    key={ct.value}
                    disabled={isDisabled}
                    onClick={() => onSetCase(ct.value)}
                    className={[
                      'px-3 py-1 text-xs font-bold border transition-colors duration-100 cursor-pointer',
                      isActive
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-[#E0E0E0]',
                      isDisabled ? 'opacity-40 cursor-not-allowed' : '',
                    ].join(' ')}
                  >
                    {ct.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
