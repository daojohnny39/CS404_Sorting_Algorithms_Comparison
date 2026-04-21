import { motion } from 'motion/react';
import type { SortStep } from '../types';

interface Props {
  array: number[];
  step: SortStep | null;
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
  bg: '#1E293B', borderColor: '#334155', textColor: '#94A3B8',
  boxShadow: '0 0 0px transparent', scale: 1, liftY: 0,
};
const COMPARING_STYLE: TileStyle = {
  bg: '#2d1f02', borderColor: '#EAB308', textColor: '#FEF08A',
  boxShadow: '0 0 22px rgba(234,179,8,0.6)', scale: 1.12, liftY: -8,
};
const OVERWRITING_STYLE: TileStyle = {
  bg: '#1e0a45', borderColor: '#8B5CF6', textColor: '#DDD6FE',
  boxShadow: '0 0 24px rgba(139,92,246,0.7)', scale: 1.16, liftY: -10,
};
const SWAPPING_STYLE: TileStyle = {
  bg: '#2d0808', borderColor: '#EF4444', textColor: '#FCA5A5',
  boxShadow: '0 0 20px rgba(239,68,68,0.6)', scale: 1.12, liftY: -8,
};
const SORTED_STYLE: TileStyle = {
  bg: '#031f1e', borderColor: '#14B8A6', textColor: '#5EEAD4',
  boxShadow: '0 0 0px transparent', scale: 1, liftY: 0,
};
const COMPLETE_STYLE: TileStyle = {
  bg: '#031a0d', borderColor: '#22C55E', textColor: '#86EFAC',
  boxShadow: '0 0 0px transparent', scale: 1, liftY: 0,
};

const ROW_HEIGHT = 82;
const TILE_SIZE = 56;
const TEMP_TILE_SIZE = 46;
const TEMP_ROW_HEIGHT = 64;
const TEMP_GAP = 20; // gap between tree and temp row

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

export default function SortTileGrid({ array, step }: Props) {
  const n = array.length;
  const MAX_DEPTH = n > 1 ? Math.ceil(Math.log2(n)) : 0;

  const hasTempRow = Boolean(step?.temp_snapshot?.length);
  // Reserve full height so the container never resizes during animation
  const containerHeight =
    (MAX_DEPTH + 1) * ROW_HEIGHT + TILE_SIZE +
    (hasTempRow ? TEMP_GAP + TEMP_ROW_HEIGHT : 0);

  // Proportional left% for a tile at index i:  ((i + 0.5) / n) * 100
  // This keeps each element at its natural proportional column regardless of
  // which sub-array it belongs to — only y changes as depth changes.
  const centerPct = (i: number) => ((i + 0.5) / n) * 100;

  return (
    <div style={{ position: 'relative', width: '100%', height: containerHeight }}>

      {/* ── Main array tiles ── */}
      {array.map((value, i) => {
        const tileStyle = getTileStyle(i, step, n);
        const segDepth = getSegmentDepth(i, step?.segments);
        // Combine row position + interactive lift into a single y transform
        const animY = segDepth * ROW_HEIGHT + tileStyle.liftY;

        return (
          <motion.div
            key={i}
            // x: '-50%' is a static transform that centers the tile on centerPct.
            // framer-motion composes this with the animated y and scale.
            style={{
              position: 'absolute',
              top: 0,
              left: `${centerPct(i)}%`,
              x: '-50%',
              width: TILE_SIZE,
              height: TILE_SIZE,
              border: '2px solid',
              borderRadius: '10px',
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
            }}
            transition={{
              y: SPRING,
              scale: SPRING,
              backgroundColor: COLOR_TRANSITION,
              borderColor: COLOR_TRANSITION,
              boxShadow: COLOR_TRANSITION,
            }}
          >
            <motion.span
              animate={{ color: tileStyle.textColor }}
              transition={COLOR_TRANSITION}
              style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.875rem', lineHeight: 1 }}
            >
              {value}
            </motion.span>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', lineHeight: 1, marginTop: '2px' }}>
              {i}
            </span>
          </motion.div>
        );
      })}

      {/* ── Temp array row (shown during merge steps) ── */}
      {hasTempRow && step?.temp_snapshot && (
        <div
          style={{
            position: 'absolute',
            top: (MAX_DEPTH + 1) * ROW_HEIGHT + TEMP_GAP,
            left: 0,
            right: 0,
          }}
        >
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, paddingLeft: 2 }}>
            temp
          </div>
          <div style={{ position: 'relative', height: TEMP_TILE_SIZE }}>
            {step.temp_snapshot.map((val, ti) => {
              const tempN = step.temp_snapshot!.length;
              const leftLen = step.temp_left_range
                ? step.temp_left_range[1] - step.temp_left_range[0] + 1
                : Math.floor(tempN / 2);
              const isLeftHalf = ti < leftLen;
              const isRightHalf = !isLeftHalf;
              const isActivePtr =
                (isLeftHalf && ti === step.temp_left_ptr) ||
                (isRightHalf && ti === step.temp_right_ptr);

              return (
                <div
                  key={ti}
                  style={{
                    position: 'absolute',
                    left: `${((ti + 0.5) / tempN) * 100}%`,
                    transform: 'translateX(-50%)',
                    width: TEMP_TILE_SIZE,
                    height: TEMP_TILE_SIZE,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontFamily: 'monospace',
                    border: isActivePtr
                      ? '2px solid #EAB308'
                      : '1px solid rgba(255,255,255,0.12)',
                    backgroundColor: isLeftHalf
                      ? 'rgba(59,130,246,0.15)'
                      : 'rgba(96,165,250,0.10)',
                    color: isActivePtr ? '#FEF08A' : '#94A3B8',
                    boxShadow: isActivePtr ? '0 0 14px rgba(234,179,8,0.4)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
