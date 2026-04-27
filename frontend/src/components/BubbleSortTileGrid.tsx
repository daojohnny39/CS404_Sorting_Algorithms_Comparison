import { useRef } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import type { SortStep } from '../types';

interface Props {
  array: number[];
  step: SortStep | null;
  compact?: boolean;
}

interface TileStyle {
  bg: string;
  borderColor: string;
  textColor: string;
  boxShadow: string;
  scale: number;
  liftY: number;
}

const DEFAULT_STYLE: TileStyle = {
  bg: '#F2F2F2', borderColor: '#000000', textColor: '#000000',
  boxShadow: 'none', scale: 1, liftY: 0,
};
const COMPARING_STYLE: TileStyle = {
  bg: '#000000', borderColor: '#000000', textColor: '#FFFFFF',
  boxShadow: 'none', scale: 1.12, liftY: -36,
};
const SWAPPING_STYLE: TileStyle = {
  bg: '#555555', borderColor: '#000000', textColor: '#FFFFFF',
  boxShadow: 'none', scale: 1.16, liftY: -44,
};
const SORTED_STYLE: TileStyle = {
  bg: '#A6A6A6', borderColor: '#666666', textColor: '#000000',
  boxShadow: 'none', scale: 1, liftY: 0,
};
const COMPLETE_STYLE: TileStyle = {
  bg: '#D9D9D9', borderColor: '#000000', textColor: '#000000',
  boxShadow: 'none', scale: 1, liftY: 0,
};

const SPRING = { type: 'spring', stiffness: 260, damping: 28 } as const;
const COLOR_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;

function getTileStyle(index: number, step: SortStep | null, n: number): TileStyle {
  if (!step) return DEFAULT_STYLE;
  if (step.operation === 'complete') return COMPLETE_STYLE;
  if (step.swapping.includes(index)) return SWAPPING_STYLE;
  if (step.comparing.includes(index)) return COMPARING_STYLE;
  if (step.sorted.includes(index)) return step.sorted.length === n ? COMPLETE_STYLE : SORTED_STYLE;
  return DEFAULT_STYLE;
}

export default function BubbleSortTileGrid({ array, step, compact = false }: Props) {
  const n = array.length;
  const TILE_SIZE = compact ? 36 : 56;
  const ROW_HEIGHT = compact ? 34 : 52;
  const liftScale = compact ? 0.64 : 1;

  const lastKnownPositions = useRef<Map<number, number>>(new Map());
  const prevArrayRef = useRef<number[]>(array);

  if (prevArrayRef.current !== array) {
    prevArrayRef.current = array;
    lastKnownPositions.current.clear();
  }

  const containerHeight = ROW_HEIGHT + TILE_SIZE;

  const centerPct = (i: number) => ((i + 0.5) / n) * 100;

  // Deduplicated tile list keyed by value for stable identity tracking
  const seenInCurrent = new Set<number>(array);
  const seen = new Set<number>();
  const tiles: Array<{ value: number; effectiveIndex: number; displaced: boolean }> = [];

  for (const v of array) {
    if (!seen.has(v)) {
      seen.add(v);
      lastKnownPositions.current.set(v, array.indexOf(v));
      tiles.push({ value: v, effectiveIndex: array.indexOf(v), displaced: false });
    }
  }

  for (const [v, lastIndex] of lastKnownPositions.current) {
    if (!seenInCurrent.has(v)) {
      tiles.push({ value: v, effectiveIndex: lastIndex, displaced: true });
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: containerHeight }}>
      <LayoutGroup id="bubble-tile-grid">
        {tiles.map(({ value, effectiveIndex, displaced }) => {
          const tileStyle = displaced ? DEFAULT_STYLE : getTileStyle(effectiveIndex, step, n);
          const animY = tileStyle.liftY * liftScale;

          return (
            <motion.div
              key={value}
              layout="position"
              style={{
                position: 'absolute',
                left: `${centerPct(effectiveIndex)}%`,
                top: ROW_HEIGHT,
                marginLeft: -TILE_SIZE / 2,
                width: TILE_SIZE,
                height: TILE_SIZE,
                border: '2px solid',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                userSelect: 'none',
                zIndex: tileStyle.scale > 1 ? 20 : 10,
              }}
              animate={{
                y: animY,
                scale: tileStyle.scale,
                backgroundColor: tileStyle.bg,
                borderColor: tileStyle.borderColor,
                boxShadow: tileStyle.boxShadow,
                opacity: displaced ? 0 : 1,
              }}
              transition={{
                layout: SPRING,
                y: SPRING,
                scale: SPRING,
                backgroundColor: COLOR_TRANSITION,
                borderColor: COLOR_TRANSITION,
                boxShadow: COLOR_TRANSITION,
                opacity: COLOR_TRANSITION,
              }}
            >
              <motion.span
                animate={{ color: tileStyle.textColor }}
                transition={COLOR_TRANSITION}
                style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontWeight: 'bold', fontSize: compact ? '0.7rem' : '0.875rem', lineHeight: 1 }}
              >
                {value}
              </motion.span>
              <span style={{ fontSize: '9px', color: 'rgba(0,0,0,0.25)', lineHeight: 1, marginTop: '2px' }}>
                {effectiveIndex}
              </span>
            </motion.div>
          );
        })}
      </LayoutGroup>
    </div>
  );
}
