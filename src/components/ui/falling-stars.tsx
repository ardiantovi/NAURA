'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function FallingStars({ count = 50 }: { count?: number }) {
  const [stars, setStars] = useState<
    Array<{
      id: number;
      left: string;
      size: number;
      duration: number;
      delay: number;
      className: string;
    }>
  >([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: count }, (_, i) => {
        const size = Math.random() * 2.5 + 1; // Star size between 1px and 3.5px
        let starClass = 'star';
        const type = Math.random();
        if (type > 0.9) {
            starClass += ' twinkling';
        } else if (type > 0.8) {
            starClass += ' blue';
        } else if (type > 0.7) {
            starClass += ' yellow';
        }

        return {
          id: i,
          left: `${Math.random() * 100}%`,
          size: size,
          duration: Math.random() * 3 + 4, // Duration between 4s and 7s
          delay: Math.random() * 10, // Delay up to 10s
          className: starClass,
        };
      });
      setStars(newStars);
    };

    generateStars();
  }, [count]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className={star.className}
          style={{
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
