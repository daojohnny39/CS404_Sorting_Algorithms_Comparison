import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import type { MotionValue } from 'motion/react';
import type React from 'react';

export function useScrollStepper(
  totalSteps: number,
  containerRef: React.RefObject<HTMLElement | null>
): { stepIndex: number; scrollYProgress: MotionValue<number> } {
  const [stepIndex, setStepIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (totalSteps <= 1) {
      setStepIndex(0);
      return;
    }
    const clamped = Math.max(0, Math.min(totalSteps - 1, Math.round(latest * (totalSteps - 1))));
    setStepIndex(clamped);
  });

  return { stepIndex, scrollYProgress };
}
