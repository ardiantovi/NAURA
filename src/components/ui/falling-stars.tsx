'use client';

import { useState, useEffect } from 'react';

export function FallingStars({ count = 30 }: { count?: number }) {
  const [stars, setStars] = useState<
    Array<{
      id: number;
      left: string;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: count }, (_, i) => {
        const size = Math.random() * 2.5 + 1; // Star size between 1px and 3.5px
        return {
          id: i,
          left: `${Math.random() * 100}%`,
          size: size,
          duration: Math.random() * 3 + 2, // Duration between 2s and 5s
          delay: Math.random() * 5, // Delay up to 5s
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
          className="star"
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
