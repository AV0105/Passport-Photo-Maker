import { useEffect, useState } from 'react';

/**
 * Tiny hash-based router.
 * Returns the current hash (e.g. "#/guide/home"), and re-renders on change.
 */
export function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash || '#' : '#'
  );

  useEffect(() => {
    const onChange = () => setHash(window.location.hash || '#');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash;
}