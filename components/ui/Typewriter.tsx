'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  words: string[];
  /** ms to hold the fully typed word before deleting */
  holdDelay?: number;
  /** ms per character when typing */
  typeSpeed?: number;
  /** ms per character when deleting */
  deleteSpeed?: number;
  className?: string;
}

export default function Typewriter({
  words,
  holdDelay = 1800,
  typeSpeed = 70,
  deleteSpeed = 40,
  className = '',
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  useEffect(() => {
    const current = words[wordIndex % words.length];

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          typeSpeed,
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('holding'), holdDelay);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'holding') {
      setPhase('deleting');
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          deleteSpeed,
        );
        return () => clearTimeout(t);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, deleteSpeed, holdDelay]);

  return (
    <span className={className}>
      {displayed}
      <span
        aria-hidden
        className="ml-[2px] inline-block h-[1em] w-[2px] translate-y-[1px] bg-accent align-middle"
        style={{ animation: 'twCursor 1s step-end infinite' }}
      />
      <style>{`
        @keyframes twCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
