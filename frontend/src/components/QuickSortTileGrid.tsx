import { useRef } from 'react';
import { motion } from 'motion/react';
import type { SortStep } from '../types';

interface Props { array: number[]; step: SortStep | null; }
interface TileStyle { bg: string; borderColor: string; textColor: string; boxShadow: string; scale: number; liftY: number; }

const DEFAULT_STYLE: TileStyle = { bg: '#F2F2F2', borderColor: '#000000', textColor: '#000000', boxShadow: 'none', scale: 1, liftY: 0 };
const COMPARING_STYLE: TileStyle = { bg: '#000000', borderColor: '#000000', textColor: '#FFFFFF', boxShadow: 'none', scale: 1.12, liftY: -36 };
const SCANNING_STYLE: TileStyle = { bg: '#000000', borderColor: '#000000', textColor: '#FFFFFF', boxShadow: 'none', scale: 1.12, liftY: -36 };
const SWAPPING_STYLE: TileStyle = { bg: '#555555', borderColor: '#000000', textColor: '#FFFFFF', boxShadow: 'none', scale: 1.12, liftY: -36 };
const PIVOT_STYLE: TileStyle = { bg: '#1A1A1A', borderColor: '#000000', textColor: '#FFFFFF', boxShadow: 'none', scale: 1.1, liftY: -28 };
const SORTED_STYLE: TileStyle = { bg: '#A6A6A6', borderColor: '#666666', textColor: '#000000', boxShadow: 'none', scale: 1, liftY: 0 };
const COMPLETE_STYLE: TileStyle = { bg: '#D9D9D9', borderColor: '#000000', textColor: '#000000', boxShadow: 'none', scale: 1, liftY: 0 };

const ROW_HEIGHT = 60;
const TILE_SIZE = 56;
const SPRING = { type: 'spring', stiffness: 260, damping: 28 } as const;
const COLOR_TRANSITION = { duration: 0.18, ease: 'easeOut' } as const;

function getTileStyle(index: number, step: SortStep | null): TileStyle {
  if (!step) return DEFAULT_STYLE;
  if (step.operation === 'complete') return COMPLETE_STYLE;
  if (step.swapping?.includes(index)) return SWAPPING_STYLE;
  if (index === step.pivot_index) return PIVOT_STYLE;
  if (index === step.scan_index) return SCANNING_STYLE;
  if (step.comparing?.includes(index)) return COMPARING_STYLE;
  if (step.sorted?.includes(index)) return SORTED_STYLE;
  return DEFAULT_STYLE;
}

function getSegmentDepth(index: number, segments: number[][] | undefined): number {
  if (!segments || segments.length === 0) return 0;
  const seg = segments.find(([left, right]) => index >= left && index <= right);
  return seg ? seg[2] : 0;
}

export default function QuickSortTileGrid({ array, step }: Props) {
  const n = array.length;
  const MAX_DEPTH = Math.min(n - 1, 5);
  const lastKnownPositions = useRef<Map<number, number>>(new Map());
  const prevArrayRef = useRef<number[]>(array);

  if (prevArrayRef.current !== array) {
    prevArrayRef.current = array;
    lastKnownPositions.current.clear();
  }

  const containerHeight = (MAX_DEPTH + 1) * ROW_HEIGHT + TILE_SIZE;
  const centerPct = (i: number) => ((i + 0.5) / n) * 100;

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

  const showPartitionLine =
    step?.partition_index !== undefined && step.partition_index >= 0 && step.partition_index < n - 1;

  return (
    <div style={{ position: 'relative', width: '100%', height: containerHeight }}>
      {showPartitionLine && (
        <div
          style={{
            position: 'absolute',
            left: `${centerPct(step!.partition_index! + 0.5)}%`,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'rgba(0,0,0,0.15)',
            zIndex: 0,
          }}
        />
      )}
      {tiles.map(({ value, effectiveIndex, displaced }) => {
        const tileStyle = displaced ? DEFAULT_STYLE : getTileStyle(effectiveIndex, step);
        const segDepth = displaced ? 0 : getSegmentDepth(effectiveIndex, step?.segments);
        const animY = segDepth * ROW_HEIGHT + tileStyle.liftY;

        return (
          <motion.div
            key={value}
            initial={{ left: `${centerPct(effectiveIndex)}%` }}
            style={{
              position: 'absolute',
              top: 0,
              x: '-50%',
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
              left: `${centerPct(effectiveIndex)}%`,
              y: animY,
              scale: tileStyle.scale,
              backgroundColor: tileStyle.bg,
              borderColor: tileStyle.borderColor,
              boxShadow: tileStyle.boxShadow,
              opacity: displaced ? 0 : 1,
            }}
            transition={{
              left: SPRING,
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
              style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontWeight: 'bold', fontSize: '0.875rem', lineHeight: 1 }}
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
