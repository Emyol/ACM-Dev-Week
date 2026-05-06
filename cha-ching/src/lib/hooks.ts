'use client';

import { useState, useRef, useEffect } from 'react';

// Animated number counter hook
export function useCountTo(target: number, duration = 600) {
  const [v, setV] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(performance.now());

  useEffect(() => {
    fromRef.current = v;
    startRef.current = performance.now();
    let raf: number;
    const tick = () => {
      const t = Math.min(1, (performance.now() - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = fromRef.current + (target - fromRef.current) * eased;
      setV(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [target]);
  return v;
}
