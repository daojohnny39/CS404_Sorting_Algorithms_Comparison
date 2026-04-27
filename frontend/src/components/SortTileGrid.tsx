import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
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
const OVERWRITING_STYLE: TileStyle = {
  bg: '#333333', borderColor: '#000000', textColor: '#FFFFFF',
  boxShadow: 'none', scale: 1.16, liftY: -44,
};
const SWAPPING_STYLE: TileStyle = {
  bg: '#666666', borderColor: '#000000', textColor: '#FFFFFF',
  boxShadow: 'none', scale: 1.12, liftY: -36,
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
  if (step.overwriting.includes(index)) return OVERWRITING_STYLE;
  if (step.comparing.includes(index)) return COMPARING_STYLE;
  if (step.swapping.includes(index)) return SWAPPING_STYLE;
  if (step.sorted.includes(index)) return step.sorted.length === n ? COMPLETE_STYLE : SORTED_STYLE;
  return DEFAULT_STYLE;
}

function getSegmentDepth(index: number, segments: number[][] | undefined): number {
  if (!segments || segments.length === 0) return 0;
  const seg = segments.find(([left, right]) => index >= left && index <= right);
  return seg ? seg[2] : 0;
}

export default function SortTileGrid({ array, step, compact = false }: Props) {
  const n = array.length;
  const TILE_SIZE = compact ? 36 : 56;
  const ROW_HEIGHT = compact ? 52 : 82;
  const TOP_OFFSET = compact ? 34 : 52;
  const liftScale = compact ? 0.64 : 1;
  const MAX_DEPTH = n > 1 ? Math.ceil(Math.log2(n)) : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const lastKnownPositions = useRef<Map<number, number>>(new Map());
  const knownValues = useRef<Set<number>>(new Set());

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateWidth = () => setContainerWidth(node.getBoundingClientRect().width);
    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, []);

  // Detect a genuinely new sort: a value appears that was never seen before,
  // AND knownValues is already non-empty (i.e., a previous sort had run).
  const isNewSort = knownValues.current.size > 0 && array.some(v => !knownValues.current.has(v));
  if (isNewSort) {
    lastKnownPositions.current.clear();
    knownValues.current.clear();
  }
  array.forEach(v => knownValues.current.add(v));

  const containerHeight =
    TOP_OFFSET + (MAX_DEPTH + 1) * ROW_HEIGHT + TILE_SIZE;

  const tileX = (i: number) => (n === 0 ? 0 : ((i + 0.5) / n) * containerWidth - TILE_SIZE / 2);

  const seenInCurrent = new Set<number>(array);
  const seen = new Set<number>();
  const tiles: Array<{ value: number; effectiveIndex: number; displaced: boolean }> = [];

  // Fix: prioritize write_index so the tile for write_value lands at k (the write
  // destination) rather than at P (its stale original position still in the array).
  if (step && step.write_index != null && step.write_index >= 0 && step.write_value != null) {
    const wv = step.write_value;
    const wi = step.write_index;
    seen.add(wv);
    lastKnownPositions.current.set(wv, wi);
    tiles.push({ value: wv, effectiveIndex: wi, displaced: false });
  }

  array.forEach((v, index) => {
    if (!seen.has(v)) {
      seen.add(v);
      lastKnownPositions.current.set(v, index);
      tiles.push({ value: v, effectiveIndex: index, displaced: false });
    }
  });

  for (const [v, lastIndex] of lastKnownPositions.current) {
    if (!seenInCurrent.has(v)) {
      tiles.push({ value: v, effectiveIndex: lastIndex, displaced: true });
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: containerHeight }}>
      {containerWidth > 0 && tiles.map(({ value, effectiveIndex, displaced }) => {
        const tileStyle = displaced ? DEFAULT_STYLE : getTileStyle(effectiveIndex, step, n);
        const segDepth = displaced ? 0 : getSegmentDepth(effectiveIndex, step?.segments);
        const x = tileX(effectiveIndex);
        const y = TOP_OFFSET + segDepth * ROW_HEIGHT + tileStyle.liftY * liftScale;

        return (
          <motion.div
            key={value}
            initial={{ x, y, opacity: displaced ? 0.15 : 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
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
              x,
              y,
              scale: tileStyle.scale,
              backgroundColor: tileStyle.bg,
              borderColor: tileStyle.borderColor,
              boxShadow: tileStyle.boxShadow,
              opacity: displaced ? 0.15 : 1,
            }}
            transition={{
              x: SPRING,
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
    </div>
  );
}
